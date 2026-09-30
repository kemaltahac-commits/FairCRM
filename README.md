# FairCRM

A full-stack CRM application for managing contacts, deals, tasks, and business data.

FairCRM is a modern small-business CRM built with React and FastAPI. It combines a responsive frontend with a database-backed REST API, business logic, data ingestion, customer segmentation, dashboard analytics, and Excel reporting.

The project was developed as a portfolio-focused full-stack application with an emphasis on practical business automation and data processing.

---

## Features

### Contact Management

- Create contacts
- Edit contacts
- Delete contacts
- Search and filter contacts
- Store customer information in SQLite
- Customer data normalization
- Customer segmentation

### Deal Management

- Create deals
- Edit deals
- Delete deals
- Track deal stages
- Track deal values
- Associate deals with customers
- Dashboard deal statistics

### Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Mark tasks as completed
- Track task-related activities

### Dashboard

The dashboard provides business-level statistics including:

- Total contacts
- Total deals
- Total deal value
- Won deals
- Customer statistics
- Customer segment distribution

Dashboard data is retrieved from the backend API and persisted in the SQLite database.

---

## Data Pipeline & Integration

FairCRM also includes a backend data-processing pipeline for importing customer data from external systems.

### Customer Data Ingestion

External JSON data can be sent to:

```text
POST /customers/ingest
