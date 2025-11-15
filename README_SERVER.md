# Monopoly Game Code Testing Server

Python Flask server that validates Python code submissions using question-specific test suites.

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the server:

```bash
python server.py
```

The server will start on `http://localhost:5001`

## API Endpoints

### POST /test-code

Tests Python code using question-specific test suite.

**Request Body:**

```json
{
  "code": "print('adult' if age >= 18 else 'minor')",
  "question_id": "oriental_q1"
}
```

**Response (Success):**

```json
{
  "success": true,
  "valid": true,
  "output": "adult",
  "error": null,
  "test_result": {
    "message": "All tests passed! Your code correctly uses a conditional expression.",
    "tests": {
      "test_1_age_20": true,
      "test_2_age_18": true,
      "test_3_age_15": true,
      "test_4_age_0": true,
      "test_5_age_25": true
    }
  }
}
```

**Response (Failure):**

```json
{
  "success": true,
  "valid": false,
  "output": "adult",
  "error": "Some tests failed. Make sure your code uses a conditional expression (ternary operator) and prints 'adult' for age >= 18, 'minor' otherwise.",
  "test_result": {
    "message": "Some tests failed...",
    "tests": {
      "test_1_age_20": true,
      "test_2_age_18": false,
      ...
    }
  }
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

## Test Suites

Each question has a dedicated test suite in `tests.py`:

- **oriental_q1**: Conditional expression for age check (5 test cases)
- **vermont_q1**: Boolean expression in a range (7 test cases)
- **connecticut_q1**: Loop over a list (4 test cases)

## Features

- Question-specific test suites with multiple test cases
- Safe code execution with timeout (5 seconds)
- Test variables automatically provided (age, x, nums, etc.)
- CORS enabled for React frontend
- Detailed test results showing which tests passed/failed
- Error handling and validation
