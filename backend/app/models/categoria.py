from sqlalchemy import Column, Integer, String, Text
from app.database import Base


class Categoria(Base):
    __tablename__ = "Categorias"

    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre       = Column(String(100), nullable=False)
    descripcion  = Column(Text, nullable=True)
