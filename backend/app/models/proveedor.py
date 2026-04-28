from sqlalchemy import Column, Integer, String
from app.database import Base


class Proveedor(Base):
    __tablename__ = "Proveedores"

    id_proveedor      = Column(Integer, primary_key=True, index=True)
    razon_social      = Column(String(200), nullable=False)
    rfc               = Column(String(13), nullable=False, unique=True)
    telefono_contacto = Column(String(20), nullable=True)
