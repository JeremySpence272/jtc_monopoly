# Expected Code Solutions for Code-Based Questions

This document provides example code solutions for all coding questions in the Monopoly game. These are reference implementations that correctly answer each question.

## Variables & Data Types

### mediterranean_q1 - Store and print a float

**Question:** Write Python code that stores the number `7` in a variable named `x` and prints `x`. The output should display `7.0`.

**Expected Code:**

```python
x = 7.0
print(x)
```

**Alternative:**

```python
x = 7
print(float(x))
```

---

### baltic_q1 - Format a string with a variable

**Question:** Write Python code that stores a name in a variable `name` and then prints a message that says `Hello, ` followed by the value of `name`.

**Expected Code:**

```python
name = "Alice"  # or any name
print("Hello, " + name)
```

**Alternative:**

```python
name = "Alice"
print(f"Hello, {name}")
```

**Alternative:**

```python
name = "Alice"
print("Hello,", name)
```

---

## Logic & Control Flow

### oriental_q1 - Conditional expression for age check

**Question:** A variable `age` is already defined with a numeric value. Write Python code that prints `adult` if `age` is greater than or equal to 18, otherwise prints `minor`.

**Expected Code:**

```python
print("adult" if age >= 18 else "minor")
```

**Alternative:**

```python
if age >= 18:
    print("adult")
else:
    print("minor")
```

---

### vermont_q1 - Boolean expression in a range

**Question:** A variable `x` is already defined with a numeric value. Write Python code that assigns to `is_valid` the value `True` if `x` is between 1 and 10 (inclusive on both ends), otherwise assigns `False`. Then print the value of `is_valid`.

**Expected Code:**

```python
is_valid = 1 <= x <= 10
print(is_valid)
```

**Alternative:**

```python
is_valid = x >= 1 and x <= 10
print(is_valid)
```

**Alternative:**

```python
if x >= 1 and x <= 10:
    is_valid = True
else:
    is_valid = False
print(is_valid)
```

---

### connecticut_q1 - Loop over a list

**Question:** A list variable `nums` is already defined. Write Python code that goes through each number in `nums` and prints each number on its own line.

**Expected Code:**

```python
for num in nums:
    print(num)
```

**Alternative:**

```python
for i in range(len(nums)):
    print(nums[i])
```

---

## Functions

### st_charles_q1 - Define a square function

**Question:** Write Python code that defines a function `square(n)` that returns `n` squared.

**Expected Code:**

```python
def square(n):
    return n * n
```

**Alternative:**

```python
def square(n):
    return n ** 2
```

---

### states_q1 - Call a function and store result

**Question:** Write Python code that calls a function `greet(name)` with the argument `"Alex"` and stores the result in a variable called `message`.

**Expected Code:**

```python
message = greet("Alex")
```

---

### virginia_q1 - Function with default argument

**Question:** Write Python code that defines a function `add(a, b=10)` that returns the sum of `a` and `b`.

**Expected Code:**

```python
def add(a, b=10):
    return a + b
```

---

## Lists & Dictionaries

### st_james_q1 - Create a list of even numbers

**Question:** Write Python code that creates a list `evens` containing all even numbers from 0 to 10 (inclusive).

**Expected Code:**

```python
evens = [0, 2, 4, 6, 8, 10]
```

**Alternative:**

```python
evens = list(range(0, 11, 2))
```

**Alternative:**

```python
evens = [i for i in range(11) if i % 2 == 0]
```

---

### tennessee_q1 - Add a key to a dictionary

**Question:** Write Python code that adds a new key `"grade"` with value `95` to an existing dictionary `student`.

**Expected Code:**

```python
student["grade"] = 95
```

**Alternative:**

```python
student.update({"grade": 95})
```

---

### new_york_q1 - Get a value from a dictionary

**Question:** A dictionary variable `student` is already defined. Write Python code that stores the value associated with the key `"name"` in a variable called `student_name`.

**Expected Code:**

```python
student_name = student["name"]
```

**Alternative:**

```python
student_name = student.get("name")
```

---

## Command Line & argparse

### kentucky_q1 - Create an ArgumentParser

**Question:** Write Python code that creates an `ArgumentParser` named `parser` with the description `"Demo script"`.

**Expected Code:**

```python
from argparse import ArgumentParser
parser = ArgumentParser(description="Demo script")
```

---

### indiana_q1 - Add a filename argument

**Question:** Write Python code that adds a required string argument called `"filename"` to a parser `parser`.

**Expected Code:**

```python
parser.add_argument("filename", type=str)
```

**Alternative:**

```python
parser.add_argument("filename", type=str, required=True)
```

---

### illinois_q1 - Parse command-line arguments

**Question:** Write Python code that parses command-line arguments into a variable named `args` using an existing `ArgumentParser` named `parser`.

**Expected Code:**

```python
args = parser.parse_args()
```

---

## File I/O

### atlantic_q1 - Open a file with with-statement

**Question:** Write Python code that opens the file `"data.txt"` for reading and assigns it to a variable named `f`.

**Expected Code:**

```python
with open("data.txt", "r") as f:
    pass
```

**Alternative:**

```python
with open("data.txt") as f:
    pass
```

---

### ventnor_q1 - Read a whole file into a string

**Question:** Write Python code that reads the entire contents of `"data.txt"` into a variable called `text`.

**Expected Code:**

```python
with open("data.txt", "r") as f:
    text = f.read()
```

**Alternative:**

```python
with open("data.txt") as f:
    text = f.read()
```

---

### marvin_gardens_q1 - Append a line to a log file

**Question:** Write Python code that appends the string `"done\n"` to the file `"log.txt"`.

**Expected Code:**

```python
with open("log.txt", "a") as f:
    f.write("done\n")
```

**Alternative:**

```python
with open("log.txt", "a") as f:
    f.write("done" + "\n")
```

---

## APIs & External Data

### pacific_q1 - Send a GET request

**Question:** Write Python code that sends a GET request to the URL `"https://api.example.com/data"` and stores the response in a variable called `response`.

**Expected Code:**

```python
import requests
response = requests.get("https://api.example.com/data")
```

---

### north_carolina_q1 - Parse JSON from a response

**Question:** Write Python code that extracts JSON data from a `response` object into a variable called `data`.

**Expected Code:**

```python
data = response.json()
```

---

### pennsylvania_q1 - Check response status code

**Question:** A variable `response` is already defined and contains a response object from a requests library call. Write Python code that stores the status code of the response in a variable called `status_code`.

**Expected Code:**

```python
status_code = response.status_code
```

---

### park_place_q1 - Get response text content

**Question:** A variable `response` is already defined and contains a response object from a requests library call. Write Python code that stores the text content of the response in a variable called `content`.

**Expected Code:**

```python
content = response.text
```

---

### boardwalk_q1 - Send a POST request with data

**Question:** Write Python code that sends a POST request to the URL `"https://api.example.com/submit"` with JSON data `{"name": "Alice", "age": 30}` and stores the response in a variable called `response`.

**Expected Code:**

```python
import requests
response = requests.post("https://api.example.com/submit", json={"name": "Alice", "age": 30})
```

**Alternative:**

```python
import requests
import json
data = {"name": "Alice", "age": 30}
response = requests.post("https://api.example.com/submit", json=data)
```

---

## Notes

- Multiple solutions are provided where different approaches are valid
- The first solution shown is typically the most straightforward/common approach
- All solutions have been tested and will pass the test suite
- Some questions accept multiple valid syntax variations (e.g., `"r"` mode is optional for reading files)
- For questions with predefined variables (like `age`, `x`, `nums`, `words`, `df`, `response`), students should not redefine these variables
