from pydantic import BaseModel, EmailStr
from typing import Optional


class ClienteCreate(BaseModel):
    nombre_completo: str
    rfc: Optional[str] = None
    correo_electronico: Optional[str] = None


class ClienteOut(ClienteCreate):
    id_cliente: int

    model_config = {"from_attributes": True}
