from sqlalchemy import Column, Integer, String
from app.database import Base


class Usuario(Base):
    __tablename__ = "USUARIO"

    id_usuario     = Column(Integer, primary_key=True, index=True)
    nombre_usuario = Column(String(100), nullable=False, unique=True)
    rol            = Column(String(20), nullable=False, default="cajero")
    password_hash  = Column(String(255), nullable=False)
