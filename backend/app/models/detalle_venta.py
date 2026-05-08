from sqlalchemy import Column, Integer, Numeric, ForeignKey
from app.database import Base


class DetalleVenta(Base):
    __tablename__ = "DETALLE_VENTA"

    id_venta        = Column(Integer, ForeignKey("VENTA.id_venta", ondelete="CASCADE"), primary_key=True)
    id_producto     = Column(Integer, ForeignKey("PRODUCTO.id_producto"), primary_key=True)
    cantidad        = Column(Integer, nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    subtotal        = Column(Numeric(10, 2), nullable=False)
