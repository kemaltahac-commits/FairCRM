# FairCRM

A full-stack CRM application for managing contacts, deals, and tasks.

FairCRM is a small business CRM built with React and FastAPI, featuring database-backed CRUD operations, dashboard statistics, and a local one-click launcher.

## Features

- Contact management
  - Create contacts
  - Edit contacts
  - Delete contacts
  - Search and filter contacts

- Deal management
  - Create deals
  - Edit deals
  - Delete deals
  - Track deal stages and values

- Task management
  - Create tasks
  - Edit tasks
  - Delete tasks
  - Mark tasks as completed

- Dashboard
  - Total contacts
  - Total deals
  - Total deal value
  - Won deals

- Persistent SQLite database
- REST API with FastAPI
- React frontend
- One-click local launcher

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

### Backend

- Python
- FastAPI
- Pydantic

### Database

- SQLite

## Project Structure

```text
FairCRM/
├── backend/
│   └── main.py
├── public/
├── src/
├── start.bat
├── package.json
└── README.md
Getting Started
Requirements
Node.js
Python 3.10+
Installation

Clone the repository:

git clone <YOUR_REPOSITORY_URL>
cd FairCRM

Install frontend dependencies:

npm install

Install backend dependencies:

pip install fastapi uvicorn pydantic
Running the Application

The easiest way to start FairCRM on Windows is:

start.bat

The launcher starts the backend and frontend locally and opens the application in your browser.

Manual Start

Start the backend:

cd backend
python -m uvicorn main:app --reload

Then, from the project root, start the frontend:

npm run dev
API

The backend provides REST endpoints for:

GET    /contacts
POST   /contacts
PUT    /contacts/{id}
DELETE /contacts/{id}

GET    /deals
POST   /deals
PUT    /deals/{id}
DELETE /deals/{id}

GET    /tasks
POST   /tasks
PUT    /tasks/{id}
DELETE /tasks/{id}

GET    /dashboard
Database

FairCRM uses SQLite for local persistent storage.

The database file is generated locally and is intentionally excluded from Git through .gitignore.

Project Status

FairCRM MVP is complete.

Current implementation includes:

Full contact CRUD
Full deal CRUD
Full task CRUD
Dashboard statistics
SQLite persistence
REST API integration
Frontend/backend launcher
Basic validation and bug testing
Future Improvements

Possible future improvements include:

Authentication
User accounts
PostgreSQL support
Cloud deployment
Advanced analytics
Notifications
Role-based access control
License

This project is currently for portfolio and demonstration purposes.






