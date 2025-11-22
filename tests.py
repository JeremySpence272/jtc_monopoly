"""
Test suite for Monopoly game code challenges
Each question has specific test cases that validate the code
"""

import sys
import io
from contextlib import redirect_stdout, redirect_stderr
from typing import Dict, List, Tuple, Any

def test_oriental_q1(code: str) -> Dict[str, Any]:
    """
    Test: Conditional expression for age check
    Tests that code correctly uses conditional expression to print 'adult' or 'minor'
    """
    test_cases = [
        {"age": 20, "expected": "adult"},
        {"age": 18, "expected": "adult"},
        {"age": 15, "expected": "minor"},
        {"age": 0, "expected": "minor"},
        {"age": 25, "expected": "adult"},
    ]
    
    results = {}
    all_passed = True
    first_output = ""  # Capture output from first test for display
    
    for i, test_case in enumerate(test_cases):
        age = test_case["age"]
        expected = test_case["expected"]
        
        try:
            # Create a new namespace with the test variable
            namespace = {"age": age}
            
            # Capture stdout
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue().strip()
            
            # Save first output for display
            if i == 0:
                first_output = output
            
            passed = output == expected
            results[f"test_{i+1}_age_{age}"] = passed
            if not passed:
                all_passed = False
                
        except Exception as e:
            results[f"test_{i+1}_age_{age}"] = False
            all_passed = False
            if i == 0:
                first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly uses a conditional expression." if all_passed else "Some tests failed. Make sure your code uses a conditional expression (ternary operator) and prints 'adult' for age >= 18, 'minor' otherwise."
    }

def test_vermont_q1(code: str) -> Dict[str, Any]:
    """
    Test: Boolean expression in a range
    Tests that code correctly sets is_valid based on x being between 1 and 10 (inclusive)
    """
    test_cases = [
        {"x": 5, "expected": True},
        {"x": 1, "expected": True},
        {"x": 10, "expected": True},
        {"x": 15, "expected": False},
        {"x": 0, "expected": False},
        {"x": 11, "expected": False},
        {"x": -5, "expected": False},
    ]
    
    results = {}
    all_passed = True
    first_output = ""  # Capture output from first test for display
    
    for i, test_case in enumerate(test_cases):
        x = test_case["x"]
        expected = test_case["expected"]
        
        try:
            # Create a new namespace with the test variable
            namespace = {"x": x}
            
            # Capture stdout
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue().strip()
            
            # Save first output for display
            if i == 0:
                first_output = output
            
            # Check if is_valid was set correctly (handle both snake_case and camelCase)
            is_valid = namespace.get("is_valid", None)
            isValid = namespace.get("isValid", None)
            variable_value = is_valid if is_valid is not None else isValid
            
            # Check printed output (should print True or False)
            printed_output = output.lower()
            expected_str = str(expected).lower()
            
            # Pass if:
            # 1. Variable is set correctly (is_valid or isValid), OR
            # 2. Printed output matches expected (True/False)
            passed = (variable_value == expected) or (expected_str in printed_output)
            results[f"test_{i+1}_x_{x}"] = passed
            if not passed:
                all_passed = False
                
        except Exception as e:
            results[f"test_{i+1}_x_{x}"] = False
            all_passed = False
            if i == 0:
                first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly checks the range and prints the result." if all_passed else "Some tests failed. Make sure your code checks if x is between 1 and 10 (inclusive) and prints True or False."
    }

def test_connecticut_q1(code: str) -> Dict[str, Any]:
    """
    Test: Loop over a list
    Tests that code correctly loops through nums and prints each number on its own line
    """
    test_cases = [
        {"nums": [1, 2, 3], "expected": "1\n2\n3"},
        {"nums": [5], "expected": "5"},
        {"nums": [10, 20, 30, 40], "expected": "10\n20\n30\n40"},
        {"nums": [0, 1], "expected": "0\n1"},
    ]
    
    results = {}
    all_passed = True
    first_output = ""  # Capture output from first test for display
    
    for i, test_case in enumerate(test_cases):
        nums = test_case["nums"]
        expected = test_case["expected"]
        
        try:
            # Create a new namespace with the test variable
            namespace = {"nums": nums}
            
            # Capture stdout
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue()
            
            # Save first output for display
            if i == 0:
                first_output = output.rstrip()
            
            # Normalize output (remove trailing newline)
            output_normalized = output.rstrip()
            expected_normalized = expected.rstrip()
            
            passed = output_normalized == expected_normalized
            results[f"test_{i+1}"] = passed
            if not passed:
                all_passed = False
                
        except Exception as e:
            results[f"test_{i+1}"] = False
            all_passed = False
            if i == 0:
                first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly loops through the list and prints each number." if all_passed else "Some tests failed. Make sure your code uses a for loop to iterate through nums and prints each number on its own line."
    }

def test_mediterranean_q1(code: str) -> Dict[str, Any]:
    """
    Test: Store and print a float
    Tests that code stores 7 in x and prints it (should output 7.0)
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        namespace = {}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output
        
        # Check if x exists and equals 7.0
        x_value = namespace.get("x", None)
        passed = (output == "7.0") and (x_value == 7.0)
        results["test_1"] = passed
        if not passed:
            all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly stores 7 in x and prints 7.0." if all_passed else "Test failed. Make sure you store 7 in a variable named x and print it. The output should be 7.0."
    }

def test_baltic_q1(code: str) -> Dict[str, Any]:
    """
    Test: Format a string with a variable
    Tests that code stores name and prints "Hello, <name>"
    """
    test_cases = [
        {"name": "Alice", "expected": "Hello, Alice"},
        {"name": "Bob", "expected": "Hello, Bob"},
        {"name": "Charlie", "expected": "Hello, Charlie"},
    ]
    
    results = {}
    all_passed = True
    first_output = ""
    
    for i, test_case in enumerate(test_cases):
        name = test_case["name"]
        expected = test_case["expected"]
        
        try:
            namespace = {"name": name}
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue().strip()
            
            if i == 0:
                first_output = output
            
            passed = output == expected
            results[f"test_{i+1}_name_{name}"] = passed
            if not passed:
                all_passed = False
        except Exception as e:
            results[f"test_{i+1}_name_{name}"] = False
            all_passed = False
            if i == 0:
                first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly formats and prints the greeting." if all_passed else "Some tests failed. Make sure you store a name in a variable and print 'Hello, ' followed by the name."
    }

def test_st_charles_q1(code: str) -> Dict[str, Any]:
    """
    Test: Define a square function
    Tests that code defines square(n) function that returns n squared
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        namespace = {}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (function defined)"
        
        # Check if square function exists
        square_func = namespace.get("square", None)
        if square_func is None:
            results["test_1_function_exists"] = False
            all_passed = False
        else:
            # Test the function with various inputs
            test_cases = [
                {"n": 2, "expected": 4},
                {"n": 5, "expected": 25},
                {"n": 0, "expected": 0},
                {"n": -3, "expected": 9},
            ]
            
            for i, test_case in enumerate(test_cases):
                n = test_case["n"]
                expected = test_case["expected"]
                try:
                    result = square_func(n)
                    passed = result == expected
                    results[f"test_{i+1}_n_{n}"] = passed
                    if not passed:
                        all_passed = False
                except Exception as e:
                    results[f"test_{i+1}_n_{n}"] = False
                    all_passed = False
    except Exception as e:
        results["test_1_function_exists"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly defines the square function." if all_passed else "Test failed. Make sure you define a function named square(n) that returns n squared."
    }

def test_states_q1(code: str) -> Dict[str, Any]:
    """
    Test: Call a function and store result
    Tests that code calls greet(name) with "Alex" and stores result in message
    """
    results = {}
    all_passed = True
    first_output = ""
    
    # Define a mock greet function
    def greet(name):
        return f"Hello, {name}!"
    
    try:
        namespace = {"greet": greet}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (result stored)"
        
        # Check if message variable exists and has correct value
        message = namespace.get("message", None)
        expected = "Hello, Alex!"
        passed = message == expected
        results["test_1"] = passed
        if not passed:
            all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly calls the function and stores the result." if all_passed else "Test failed. Make sure you call greet('Alex') and store the result in a variable named message."
    }

def test_virginia_q1(code: str) -> Dict[str, Any]:
    """
    Test: Function with default argument
    Tests that code defines add(a, b=10) function
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        namespace = {}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (function defined)"
        
        # Check if add function exists
        add_func = namespace.get("add", None)
        if add_func is None:
            results["test_1_function_exists"] = False
            all_passed = False
        else:
            # Test the function with various inputs
            test_cases = [
                {"a": 5, "b": 10, "expected": 15},  # Both args
                {"a": 5, "b": None, "expected": 15},  # Default b
                {"a": 0, "b": 10, "expected": 10},
                {"a": 10, "b": None, "expected": 20},  # Default b
            ]
            
            for i, test_case in enumerate(test_cases):
                a = test_case["a"]
                b = test_case["b"]
                expected = test_case["expected"]
                try:
                    if b is None:
                        result = add_func(a)  # Use default
                    else:
                        result = add_func(a, b)
                    passed = result == expected
                    results[f"test_{i+1}"] = passed
                    if not passed:
                        all_passed = False
                except Exception as e:
                    results[f"test_{i+1}"] = False
                    all_passed = False
    except Exception as e:
        results["test_1_function_exists"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly defines the add function with a default argument." if all_passed else "Test failed. Make sure you define a function named add(a, b=10) that returns the sum of a and b."
    }

def test_st_james_q1(code: str) -> Dict[str, Any]:
    """
    Test: Create a list of even numbers
    Tests that code creates evens list with [0, 2, 4, 6, 8, 10]
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        namespace = {}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (list created)"
        
        # Check if evens variable exists and has correct value
        evens = namespace.get("evens", None)
        expected = [0, 2, 4, 6, 8, 10]
        passed = evens == expected
        results["test_1"] = passed
        if not passed:
            all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly creates the list of even numbers." if all_passed else "Test failed. Make sure you create a list named evens containing all even numbers from 0 to 10 (inclusive): [0, 2, 4, 6, 8, 10]."
    }

def test_tennessee_q1(code: str) -> Dict[str, Any]:
    """
    Test: Add a key to a dictionary
    Tests that code adds "grade": 95 to student dictionary
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        # Start with existing student dict
        namespace = {"student": {"name": "Alex"}}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (dictionary updated)"
        
        # Check if student dict has both keys
        student = namespace.get("student", {})
        passed = student.get("name") == "Alex" and student.get("grade") == 95
        results["test_1"] = passed
        if not passed:
            all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly adds the grade key to the dictionary." if all_passed else "Test failed. Make sure you add a key 'grade' with value 95 to the existing student dictionary."
    }

def test_new_york_q1(code: str) -> Dict[str, Any]:
    """
    Test: Get a value from a dictionary
    Tests that code gets value from dictionary using key
    """
    test_cases = [
        {"student": {"name": "Alice", "age": 20}, "expected": "Alice"},
        {"student": {"name": "Bob", "grade": 95}, "expected": "Bob"},
        {"student": {"name": "Charlie", "city": "NYC"}, "expected": "Charlie"},
    ]
    
    results = {}
    all_passed = True
    first_output = ""
    
    for i, test_case in enumerate(test_cases):
        student = test_case["student"]
        expected = test_case["expected"]
        
        try:
            namespace = {"student": student}
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue().strip()
            
            if i == 0:
                first_output = output if output else "No output (value retrieved)"
            
            # Check if student_name variable exists and has correct value
            student_name = namespace.get("student_name", None)
            passed = student_name == expected
            results[f"test_{i+1}"] = passed
            if not passed:
                all_passed = False
        except Exception as e:
            results[f"test_{i+1}"] = False
            all_passed = False
            if i == 0:
                first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly retrieves the value from the dictionary." if all_passed else "Some tests failed. Make sure you get the value associated with the key 'name' from the student dictionary and store it in a variable named student_name."
    }

def test_kentucky_q1(code: str) -> Dict[str, Any]:
    """
    Test: Create an ArgumentParser
    Tests that code creates ArgumentParser with description "Demo script"
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from argparse import ArgumentParser
        namespace = {"ArgumentParser": ArgumentParser}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (parser created)"
        
        # Check if parser variable exists and has correct description
        parser = namespace.get("parser", None)
        if parser is None:
            results["test_1_parser_exists"] = False
            all_passed = False
        else:
            # Check description
            passed = hasattr(parser, "description") and parser.description == "Demo script"
            results["test_1"] = passed
            if not passed:
                all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly creates the ArgumentParser." if all_passed else "Test failed. Make sure you create an ArgumentParser named parser with description 'Demo script'."
    }

def test_indiana_q1(code: str) -> Dict[str, Any]:
    """
    Test: Add a filename argument
    Tests that code adds required string argument "filename" to parser
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from argparse import ArgumentParser
        parser = ArgumentParser()
        namespace = {"parser": parser}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (argument added)"
        
        # Check if filename argument was added
        # Try to parse with filename argument
        try:
            args = parser.parse_args(["test.txt"])
            passed = hasattr(args, "filename") and args.filename == "test.txt"
            results["test_1"] = passed
            if not passed:
                all_passed = False
        except SystemExit:
            # SystemExit is normal for argparse, but we need to check differently
            # Check if the action was added
            actions = [action for action in parser._actions if action.dest == "filename"]
            passed = len(actions) > 0 and actions[0].required
            results["test_1"] = passed
            if not passed:
                all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly adds the filename argument." if all_passed else "Test failed. Make sure you add a required string argument called 'filename' to the parser."
    }

def test_illinois_q1(code: str) -> Dict[str, Any]:
    """
    Test: Parse command-line arguments
    Tests that code parses args using parser into args variable
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from argparse import ArgumentParser
        parser = ArgumentParser()
        parser.add_argument("--name", type=str, default="test")
        namespace = {"parser": parser}
        f = io.StringIO()
        with redirect_stderr(f):  # argparse may write to stderr
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (args parsed)"
        
        # Check if args variable exists
        args = namespace.get("args", None)
        passed = args is not None and hasattr(args, "name")
        results["test_1"] = passed
        if not passed:
            all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly parses the arguments." if all_passed else "Test failed. Make sure you call parser.parse_args() and store the result in a variable named args."
    }

def test_atlantic_q1(code: str) -> Dict[str, Any]:
    """
    Test: Open a file with with-statement
    Tests that code opens data.txt for reading using with statement
    """
    results = {}
    all_passed = True
    first_output = ""
    
    import tempfile
    import os
    import ast
    import re
    
    temp_file = None
    
    try:
        # Test 1: Check that code contains "data.txt" exactly (not misspelled)
        # Look for "data.txt" in quotes (single or double)
        has_data_txt = bool(re.search(r'["\']data\.txt["\']', code))
        results["test_1_filename"] = has_data_txt
        if not has_data_txt:
            all_passed = False
            first_output = "Error: Code must open 'data.txt' (check spelling)"
        
        # Test 2: Check that code uses a 'with' statement
        has_with = "with" in code
        results["test_2_with_statement"] = has_with
        if not has_with:
            all_passed = False
            if not first_output:
                first_output = "Error: Code must use a 'with' statement"
        
        # Test 3: Parse AST to verify structure and variable name
        try:
            tree = ast.parse(code)
            found_correct_with = False
            
            # Look for a 'with' statement that opens "data.txt" and assigns to 'f'
            for node in ast.walk(tree):
                if isinstance(node, ast.With):
                    # Check each item in the with statement
                    for item in node.items:
                        # Must be an open() call
                        is_open_call = False
                        opens_data_txt = False
                        variable_is_f = False
                        
                        if isinstance(item.context_expr, ast.Call):
                            func = item.context_expr.func
                            if isinstance(func, ast.Name) and func.id == 'open':
                                is_open_call = True
                                
                                # Check the filename argument - must be literal "data.txt"
                                if item.context_expr.args:
                                    filename_arg = item.context_expr.args[0]
                                    filename = None
                                    
                                    if isinstance(filename_arg, ast.Constant):
                                        filename = filename_arg.value
                                    elif isinstance(filename_arg, ast.Str):  # Python < 3.8
                                        filename = filename_arg.s
                                    
                                    if filename == "data.txt":
                                        opens_data_txt = True
                        
                        # Check if the variable is named 'f' (must be direct assignment in 'as' clause)
                        if item.optional_vars:
                            if isinstance(item.optional_vars, ast.Name):
                                if item.optional_vars.id == 'f':
                                    variable_is_f = True
                        
                        # All three conditions must be true for this with statement
                        if is_open_call and opens_data_txt and variable_is_f:
                            found_correct_with = True
                            break
                    
                    if found_correct_with:
                        break
            
            results["test_3_ast_structure"] = found_correct_with
            if not found_correct_with:
                all_passed = False
                if not first_output:
                    # More specific error messages
                    has_any_with = any(isinstance(node, ast.With) for node in ast.walk(tree))
                    if not has_any_with:
                        first_output = "Error: Code must use a 'with' statement"
                    else:
                        # Check if we have a with statement but wrong details
                        has_open_call = False
                        has_f_var = False
                        has_data_txt = False
                        
                        for node in ast.walk(tree):
                            if isinstance(node, ast.With):
                                for item in node.items:
                                    if isinstance(item.context_expr, ast.Call):
                                        func = item.context_expr.func
                                        if isinstance(func, ast.Name) and func.id == 'open':
                                            has_open_call = True
                                            # Check filename
                                            if item.context_expr.args:
                                                filename_arg = item.context_expr.args[0]
                                                if isinstance(filename_arg, (ast.Constant, ast.Str)):
                                                    filename = filename_arg.value if isinstance(filename_arg, ast.Constant) else filename_arg.s
                                                    if filename == "data.txt":
                                                        has_data_txt = True
                                    if item.optional_vars and isinstance(item.optional_vars, ast.Name):
                                        if item.optional_vars.id == 'f':
                                            has_f_var = True
                        
                        if not has_open_call:
                            first_output = "Error: Must use open() function"
                        elif not has_data_txt:
                            first_output = "Error: Must open 'data.txt' (check spelling)"
                        elif not has_f_var:
                            first_output = "Error: File must be assigned to variable named 'f'"
                        else:
                            first_output = "Error: Must use 'with open(\"data.txt\") as f:'"
        except SyntaxError as e:
            results["test_3_ast_structure"] = False
            all_passed = False
            if not first_output:
                first_output = f"Syntax error: {str(e)}"
        
        # Test 4: Actually execute the code with a temp file to verify it works
        if all_passed:  # Only run execution test if other tests pass
            try:
                # Create a temporary file
                with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
                    tmp.write("test content")
                    temp_file = tmp.name
                
                # Replace "data.txt" with temp file in code (exact match only)
                code_with_temp = code.replace('"data.txt"', f'"{temp_file}"').replace("'data.txt'", f"'{temp_file}'")
                
                # Verify the replacement happened (if it didn't, the filename was wrong)
                if temp_file not in code_with_temp and '"data.txt"' not in code and "'data.txt'" not in code:
                    results["test_4_execution"] = False
                    all_passed = False
                    if not first_output:
                        first_output = "Error: Could not find 'data.txt' in code"
                else:
                    namespace = {}
                    f = io.StringIO()
                    with redirect_stdout(f), redirect_stderr(f):
                        exec(code_with_temp, namespace)
                    output = f.getvalue().strip()
                    first_output = output if output else "File opened successfully"
                    
                    # Check if variable 'f' exists in namespace (it should be closed after with block)
                    # Actually, 'f' might not exist after the with block closes, so we just check if it ran without error
                    results["test_4_execution"] = True
            except Exception as e:
                results["test_4_execution"] = False
                all_passed = False
                first_output = f"Error executing code: {str(e)}"
        else:
            results["test_4_execution"] = False
        
        # Clean up
        if temp_file and os.path.exists(temp_file):
            os.unlink(temp_file)
    except Exception as e:
        results["test_1_filename"] = False
        results["test_2_with_statement"] = False
        results["test_3_ast_structure"] = False
        results["test_4_execution"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
        if temp_file and os.path.exists(temp_file):
            os.unlink(temp_file)
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly opens the file using a with statement." if all_passed else "Test failed. Make sure you open 'data.txt' for reading using a with statement and assign it to a variable named f."
    }

def test_ventnor_q1(code: str) -> Dict[str, Any]:
    """
    Test: Read a whole file into a string
    Tests that code reads entire contents of data.txt into text variable
    """
    results = {}
    all_passed = True
    first_output = ""
    
    import tempfile
    import os
    
    test_cases = [
        {"content": "Hello, world!"},
        {"content": "Line 1\nLine 2\nLine 3"},
        {"content": "Single line"},
    ]
    
    for i, test_case in enumerate(test_cases):
        content = test_case["content"]
        
        try:
            # Create a temporary file
            with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
                tmp.write(content)
                temp_file = tmp.name
            
            # Replace "data.txt" with temp file in code
            code_with_temp = code.replace('"data.txt"', f'"{temp_file}"').replace("'data.txt'", f"'{temp_file}'")
            
            namespace = {}
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code_with_temp, namespace)
            output = f.getvalue().strip()
            
            if i == 0:
                first_output = output if output else "No output (file read)"
            
            # Check if text variable exists and has correct content
            text = namespace.get("text", None)
            passed = text == content
            results[f"test_{i+1}"] = passed
            if not passed:
                all_passed = False
            
            # Clean up
            if os.path.exists(temp_file):
                os.unlink(temp_file)
        except Exception as e:
            results[f"test_{i+1}"] = False
            all_passed = False
            if i == 0:
                first_output = f"Error: {str(e)}"
            if os.path.exists(temp_file):
                os.unlink(temp_file)
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly reads the file contents." if all_passed else "Some tests failed. Make sure you read the entire contents of 'data.txt' into a variable named text."
    }

def test_marvin_gardens_q1(code: str) -> Dict[str, Any]:
    """
    Test: Append a line to a log file
    Tests that code appends "done\n" to log.txt
    """
    results = {}
    all_passed = True
    first_output = ""
    
    import tempfile
    import os
    
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
            tmp.write("existing content\n")
            temp_file = tmp.name
        
        # Replace "log.txt" with temp file in code
        code_with_temp = code.replace('"log.txt"', f'"{temp_file}"').replace("'log.txt'", f"'{temp_file}'")
        
        namespace = {}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code_with_temp, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (file appended)"
        
        # Check if file was appended correctly
        with open(temp_file, 'r') as f_check:
            file_content = f_check.read()
        passed = "done\n" in file_content or file_content.endswith("done\n")
        results["test_1"] = passed
        if not passed:
            all_passed = False
        
        # Clean up
        if os.path.exists(temp_file):
            os.unlink(temp_file)
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
        if os.path.exists(temp_file):
            os.unlink(temp_file)
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly appends to the file." if all_passed else "Test failed. Make sure you append the string 'done\\n' to the file 'log.txt'."
    }

def test_pacific_q1(code: str) -> Dict[str, Any]:
    """
    Test: Send a GET request
    Tests that code sends GET request to URL and stores response
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from unittest.mock import Mock, MagicMock
        import sys
        
        # Create a mock response object
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "test response"
        mock_response.json.return_value = {"key": "value"}
        
        # Pre-populate namespace with mock requests to handle import
        # This allows "import requests" to work without the actual library
        original_modules = sys.modules.copy()
        try:
            # Create a fake requests module with get method
            fake_requests = MagicMock()
            fake_requests.get.return_value = mock_response
            sys.modules['requests'] = fake_requests
            
            # Also add requests to namespace in case code doesn't import it
            namespace = {
                "__builtins__": __builtins__,
                "requests": fake_requests
            }
            
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue().strip()
        finally:
            # Restore original modules
            sys.modules.clear()
            sys.modules.update(original_modules)
        
        first_output = output if output else "No output (request sent)"
        
        # Check if response variable exists and is the mock_response (meaning get() was called)
        response = namespace.get("response", None)
        if response is None:
            results["test_1_response_exists"] = False
            all_passed = False
        else:
            # Check if it has Response-like attributes (status_code and text)
            has_attributes = hasattr(response, "status_code") and hasattr(response, "text")
            
            # Verify that response is our mock_response (meaning requests.get() was called, not post())
            # If requests.post() or other methods were called, they would return a different mock
            is_correct_response = response is mock_response
            
            # Verify that requests.get() was actually called with the URL
            get_was_called = fake_requests.get.called if hasattr(fake_requests.get, "called") else False
            get_call_args = fake_requests.get.call_args if hasattr(fake_requests.get, "call_args") else None
            
            # Check if the URL was passed as an argument
            url_provided = False
            expected_url = "https://api.example.com/data"
            if get_call_args is not None:
                # call_args is a tuple of (args, kwargs)
                args = get_call_args[0] if len(get_call_args) > 0 else ()
                kwargs = get_call_args[1] if len(get_call_args) > 1 else {}
                
                # Check if URL is in the positional arguments (first arg)
                if len(args) > 0:
                    url_provided = args[0] == expected_url
                # Or check keyword arguments
                elif "url" in kwargs:
                    url_provided = kwargs.get("url") == expected_url
            
            # Must have response, correct attributes, be the right response object, 
            # get() must be called, and URL must be provided
            passed = (has_attributes and is_correct_response and get_was_called and url_provided)
            results["test_1"] = passed
            if not passed:
                all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly sends the GET request." if all_passed else "Test failed. Make sure you send a GET request to the URL and store the response in a variable named response."
    }

def test_north_carolina_q1(code: str) -> Dict[str, Any]:
    """
    Test: Parse JSON from a response
    Tests that code extracts JSON data from response into data variable
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from unittest.mock import Mock, MagicMock
        import sys
        
        # Create a mock response object
        mock_response = Mock()
        mock_response.json.return_value = {"key": "value", "number": 42}
        
        namespace = {
            "response": mock_response,
            "__builtins__": __builtins__
        }
        
        # Pre-populate namespace with mock requests to handle import
        # This allows "import requests" to work without the actual library
        original_modules = sys.modules.copy()
        try:
            # Create a fake requests module
            fake_requests = MagicMock()
            sys.modules['requests'] = fake_requests
            
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue().strip()
        finally:
            # Restore original modules
            sys.modules.clear()
            sys.modules.update(original_modules)
        
        first_output = output if output else "No output (JSON parsed)"
        
        # Check if data variable exists and has correct value
        data = namespace.get("data", None)
        expected = {"key": "value", "number": 42}
        passed = data == expected
        results["test_1"] = passed
        if not passed:
            all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly extracts JSON from the response." if all_passed else "Test failed. Make sure you extract JSON data from the response object and store it in a variable named data."
    }

def test_pennsylvania_q1(code: str) -> Dict[str, Any]:
    """
    Test: Check response status code
    Tests that code stores status code from response object
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from unittest.mock import Mock, MagicMock
        
        # Create mock response objects with different status codes
        test_cases = [
            {"status_code": 200},
            {"status_code": 404},
            {"status_code": 500},
        ]
        
        for i, test_case in enumerate(test_cases):
            status_code = test_case["status_code"]
            mock_response = Mock()
            mock_response.status_code = status_code
            
            namespace = {
                "response": mock_response,
                "__builtins__": __builtins__
            }
            
            # Pre-populate namespace with mock requests to handle import
            import sys
            original_modules = sys.modules.copy()
            try:
                # Create a fake requests module
                fake_requests = MagicMock()
                sys.modules['requests'] = fake_requests
                
                f = io.StringIO()
                with redirect_stdout(f), redirect_stderr(f):
                    exec(code, namespace)
                output = f.getvalue().strip()
            finally:
                # Restore original modules
                sys.modules.clear()
                sys.modules.update(original_modules)
            
            if i == 0:
                first_output = output if output else "No output (status code stored)"
            
            # Check if status_code variable exists and has correct value
            status_code_var = namespace.get("status_code", None)
            passed = status_code_var == status_code
            results[f"test_{i+1}_status_{status_code}"] = passed
            if not passed:
                all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly stores the status code." if all_passed else "Test failed. Make sure you store the status code from the response object in a variable named status_code."
    }

def test_park_place_q1(code: str) -> Dict[str, Any]:
    """
    Test: Get response text content
    Tests that code stores text content from response object
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from unittest.mock import Mock, MagicMock
        
        # Create mock response objects with different text content
        test_cases = [
            {"text": "Hello, world!"},
            {"text": "{\"key\": \"value\"}"},
            {"text": "Line 1\nLine 2\nLine 3"},
        ]
        
        for i, test_case in enumerate(test_cases):
            text_content = test_case["text"]
            mock_response = Mock()
            mock_response.text = text_content
            
            # Create a mock requests module to handle import requests
            mock_requests = MagicMock()
            
            namespace = {
                "response": mock_response,
                "__builtins__": __builtins__
            }
            
            # Pre-populate namespace with mock requests to handle import
            # This allows "import requests" to work without the actual library
            import sys
            original_modules = sys.modules.copy()
            try:
                # Create a fake requests module
                fake_requests = MagicMock()
                sys.modules['requests'] = fake_requests
                
                f = io.StringIO()
                with redirect_stdout(f), redirect_stderr(f):
                    exec(code, namespace)
                output = f.getvalue().strip()
            finally:
                # Restore original modules
                sys.modules.clear()
                sys.modules.update(original_modules)
            
            if i == 0:
                first_output = output if output else "No output (content stored)"
            
            # Check if content variable exists and has correct value
            content = namespace.get("content", None)
            passed = content == text_content
            results[f"test_{i+1}"] = passed
            if not passed:
                all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly stores the response text content." if all_passed else "Test failed. Make sure you store the text content from the response object in a variable named content."
    }

def test_boardwalk_q1(code: str) -> Dict[str, Any]:
    """
    Test: Send a POST request with data
    Tests that code sends POST request with JSON data and stores response
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        from unittest.mock import Mock, MagicMock
        import sys
        
        # Create a mock response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "Success"
        mock_response.json.return_value = {"status": "success"}
        
        # Expected values
        expected_url = "https://api.example.com/submit"
        expected_json = {"name": "Alice", "age": 30}
        
        # Pre-populate namespace with mock requests to handle import
        # This allows "import requests" to work without the actual library
        original_modules = sys.modules.copy()
        try:
            # Create a fake requests module with post method
            fake_requests = MagicMock()
            fake_requests.post.return_value = mock_response
            sys.modules['requests'] = fake_requests
            
            # Also add requests to namespace in case code doesn't import it
            namespace = {
                "__builtins__": __builtins__,
                "requests": fake_requests
            }
            
            f = io.StringIO()
            with redirect_stdout(f), redirect_stderr(f):
                exec(code, namespace)
            output = f.getvalue().strip()
        finally:
            # Restore original modules
            sys.modules.clear()
            sys.modules.update(original_modules)
        
        first_output = output if output else "No output (POST request sent)"
        
        # Check if response variable exists and is the mock_response
        response = namespace.get("response", None)
        if response is None:
            results["test_1_response_exists"] = False
            all_passed = False
        else:
            # Check if it has Response-like attributes
            has_attributes = hasattr(response, "status_code")
            
            # Verify that response is our mock_response (meaning requests.post() was called, not get())
            is_correct_response = response is mock_response
            
            # Verify that requests.post() was actually called
            post_was_called = fake_requests.post.called if hasattr(fake_requests.post, "called") else False
            post_call_args = fake_requests.post.call_args if hasattr(fake_requests.post, "call_args") else None
            
            # Check if the URL and JSON data were passed correctly
            url_correct = False
            json_correct = False
            
            if post_call_args is not None:
                # call_args is a tuple of (args, kwargs)
                args = post_call_args[0] if len(post_call_args) > 0 else ()
                kwargs = post_call_args[1] if len(post_call_args) > 1 else {}
                
                # Check URL in positional arguments (first arg)
                if len(args) > 0:
                    url_correct = args[0] == expected_url
                
                # Check JSON data in kwargs
                # When json=data is passed, Python evaluates the variable and passes the actual dict value
                if "json" in kwargs:
                    json_data = kwargs.get("json")
                    # json_data should be the actual dict value (not a variable name)
                    if isinstance(json_data, dict):
                        json_correct = json_data == expected_json
                    else:
                        json_correct = False
            
            # Must have response, correct attributes, be the right response object, 
            # post() must be called, URL must be correct, and JSON must be correct
            passed = (has_attributes and is_correct_response and post_was_called and url_correct and json_correct)
            results["test_1"] = passed
            if not passed:
                all_passed = False
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly sends the POST request with JSON data." if all_passed else "Test failed. Make sure you send a POST request to the URL with the JSON data {\"name\": \"Alice\", \"age\": 30} and store the response in a variable named response."
    }

def test_reading_railroad_q1(code: str) -> Dict[str, Any]:
    """
    Test: Multiple choice - Variables & Data Flow
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        # code is the selected answer (e.g., "B")
        correct_answer = "B"
        passed = code.strip().upper() == correct_answer
        results["test_1"] = passed
        if not passed:
            all_passed = False
        first_output = f"Selected: {code.strip()}"
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "Correct! A variable is a named reference that points to a value in memory." if all_passed else "Incorrect. Try again!"
    }

def test_pennsylvania_railroad_q1(code: str) -> Dict[str, Any]:
    """
    Test: Multiple choice - Logic & Control Flow
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        correct_answer = "C"
        passed = code.strip().upper() == correct_answer
        results["test_1"] = passed
        if not passed:
            all_passed = False
        first_output = f"Selected: {code.strip()}"
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "Correct! Conditional statements choose between different paths of execution." if all_passed else "Incorrect. Try again!"
    }

def test_bo_railroad_q1(code: str) -> Dict[str, Any]:
    """
    Test: Multiple choice - Functions
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        correct_answer = "B"
        passed = code.strip().upper() == correct_answer
        results["test_1"] = passed
        if not passed:
            all_passed = False
        first_output = f"Selected: {code.strip()}"
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "Correct! Functions organize reusable blocks of logic." if all_passed else "Incorrect. Try again!"
    }

def test_short_line_q1(code: str) -> Dict[str, Any]:
    """
    Test: Multiple choice - Lists & Dictionaries
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        correct_answer = "C"
        passed = code.strip().upper() == correct_answer
        results["test_1"] = passed
        if not passed:
            all_passed = False
        first_output = f"Selected: {code.strip()}"
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "Correct! A dictionary is a structure that maps keys to values." if all_passed else "Incorrect. Try again!"
    }

def test_electric_company_q1(code: str) -> Dict[str, Any]:
    """
    Test: Multiple choice - File I/O
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        correct_answer = "B"
        passed = code.strip().upper() == correct_answer
        results["test_1"] = passed
        if not passed:
            all_passed = False
        first_output = f"Selected: {code.strip()}"
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "Correct! The with statement ensures the file closes properly even if an error occurs." if all_passed else "Incorrect. Try again!"
    }

def test_water_works_q1(code: str) -> Dict[str, Any]:
    """
    Test: Multiple choice - APIs & External Data
    """
    results = {}
    all_passed = True
    first_output = ""
    
    try:
        correct_answer = "B"
        passed = code.strip().upper() == correct_answer
        results["test_1"] = passed
        if not passed:
            all_passed = False
        first_output = f"Selected: {code.strip()}"
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "Correct! An API connects a Python script to external data or services." if all_passed else "Incorrect. Try again!"
    }

# Test registry - maps question_id to test function
TEST_REGISTRY: Dict[str, callable] = {
    "mediterranean_q1": test_mediterranean_q1,
    "baltic_q1": test_baltic_q1,
    "oriental_q1": test_oriental_q1,
    "vermont_q1": test_vermont_q1,
    "connecticut_q1": test_connecticut_q1,
    "st_charles_q1": test_st_charles_q1,
    "states_q1": test_states_q1,
    "virginia_q1": test_virginia_q1,
    "st_james_q1": test_st_james_q1,
    "tennessee_q1": test_tennessee_q1,
    "new_york_q1": test_new_york_q1,
    "kentucky_q1": test_kentucky_q1,
    "indiana_q1": test_indiana_q1,
    "illinois_q1": test_illinois_q1,
    "atlantic_q1": test_atlantic_q1,
    "ventnor_q1": test_ventnor_q1,
    "marvin_gardens_q1": test_marvin_gardens_q1,
    "pacific_q1": test_pacific_q1,
    "north_carolina_q1": test_north_carolina_q1,
    "pennsylvania_q1": test_pennsylvania_q1,
    "park_place_q1": test_park_place_q1,
    "boardwalk_q1": test_boardwalk_q1,
    "reading_railroad_q1": test_reading_railroad_q1,
    "pennsylvania_railroad_q1": test_pennsylvania_railroad_q1,
    "bo_railroad_q1": test_bo_railroad_q1,
    "short_line_q1": test_short_line_q1,
    "electric_company_q1": test_electric_company_q1,
    "water_works_q1": test_water_works_q1,
}

def run_test(question_id: str, code: str) -> Dict[str, Any]:
    """
    Run the test suite for a specific question
    Returns test results
    """
    if question_id not in TEST_REGISTRY:
        return {
            "passed": False,
            "tests": {},
            "message": f"No test found for question_id: {question_id}"
        }
    
    test_func = TEST_REGISTRY[question_id]
    return test_func(code)

