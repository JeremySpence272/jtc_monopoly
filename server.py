#!/usr/bin/env python3
"""
Monopoly Game Code Testing Server
Receives Python code submissions and validates them using question-specific test suites
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import sys
import os
import tempfile
import re
import json
from pathlib import Path
from tests import run_test, TEST_REGISTRY

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Path to game state file
GAME_STATE_FILE = Path(__file__).parent / "game_state.json"

def normalize_output(output: str) -> str:
    """Normalize output for comparison (strip whitespace, handle newlines)"""
    if not output:
        return ""
    # Remove trailing whitespace from each line
    lines = [line.rstrip() for line in output.split('\n')]
    # Remove trailing empty lines
    while lines and not lines[-1]:
        lines.pop()
    return '\n'.join(lines)

def execute_code(code: str, timeout: int = 5) -> tuple[str, str, bool]:
    """
    Execute Python code safely and return (stdout, stderr, success)
    Returns empty strings and False if execution fails
    """
    try:
        # Create a temporary file for the code
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        try:
            # Execute the code with timeout
            result = subprocess.run(
                [sys.executable, temp_file],
                capture_output=True,
                text=True,
                timeout=timeout,
                cwd=tempfile.gettempdir()
            )
            
            stdout = normalize_output(result.stdout)
            stderr = normalize_output(result.stderr)
            success = result.returncode == 0
            
            return stdout, stderr, success
        finally:
            # Clean up temp file
            if os.path.exists(temp_file):
                os.unlink(temp_file)
                
    except subprocess.TimeoutExpired:
        return "", "Code execution timed out (exceeded 5 seconds)", False
    except Exception as e:
        return "", f"Execution error: {str(e)}", False

def compare_outputs(actual: str, expected: str) -> bool:
    """
    Compare actual output with expected output
    Handles newline variations and whitespace differences
    """
    actual_normalized = normalize_output(actual)
    expected_normalized = normalize_output(expected)
    
    # Handle escaped newlines in expected output (e.g., "1\\n2\\n3")
    if '\\n' in expected_normalized:
        expected_normalized = expected_normalized.replace('\\n', '\n')
        expected_normalized = normalize_output(expected_normalized)
    
    # Direct comparison
    if actual_normalized == expected_normalized:
        return True
    
    # Try comparing line by line (ignoring trailing whitespace)
    actual_lines = [line.rstrip() for line in actual_normalized.split('\n')]
    expected_lines = [line.rstrip() for line in expected_normalized.split('\n')]
    
    if actual_lines == expected_lines:
        return True
    
    # For some questions, expected_output might be a pattern
    # Check if actual output contains expected (for partial matches)
    if expected_normalized in actual_normalized:
        return True
    
    return False

@app.route('/test-code', methods=['POST'])
def test_code():
    """
    Test Python code using question-specific test suite
    Request body: { "code": str, "question_id": str }
    Response: { "success": bool, "valid": bool, "output": str, "error": str, "test_result": dict }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "valid": False,
                "output": "",
                "error": "No data provided"
            }), 400
        
        code = data.get('code', '').strip()
        question_id = data.get('question_id', '').strip()
        
        if not code:
            return jsonify({
                "success": False,
                "valid": False,
                "output": "",
                "error": "No code provided"
            }), 400
        
        if not question_id:
            return jsonify({
                "success": False,
                "valid": False,
                "output": "",
                "error": "No question_id provided"
            }), 400
        
        # Check if test exists for this question
        if question_id not in TEST_REGISTRY:
            return jsonify({
                "success": False,
                "valid": False,
                "output": "",
                "error": f"No test suite found for question_id: {question_id}"
            }), 400
        
        # Run the specific test suite for this question
        # The test suite handles execution with proper variable setup and error checking
        test_results = run_test(question_id, code)
        
        # Get output from test results (captured during first test execution)
        output = test_results.get("output", "")
        
        return jsonify({
            "success": True,
            "valid": test_results["passed"],
            "output": output,
            "error": None if test_results["passed"] else test_results.get("error_message", test_results["message"]),
            "test_result": {
                "message": test_results["message"],
                "tests": test_results["tests"]
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "valid": False,
            "output": "",
            "error": f"Server error: {str(e)}"
        }), 500

@app.route('/save-game-state', methods=['POST'])
def save_game_state():
    """
    Save game state to game_state.json file
    Request body: { "gameState": string (JSON string) }
    Response: { "success": bool, "message": str }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "message": "No data provided"
            }), 400
        
        game_state = data.get('gameState')
        
        if game_state is None:
            return jsonify({
                "success": False,
                "message": "No gameState provided"
            }), 400
        
        # gameState is already a JSON string from the frontend
        # Write it directly to the file
        with open(GAME_STATE_FILE, 'w') as f:
            if isinstance(game_state, str):
                # It's already a JSON string, write it as-is
                f.write(game_state)
            else:
                # It's an object, stringify it
                json.dump(game_state, f, indent=2)
        
        return jsonify({
            "success": True,
            "message": "Game state saved successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error saving game state: {str(e)}"
        }), 500

@app.route('/load-game-state', methods=['GET'])
def load_game_state():
    """
    Load game state from game_state.json file
    Response: { "success": bool, "gameState": string (JSON string), "message": str }
    """
    try:
        if not GAME_STATE_FILE.exists():
            return jsonify({
                "success": False,
                "gameState": None,
                "message": "No saved game state found"
            }), 404
        
        # Read the file as a string (it contains a JSON string)
        with open(GAME_STATE_FILE, 'r') as f:
            game_state = f.read()
        
        # Validate it's valid JSON
        try:
            json.loads(game_state)
        except json.JSONDecodeError:
            return jsonify({
                "success": False,
                "gameState": None,
                "message": "Invalid JSON in game state file"
            }), 400
        
        return jsonify({
            "success": True,
            "gameState": game_state,
            "message": "Game state loaded successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "gameState": None,
            "message": f"Error loading game state: {str(e)}"
        }), 500

@app.route('/reset-game-state', methods=['POST'])
def reset_game_state():
    """
    Reset/delete game_state.json file
    Response: { "success": bool, "message": str }
    """
    try:
        if GAME_STATE_FILE.exists():
            GAME_STATE_FILE.unlink()
        
        return jsonify({
            "success": True,
            "message": "Game state reset successfully"
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error resetting game state: {str(e)}"
        }), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "ok"}), 200

if __name__ == '__main__':
    print("Starting Monopoly Code Testing Server on http://localhost:5001")
    print("Endpoints:")
    print("  POST /test-code - Test Python code")
    print("  POST /save-game-state - Save game state to file")
    print("  GET  /load-game-state - Load game state from file")
    print("  POST /reset-game-state - Reset game state file")
    print("  GET  /health - Health check")
    app.run(host='0.0.0.0', port=5001, debug=True)

