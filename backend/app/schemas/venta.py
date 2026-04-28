from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from .detalle_venta import DetalleVentaCreate, DetalleVentaOut


class VentaCreate(BaseModel):
    id_usuario: int
    id_cliente: Optional[int] = None
    detalle: List[DetalleVentaCreate]


class VentaOut(BaseModel):
    id_venta: int
    fecha_hora: datetime
    monto_total: Decimal
    id_usuario: int
    id_cliente: Optional[int] = None
    tiene_factura: bool = False

    model_config = {"from_attributes": True}
