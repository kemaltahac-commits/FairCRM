from typing import Dict, Any
from schemas import CustomerIngestSchema


def process_and_segment_customer(payload: CustomerIngestSchema) -> Dict[str, Any]:
    """
    Pydantic tarafından doğrulanmış veriyi alır, 
    iş kurallarını (segmentasyon, temizlik) uygular ve veritabanı için hazır dict döner.
    """
    data = payload.model_dump()

    # 1. Segmentasyon Mantığı (Business Rule)
    spent = data.get("total_spent", 0.0)
    if spent >= 1000.0:
        segment = "VIP"
    elif spent >= 200.0:
        segment = "Regular"
    else:
        segment = "Low-Value"

    data["segment"] = segment

    # 2. Ülke alanı boşsa varsayılan atama
    if not data.get("country"):
        data["country"] = "Unknown"

    return data