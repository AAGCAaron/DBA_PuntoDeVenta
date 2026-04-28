from pydantic import BaseModel
from typing import Optional


class ProveedorCreate(BaseModel):
    razon_social: str
    rfc: str
    telefono_contacto: Optional[str] = None


class ProveedorOut(ProveedorCreate):
    id_proveedor: int

    model_config = {"from_attributes": True}
