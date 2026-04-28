from pydantic import BaseModel
from typing import Optional
from decimal import Decimal


class ProductoCreate(BaseModel):
    codigo_barras: str
    nombre_producto: str
    precio_venta: Decimal
    stock: int = 0
    id_categoria: Optional[int] = None
    id_proveedor: Optional[int] = None


class ProductoOut(ProductoCreate):
    id_producto: int
    tiene_imagen: bool = False

    model_config = {"from_attributes": True}
