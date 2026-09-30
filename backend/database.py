import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "crm.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Verilerin dictionary gibi çekilmesini sağlar
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Contacts Tablosu
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id TEXT PRIMARY KEY,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            company TEXT NOT NULL,
            email TEXT NOT NULL,
            status TEXT NOT NULL,
            lastContact TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    """)
    
    # Deals Tablosu
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS deals (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            contact_id TEXT NOT NULL,
            value REAL NOT NULL,
            stage TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    
    # Demo/Örnek Veri Ekleme (Eğer tablo boşsa)
    cursor.execute("SELECT COUNT(*) FROM contacts")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO contacts (id, firstName, lastName, company, email, status, lastContact, phone)
            VALUES 
            ('c1', 'Ahmet', 'Yılmaz', 'TechCorp', 'ahmet@techcorp.com', 'Müşteri', '2026-09-28', '+90 532 000 0000'),
            ('c2', 'Ayşe', 'Kaya', 'InnoSoft', 'ayse@innosoft.com', 'Potansiyel', '2026-09-29', '+90 533 111 2222')
        """)
        
    cursor.execute("SELECT COUNT(*) FROM deals")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO deals (id, title, contact_id, value, stage, created_at)
            VALUES 
            ('d1', 'Yazılım Lisans Anlaşması', 'c1', 15000.0, 'won', '2026-09-25'),
            ('d2', 'Bulut Altyapı Desteği', 'c2', 8500.0, 'prospect', '2026-09-29')
        """)

    conn.commit()
    conn.close()