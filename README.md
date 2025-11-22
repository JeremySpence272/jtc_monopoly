# JTC Monopoly Game

A Monopoly-style educational game built with React, TypeScript, and Python Flask backend.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v16 or higher) and **npm**
- **Python** (v3.8 or higher) and **pip**

## Installation & Setup

### 1. Install Node.js Dependencies

Install all required npm packages:

**Make sure you are inside the jtc_monopoly directory**

```bash
npm install
```

This will install all dependencies listed in `package.json`, including React, TypeScript, Vite, and CodeMirror.

### 2. Install Python Dependencies

Install the Python requirements for the backend server:

It's recommended to use a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Then install requirements
pip install -r requirements.txt
```

## Running the Application

The application consists of two parts that need to run simultaneously:

1. **Backend Server** (Python Flask) - handles code testing and game state
2. **Frontend** (React/Vite) - the game UI

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
python server.py
```

You should see output like:

````
Starting Monopoly Code Testing Server on http://localhost:5001

**Keep this terminal open** - the server must stay running.

### Step 2: Start the Frontend Development Server

Open a **new terminal window** (keep the backend server running in the first terminal) and run:

```bash
npm run dev
````

You should see output like:

```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open the Application

Open your web browser and navigate to:

**http://localhost:5173**

(If port 5173 is in use, Vite will automatically try the next available port - check the terminal output for the exact URL)

## Important Notes

- **Both servers must be running** for the application to work properly
- The backend server runs on **http://localhost:5001**
- The frontend runs on **http://localhost:5173** (or next available port)
- Keep both terminal windows open while using the application
- To stop the servers, press `Ctrl+C` in each terminal

## Troubleshooting

### Port Already in Use

If you see "Port 5173 is in use", Vite will automatically try the next port (5174, 5175, etc.). Check the terminal output for the correct URL.

### Backend Connection Issues

If the frontend can't connect to the backend:

1. Make sure `python server.py` is running
2. Verify it's running on `http://localhost:5001`
3. Check the browser console for connection errors

### Module Not Found Errors

If you see "Module not found" errors:

- Run `npm install` again for frontend dependencies
- Run `pip install -r requirements.txt` again for backend dependencies

## Other Available Commands

- `npm run build` - Build the frontend for production
- `npm run preview` - Preview the production build
- `python server.py` - Start the backend server (with debug mode enabled)

## Project Structure

- `src/` - React/TypeScript frontend source code
- `server.py` - Python Flask backend server
- `tests.py` - Python test suites for code challenges
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies and scripts
