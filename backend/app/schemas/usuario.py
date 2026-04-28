from pydantic import BaseModel
from typing import Literal


class UsuarioCreate(BaseModel):
    nombre_usuario: str
    rol: Literal["Admin", "Cajero"] = "Cajero"
    password: str


class UsuarioOut(BaseModel):
    id_usuario: int
    nombre_usuario: str
    rol: str

    model_config = {"from_attributes": True}
