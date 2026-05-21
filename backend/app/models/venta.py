from sqlalchemy import Column, Integer, Numeric, DateTime, ForeignKey, LargeBinary
from sqlalchemy.sql import func
from app.database import Base


class Venta(Base):
    __tablename__ = "VENTA"

    id_venta        = Column(Integer, primary_key=True, index=True)
    fecha_hora      = Column(DateTime, nullable=False, default=func.now())
    monto_total     = Column(Numeric(10, 2), nullable=False)
    id_usuario      = Column(Integer, ForeignKey("USUARIO.id_usuario"), nullable=False)
    id_cliente      = Column(Integer, ForeignKey("CLIENTE.id_cliente"), nullable=True)
    archivo_factura = Column(LargeBinary(length=2**32 - 1), nullable=True)
