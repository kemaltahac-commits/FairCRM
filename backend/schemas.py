import re
from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, EmailStr, Field, field_validator


class CustomerIngestSchema(BaseModel):
    """
    Dış sistemlerden (Webhook/API) gelen ham müşteri verisini karşılayan ve doğrulayan şema.
    """
    external_id: str = Field(..., description="Dış sistemdeki benzersiz ID (ör. Shopify/Stripe ID)")
    full_name: str = Field(..., min_length=2, max_length=100, description="Müşterinin adı soyadı")
    email: EmailStr = Field(..., description="Geçerli bir e-posta adresi")
    phone: Optional[str] = Field(None, description="Müşteri telefon numarası")
    total_spent: float = Field(default=0.0, ge=0.0, description="Toplam harcama tutarı")
    country: Optional[str] = Field(default="Unknown", description="Ülke adı veya kodu")

    @field_validator("full_name")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        """Gelen ismin başındaki/sonundaki boşlukları temizler ve baş harflerini büyütür."""
        clean_name = " ".join(v.split()).title()
        if not clean_name:
            raise ValueError("İsim alanı boş veya sadece boşluktan oluşamaz.")
        return clean_name

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, v: Optional[str]) -> Optional[str]:
        """Telefon numarasından sadece rakamları ve '+' işaretini süzerek temizler."""
        if not v:
            return None
        cleaned = re.sub(r"[^\d+]", "", v)
        return cleaned if len(cleaned) >= 7 else None


class CustomerResponseSchema(BaseModel):
    """
    Sistemimizin JSON API olarak dışarıya döneceği işlenmiş müşteri yanıt şeması.
    """
    id: int
    external_id: str
    full_name: str
    email: str
    phone: Optional[str]
    total_spent: float
    segment: str  # Service layer belirleyecek (VIP, Regular, Low-Value)
    country: str
    updated_at: str

    class Config:
        from_attributes = True


class CustomerStatsResponse(BaseModel):
    """
    GET /customers/stats endpoint'i için analitik özet yanıt şeması.
    """
    total_customers: int
    total_revenue: float
    average_order_value: float
    segments_breakdown: Dict[str, int]