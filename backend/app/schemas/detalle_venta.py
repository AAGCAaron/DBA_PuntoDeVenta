from pydantic import BaseModel
from decimal import Decimal


class DetalleVentaCreate(BaseModel):
    id_producto: int
    cantidad: int
    precio_unitario: Decimal


class DetalleVentaOut(DetalleVentaCreate):
    id_venta: int
    subtotal: Decimal

    model_config = {"from_attributes": True}
