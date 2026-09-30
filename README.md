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
- Customer data normalization & automatic segmentation

### Deal Management
- Create, edit, and delete deals
- Track deal stages (Prospect, Won, Lost, etc.) and values
- Associate deals with contacts
- Dashboard deal statistics synchronization

### Task Management
- Create, edit, and delete tasks
- Mark tasks as completed
- Track task-related business activities

### Dashboard & Analytics
- Total contacts & total deals overview
- Total revenue value calculation & won deals metric
- Customer segment distribution
- Dynamic data retrieval from backend API backed by SQLite

### Data Pipeline & Integration
FairCRM includes a dedicated backend data-processing pipeline for external systems:
- **Customer Data Ingestion**: `POST /customers/ingest` accepts JSON payloads for bulk/external integration.
- **Excel Report Export**: `GET /customers/export` generates downloadable `.xlsx` financial and contact reports on the fly.

---

## Tech Stack

- **Frontend**: React (Vite), TypeScript, TailwindCSS
- **Backend**: FastAPI (Python), Uvicorn, Pydantic, SQLite
- **Automation**: Dual-service Windows Batch script (`start.bat`)

---

## Quick Start

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Running the Application

You can launch both the React frontend and FastAPI backend concurrently using the automated starter batch script:

1. Double-click `start.bat` or run from terminal:
   ```cmd
   cmd /c start.bat
Access the services:Frontend: http://localhost:5173Backend API Docs: http://127.0.0.1:8000/docsAPI Endpoints OverviewMethodEndpointDescriptionGET/contactsFetch all contactsPOST/contactsCreate a new contactGET/dealsFetch all dealsPOST/dealsCreate a new dealGET/dashboardFetch dashboard metricsPOST/customers/ingestProcess external customer JSON dataGET/customers/exportDownload dynamic Excel report
