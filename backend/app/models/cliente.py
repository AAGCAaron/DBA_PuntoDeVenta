from sqlalchemy import Column, Integer, String
from app.database import Base


class Cliente(Base):
    __tablename__ = "CLIENTE"

    id_cliente         = Column(Integer, primary_key=True, index=True)
    nombre_completo    = Column(String(200), nullable=False)
    rfc                = Column(String(13), nullable=True)
    correo_electronico = Column(String(150), nullable=True)
