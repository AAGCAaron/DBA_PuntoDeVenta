from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, LargeBinary
from app.database import Base


class Producto(Base):
    __tablename__ = "Productos"

    id_producto     = Column(Integer, primary_key=True, index=True)
    codigo_barras   = Column(String(50), nullable=False, unique=True)
    nombre_producto = Column(String(200), nullable=False)
    precio_venta    = Column(Numeric(10, 2), nullable=False)
    stock           = Column(Integer, nullable=False, default=0)
    id_categoria    = Column(Integer, ForeignKey("Categorias.id_categoria"), nullable=True)
    id_proveedor    = Column(Integer, ForeignKey("Proveedores.id_proveedor"), nullable=True)
    imagen_articulo = Column(LargeBinary(length=2**32 - 1), nullable=True)
