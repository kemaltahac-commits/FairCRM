import io
import pandas as pd
from database import get_db_connection


def generate_excel_report() -> io.BytesIO:
    """
    Veritabanındaki tüm müşterileri çeker, Pandas DataFrame'e dönüştürür
    ve OpenPyXL ile bellekte (BytesIO) formatlanmış bir Excel dosyası oluşturur.
    """
    conn = get_db_connection()
    df = pd.read_sql_query(
        "SELECT id, external_id, full_name, email, phone, total_spent, segment, country, updated_at FROM customers",
        conn
    )
    conn.close()

    # Sütun isimlerini kurumsal formata çevir
    df.rename(columns={
        "id": "ID",
        "external_id": "Dış Sistem ID",
        "full_name": "Ad Soyad",
        "email": "E-Posta",
        "phone": "Telefon",
        "total_spent": "Toplam Harcama ($)",
        "segment": "Segment",
        "country": "Ülke",
        "updated_at": "Son Güncelleme"
    }, inplace=True)

    # Excel dosyasını disk yerine RAM'de oluşturmak için BytesIO kullanımı
    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="Müşteri Raporu")

    output.seek(0)
    return output