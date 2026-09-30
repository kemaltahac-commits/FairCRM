import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr

from database import get_db_connection, init_db
from exporter import generate_excel_report
from logger import logger
from service import process_and_segment_customer

app = FastAPI(
    title="FairCRM Platform API",
    description="Full-stack CRM Platform Backend",
    version="2.0.0"
)

# ==========================================
# 1. CORS MIDDLEWARE (Tüm Origin/Portlara Tam İzin)
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # Wildcard (*) kullanıldığında allow_credentials=False olmalıdır
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# 2. PYDANTIC SCHEMAS (Frontend Uyumlu)
# ==========================================

class ContactBase(BaseModel):
    firstName: str
    lastName: str
    company: str
    email: str
    status: str
    lastContact: str
    phone: str

class ContactCreate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: str

class DealBase(BaseModel):
    title: str
    contact_id: str
    value: float
    stage: str

class DealCreate(DealBase):
    pass

class DealResponse(DealBase):
    id: str
    created_at: str

class DashboardData(BaseModel):
    total_contacts: int
    total_deals: int
    total_value: float
    won_deals: int

class CustomerIngestSchema(BaseModel):
    external_id: str
    full_name: str
    email: EmailStr
    phone: str
    total_spent: float
    country: Optional[str] = "TR"


# ==========================================
# 3. STARTUP EVENT
# ==========================================

@app.on_event("startup")
def startup_event():
    init_db()
    logger.info("FairCRM Veritabanı ve Tablolar Hazır.")


# ==========================================
# 4. CONTACTS ENDPOINTS (CRUD)
# ==========================================

@app.get("/contacts", response_model=List[ContactResponse])
def get_contacts():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, firstName, lastName, company, email, status, lastContact, phone FROM contacts ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/contacts", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def create_contact(payload: ContactCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM contacts")
    count = cursor.fetchone()[0]
    new_id = f"c{count + 1}"

    cursor.execute("""
        INSERT INTO contacts (id, firstName, lastName, company, email, status, lastContact, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (new_id, payload.firstName, payload.lastName, payload.company, payload.email, payload.status, payload.lastContact, payload.phone))
    
    conn.commit()
    conn.close()
    return {**payload.dict(), "id": new_id}

@app.put("/contacts/{contact_id}", response_model=ContactResponse)
def update_contact(contact_id: str, payload: ContactCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE contacts 
        SET firstName = ?, lastName = ?, company = ?, email = ?, status = ?, lastContact = ?, phone = ?
        WHERE id = ?
    """, (payload.firstName, payload.lastName, payload.company, payload.email, payload.status, payload.lastContact, payload.phone, contact_id))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Contact not found")
        
    conn.commit()
    conn.close()
    return {**payload.dict(), "id": contact_id}

@app.delete("/contacts/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM contacts WHERE id = ?", (contact_id,))
    conn.commit()
    conn.close()
    return None


# ==========================================
# 5. DEALS ENDPOINTS (CRUD)
# ==========================================

@app.get("/deals", response_model=List[DealResponse])
def get_deals():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, contact_id, value, stage, created_at FROM deals ORDER BY id DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

@app.post("/deals", response_model=DealResponse, status_code=status.HTTP_201_CREATED)
def create_deal(payload: DealCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM deals")
    count = cursor.fetchone()[0]
    new_id = f"d{count + 1}"
    created_at = datetime.datetime.now().strftime("%Y-%m-%d")

    cursor.execute("""
        INSERT INTO deals (id, title, contact_id, value, stage, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (new_id, payload.title, payload.contact_id, payload.value, payload.stage, created_at))
    
    conn.commit()
    conn.close()
    return {**payload.dict(), "id": new_id, "created_at": created_at}

@app.put("/deals/{deal_id}", response_model=DealResponse)
def update_deal(deal_id: str, payload: DealCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE deals 
        SET title = ?, contact_id = ?, value = ?, stage = ?
        WHERE id = ?
    """, (payload.title, payload.contact_id, payload.value, payload.stage, deal_id))
    
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Deal not found")
        
    cursor.execute("SELECT created_at FROM deals WHERE id = ?", (deal_id,))
    created_at = cursor.fetchone()[0]
    
    conn.commit()
    conn.close()
    return {**payload.dict(), "id": deal_id, "created_at": created_at}

@app.delete("/deals/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deal(deal_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM deals WHERE id = ?", (deal_id,))
    conn.commit()
    conn.close()
    return None


# ==========================================
# 6. DASHBOARD METRICS ENDPOINT
# ==========================================

@app.get("/dashboard", response_model=DashboardData)
def get_dashboard_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) FROM contacts")
    total_contacts = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*), COALESCE(SUM(value), 0) FROM deals")
    deal_stats = cursor.fetchone()
    total_deals = deal_stats[0]
    total_value = deal_stats[1]
    
    cursor.execute("SELECT COUNT(*) FROM deals WHERE stage = 'won'")
    won_deals = cursor.fetchone()[0]
    
    conn.close()
    
    return {
        "total_contacts": total_contacts,
        "total_deals": total_deals,
        "total_value": total_value,
        "won_deals": won_deals
    }


# ==========================================
# 7. DATA INGESTION & EXPORT ENDPOINTS (v2 Pipeline)
# ==========================================

@app.post("/customers/ingest", status_code=status.HTTP_201_CREATED)
def ingest_customer(payload: CustomerIngestSchema):
    processed_data = process_and_segment_customer(payload.dict())
    return processed_data

@app.get("/customers/export")
def export_customers_excel():
    try:
        excel_stream = generate_excel_report()
        headers = {
            "Content-Disposition": "attachment; filename=FairCRM_Customer_Report.xlsx"
        }
        return StreamingResponse(
            excel_stream,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers=headers
        )
    except Exception as e:
        logger.error(f"Excel export sırasında hata: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Excel raporu oluşturulamadı: {str(e)}"
        )