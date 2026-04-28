from pydantic import BaseModel
from typing import Optional


class CategoriaCreate(BaseModel):
    nombre: str
    descripcion: Optional[str] = None


class CategoriaOut(CategoriaCreate):
    id_categoria: int

    model_config = {"from_attributes": True}
