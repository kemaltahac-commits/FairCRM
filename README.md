# FairCRM

A full-stack CRM application for managing contacts, deals, tasks, and business data.

FairCRM is a modern small-business CRM built with React and FastAPI. It combines a responsive frontend with a database-backed REST API, business logic, data ingestion, customer segmentation, dashboard analytics, and Excel reporting.

The project was developed as a portfolio-focused full-stack application with an emphasis on practical business automation and data processing.

---

## Features

### Contact Management

- Create, edit, and delete contacts
- Search and filter contacts
- Store customer information in SQLite
- Customer data normalization and automatic segmentation

### Deal Management

- Create, edit, and delete deals
- Track deal stages (Prospect, Won, Lost, etc.) and values
- Associate deals with contacts
- Synchronize deal data with dashboard statistics

### Task Management

- Create, edit, and delete tasks
- Mark tasks as completed
- Track task-related business activities

### Dashboard & Analytics

- Total contacts and total deals overview
- Total deal value and won deals metrics
- Customer segment distribution
- Dynamic data retrieval from the backend API
- SQLite-backed business statistics

### Data Pipeline & Integration

FairCRM includes a dedicated backend data-processing pipeline for external systems.

- **Customer Data Ingestion**  
  `POST /customers/ingest` accepts JSON payloads for external data integration.

- **Excel Report Export**  
  `GET /customers/export` generates downloadable `.xlsx` reports from CRM data.

---

## Tech Stack

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic

### Database & Reporting

- SQLite
- Pandas
- OpenPyXL

### Automation

- Windows Batch Script (`start.bat`)

---

## Architecture

```text
React + TypeScript
        │
        │ REST API
        ▼
FastAPI Backend
        │
        ├── Validation
        ├── Business Logic
        ├── Data Processing
        └── Customer Segmentation
        │
        ▼
SQLite Database
        │
        ├── Dashboard Analytics
        └── Excel Export
```

---

## Quick Start

### Prerequisites

- Node.js v18+
- Python v3.10+

### Running the Application

The easiest way to launch FairCRM on Windows is by using the included starter script.

Double-click:

```text
start.bat
```

Or run it from the terminal:

```bash
cmd /c start.bat
```

The launcher starts both the React frontend and FastAPI backend.

### Local Services

**Frontend**

http://localhost:5173

**Backend API**

http://127.0.0.1:8000

**Interactive API Documentation**

http://127.0.0.1:8000/docs

---

## API Endpoints

### Contacts

| Method | Endpoint | Description |
|---|---|---|
| GET | `/contacts` | Fetch all contacts |
| POST | `/contacts` | Create a new contact |
| PUT | `/contacts/{id}` | Update a contact |
| DELETE | `/contacts/{id}` | Delete a contact |

### Deals

| Method | Endpoint | Description |
|---|---|---|
| GET | `/deals` | Fetch all deals |
| POST | `/deals` | Create a new deal |
| PUT | `/deals/{id}` | Update a deal |
| DELETE | `/deals/{id}` | Delete a deal |

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Fetch all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Fetch dashboard metrics |

### Data Integration

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customers/ingest` | Process external customer JSON data |
| GET | `/customers/stats` | Fetch customer statistics |
| GET | `/customers/export` | Generate and download Excel report |

---

## Data Pipeline

FairCRM processes external customer data through the following pipeline:

```text
External JSON
      ↓
Pydantic Validation
      ↓
Data Cleaning & Normalization
      ↓
Customer Segmentation
      ↓
SQLite UPSERT
      ↓
Updated Customer Record
```

This allows customer data from external systems to be validated, processed, normalized, segmented, and persisted in the CRM database.

---

## Excel Reporting

CRM customer data can be exported into an Excel report:

```text
SQLite Database
      ↓
Data Processing
      ↓
Pandas / OpenPyXL
      ↓
Excel Report (.xlsx)
```

The generated report can be used for further business analysis and reporting outside the CRM application.

---

## Project Structure

```text
FairCRM/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── schemas.py
│   ├── service.py
│   ├── exporter.py
│   └── logger.py
│
├── src/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── public/
│
├── start.bat
├── package.json
├── .gitignore
└── README.md
```

The backend separates API endpoints, validation, database operations, business logic, logging, and Excel export responsibilities.

---

## Database

FairCRM uses SQLite for local persistent storage.

The database stores application data such as:

- Contacts
- Deals
- Tasks
- Customer information

The database file is generated locally and is intentionally excluded from Git through `.gitignore`.

---

## Project Status

**MVP + V2 Data Pipeline**

Current implementation includes:

- Full contact CRUD
- Full deal CRUD
- Full task CRUD
- Dashboard analytics
- SQLite persistence
- REST API integration
- Pydantic validation
- Customer data ingestion
- Data normalization
- Customer segmentation
- SQLite UPSERT
- Customer statistics
- Excel reporting
- Windows one-click launcher
- Basic validation and testing

The project is currently focused on local development and portfolio demonstration.

---

## Future Improvements

Potential future improvements include:

- Authentication
- User accounts
- Role-based access control
- PostgreSQL support
- Cloud deployment
- Advanced analytics
- Notifications
- Automated testing
- Docker deployment

---

## License

This project is currently for portfolio and demonstration purposes.
