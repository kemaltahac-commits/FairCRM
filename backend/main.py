import re
import sqlite3
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATABASE_PATH = Path(__file__).with_name("faircrm.db")


# =========================
# MODELS
# =========================

class ContactCreate(BaseModel):
    firstName: str
    lastName: str
    company: str
    email: str
    phone: str
    status: str
    lastContact: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip()

        email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

        if not re.match(email_pattern, value):
            raise ValueError("Please enter a valid email address")

        return value

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str):
        value = value.strip()

        if not value.isdigit():
            raise ValueError("Phone number must contain only numbers")

        if len(value) < 7:
            raise ValueError("Phone number is too short")

        return value


class DealCreate(BaseModel):
    title: str
    contact_id: str
    value: int
    stage: str


class TaskCreate(BaseModel):
    title: str
    status: str = "pending"
    dueDate: str


class TaskUpdate(BaseModel):
    title: str
    status: str
    dueDate: str


# =========================
# DATABASE
# =========================

def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


# =========================
# ROW CONVERTERS
# =========================

def contact_from_row(row: sqlite3.Row):
    return {
        "id": str(row["id"]),
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "company": row["company"],
        "email": row["email"],
        "phone": row["phone"],
        "status": row["status"],
        "lastContact": row["lastContact"],
    }


def deal_from_row(row: sqlite3.Row):
    return {
        "id": row["id"],
        "title": row["title"],
        "contact_id": row["contact_id"],
        "value": row["value"],
        "stage": row["stage"],
        "created_at": row["created_at"],
    }


def task_from_row(row: sqlite3.Row):
    return {
        "id": str(row["id"]),
        "title": row["title"],
        "status": row["status"],
        "dueDate": row["due_date"],
    }


# =========================
# DATABASE INITIALIZATION
# =========================

def initialize_database():
    database_exists = DATABASE_PATH.exists()

    with get_connection() as connection:

        # CONTACTS
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstName TEXT NOT NULL,
                lastName TEXT NOT NULL,
                company TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT NOT NULL,
                status TEXT NOT NULL,
                lastContact TEXT NOT NULL
            )
            """
        )

        # TASKS
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                status TEXT NOT NULL,
                due_date TEXT NOT NULL
            )
            """
        )

        # DEALS
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS deals (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                contact_id TEXT NOT NULL,
                value INTEGER NOT NULL,
                stage TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )

        # SAMPLE CONTACTS
        if not database_exists:
            connection.executemany(
                """
                INSERT INTO contacts
                    (
                        firstName,
                        lastName,
                        company,
                        email,
                        phone,
                        status,
                        lastContact
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        "Ali",
                        "Yılmaz",
                        "FairCRM",
                        "ali@faircrm.com",
                        "5551111111",
                        "active",
                        "2026-08-15",
                    ),
                    (
                        "Veli",
                        "Demir",
                        "Acme Corp",
                        "veli@acme.com",
                        "5552222222",
                        "lead",
                        "2026-08-12",
                    ),
                ],
            )

            # SAMPLE DEALS
            connection.executemany(
                """
                INSERT INTO deals
                    (
                        id,
                        title,
                        contact_id,
                        value,
                        stage,
                        created_at
                    )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                [
                    (
                        "deal-1",
                        "Website Redesign",
                        "1",
                        12000,
                        "proposal",
                        "2026-08-20",
                    ),
                    (
                        "deal-2",
                        "CRM Expansion",
                        "2",
                        8500,
                        "qualified",
                        "2026-08-21",
                    ),
                ],
            )


initialize_database()


# =========================
# CONTACTS
# =========================

@app.get("/contacts")
def get_contacts():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT * FROM contacts ORDER BY id"
        ).fetchall()

    return [contact_from_row(row) for row in rows]


@app.post("/contacts")
def create_contact(contact: ContactCreate):
    with get_connection() as connection:

        cursor = connection.execute(
            """
            INSERT INTO contacts
                (
                    firstName,
                    lastName,
                    company,
                    email,
                    phone,
                    status,
                    lastContact
                )
            VALUES
                (
                    :firstName,
                    :lastName,
                    :company,
                    :email,
                    :phone,
                    :status,
                    :lastContact
                )
            """,
            contact.model_dump(),
        )

        row = connection.execute(
            "SELECT * FROM contacts WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()

    return contact_from_row(row)


@app.put("/contacts/{contact_id}")
def update_contact(contact_id: str, contact: ContactCreate):
    with get_connection() as connection:

        cursor = connection.execute(
            """
            UPDATE contacts
            SET
                firstName = :firstName,
                lastName = :lastName,
                company = :company,
                email = :email,
                phone = :phone,
                status = :status,
                lastContact = :lastContact
            WHERE id = :id
            """,
            {
                **contact.model_dump(),
                "id": contact_id,
            },
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Contact not found",
            )

        row = connection.execute(
            "SELECT * FROM contacts WHERE id = ?",
            (contact_id,),
        ).fetchone()

    return contact_from_row(row)


@app.delete("/contacts/{contact_id}")
def delete_contact(contact_id: str):
    with get_connection() as connection:

        cursor = connection.execute(
            "DELETE FROM contacts WHERE id = ?",
            (contact_id,),
        )

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Contact not found",
        )

    return {
        "message": "Contact deleted"
    }


# =========================
# TASKS
# =========================

@app.get("/tasks")
def get_tasks():
    with get_connection() as connection:

        rows = connection.execute(
            """
            SELECT *
            FROM tasks
            ORDER BY due_date ASC
            """
        ).fetchall()

    return [task_from_row(row) for row in rows]


@app.post("/tasks")
def create_task(task: TaskCreate):

    new_task = {
        "id": str(uuid4()),
        "title": task.title,
        "status": task.status,
        "dueDate": task.dueDate,
    }

    with get_connection() as connection:

        connection.execute(
            """
            INSERT INTO tasks
                (
                    id,
                    title,
                    status,
                    due_date
                )
            VALUES
                (
                    :id,
                    :title,
                    :status,
                    :dueDate
                )
            """,
            new_task,
        )

        row = connection.execute(
            "SELECT * FROM tasks WHERE id = ?",
            (new_task["id"],),
        ).fetchone()

    return task_from_row(row)


@app.put("/tasks/{task_id}")
def update_task(task_id: str, task: TaskUpdate):

    with get_connection() as connection:

        cursor = connection.execute(
            """
            UPDATE tasks
            SET
                title = :title,
                status = :status,
                due_date = :dueDate
            WHERE id = :id
            """,
            {
                **task.model_dump(),
                "id": task_id,
            },
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Task not found",
            )

        row = connection.execute(
            "SELECT * FROM tasks WHERE id = ?",
            (task_id,),
        ).fetchone()

    return task_from_row(row)


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):

    with get_connection() as connection:

        cursor = connection.execute(
            "DELETE FROM tasks WHERE id = ?",
            (task_id,),
        )

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Task not found",
        )

    return {
        "message": "Task deleted"
    }


# =========================
# DEALS
# =========================

@app.get("/deals")
def get_deals():
    with get_connection() as connection:

        rows = connection.execute(
            """
            SELECT *
            FROM deals
            ORDER BY created_at DESC
            """
        ).fetchall()

    return [deal_from_row(row) for row in rows]


@app.post("/deals")
def create_deal(deal: DealCreate):

    new_deal = {
        "id": str(uuid4()),
        **deal.model_dump(),
    }

    with get_connection() as connection:

        connection.execute(
            """
            INSERT INTO deals
                (
                    id,
                    title,
                    contact_id,
                    value,
                    stage,
                    created_at
                )
            VALUES
                (
                    :id,
                    :title,
                    :contact_id,
                    :value,
                    :stage,
                    date('now')
                )
            """,
            new_deal,
        )

        row = connection.execute(
            "SELECT * FROM deals WHERE id = ?",
            (new_deal["id"],),
        ).fetchone()

    return deal_from_row(row)


@app.put("/deals/{deal_id}")
def update_deal(deal_id: str, deal: DealCreate):

    with get_connection() as connection:

        cursor = connection.execute(
            """
            UPDATE deals
            SET
                title = :title,
                contact_id = :contact_id,
                value = :value,
                stage = :stage
            WHERE id = :id
            """,
            {
                **deal.model_dump(),
                "id": deal_id,
            },
        )

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Deal not found",
            )

        row = connection.execute(
            "SELECT * FROM deals WHERE id = ?",
            (deal_id,),
        ).fetchone()

    return deal_from_row(row)


@app.delete("/deals/{deal_id}")
def delete_deal(deal_id: str):

    with get_connection() as connection:

        cursor = connection.execute(
            "DELETE FROM deals WHERE id = ?",
            (deal_id,),
        )

    if cursor.rowcount == 0:
        raise HTTPException(
            status_code=404,
            detail="Deal not found",
        )

    return {
        "message": "Deal deleted"
    }


# =========================
# DASHBOARD
# =========================

@app.get("/dashboard")
def get_dashboard():

    with get_connection() as connection:

        total_contacts = connection.execute(
            "SELECT COUNT(*) FROM contacts"
        ).fetchone()[0]

        total_deals = connection.execute(
            "SELECT COUNT(*) FROM deals"
        ).fetchone()[0]

        total_value = connection.execute(
            "SELECT COALESCE(SUM(value), 0) FROM deals"
        ).fetchone()[0]

        won_deals = connection.execute(
            """
            SELECT COUNT(*)
            FROM deals
            WHERE LOWER(TRIM(stage)) = 'won'
            """
        ).fetchone()[0]

    return {
        "total_contacts": total_contacts,
        "total_deals": total_deals,
        "total_value": total_value,
        "won_deals": won_deals,
    }