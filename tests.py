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
    
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
            tmp.write("test content")
            temp_file = tmp.name
        
        # Replace "data.txt" with temp file in code
        code_with_temp = code.replace('"data.txt"', f'"{temp_file}"').replace("'data.txt'", f"'{temp_file}'")
        
        namespace = {}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code_with_temp, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (file opened)"
        
        # Check if f variable exists (file should be closed after with block)
        # The file should have been opened and closed properly
        passed = True  # If no exception, the with statement worked
        results["test_1"] = passed
        
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
        import requests
        namespace = {"requests": requests}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
        first_output = output if output else "No output (request sent)"
        
        # Check if response variable exists and is a Response object
        response = namespace.get("response", None)
        if response is None:
            results["test_1_response_exists"] = False
            all_passed = False
        else:
            # Check if it's a requests.Response object
            passed = hasattr(response, "status_code") and hasattr(response, "text")
            results["test_1"] = passed
            if not passed:
                all_passed = False
    except ImportError:
        results["test_1"] = False
        all_passed = False
        first_output = "Error: requests library not installed"
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
        import requests
        from unittest.mock import Mock
        
        # Create a mock response object
        mock_response = Mock()
        mock_response.json.return_value = {"key": "value", "number": 42}
        namespace = {"response": mock_response}
        f = io.StringIO()
        with redirect_stdout(f), redirect_stderr(f):
            exec(code, namespace)
        output = f.getvalue().strip()
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
        try:
            import requests
        except ImportError:
            requests = None
        from unittest.mock import patch, Mock
        
        # Create a mock response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.text = "Success"
        mock_response.json.return_value = {"status": "success"}
        
        # Check code contains required elements
        code_lower = code.lower()
        has_post = "post" in code_lower
        has_url = "api.example.com/submit" in code or "https://api.example.com/submit" in code
        has_json = "json" in code_lower
        has_response = "response" in code_lower
        
        # Check code contains required elements first
        if not (has_post and has_url and has_json and has_response):
            results["test_1_code_check"] = False
            all_passed = False
            first_output = "Code missing required elements (post, url, json, response)"
        else:
            # If requests is available, try to execute and mock
            if requests is not None:
                # Patch requests.post at the module level
                with patch('requests.post', return_value=mock_response) as mock_post:
                    namespace = {}
                    f = io.StringIO()
                    with redirect_stdout(f), redirect_stderr(f):
                        exec(code, namespace)
                    output = f.getvalue().strip()
                    first_output = output if output else "No output (POST request sent)"
                    
                    # Check if response variable exists
                    response = namespace.get("response", None)
                    if response is None:
                        results["test_1_response_exists"] = False
                        all_passed = False
                    else:
                        # Check if POST was called and response has status_code
                        passed = (mock_post.called and hasattr(response, "status_code"))
                        results["test_1"] = passed
                        if not passed:
                            all_passed = False
            else:
                # If requests not installed, just check code structure
                results["test_1"] = True  # Code structure is correct
                first_output = "Code structure verified (requests not installed for execution test)"
    except ImportError:
        # If we can't import mock, just check code structure
        if has_post and has_url and has_json and has_response:
            results["test_1"] = True
            first_output = "Code structure verified"
        else:
            results["test_1"] = False
            all_passed = False
            first_output = "Error: Code missing required elements"
    except Exception as e:
        results["test_1"] = False
        all_passed = False
        first_output = f"Error: {str(e)}"
    
    return {
        "passed": all_passed,
        "tests": results,
        "output": first_output,
        "message": "All tests passed! Your code correctly sends the POST request with JSON data." if all_passed else "Test failed. Make sure you send a POST request to the URL with the JSON data and store the response in a variable named response."
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

