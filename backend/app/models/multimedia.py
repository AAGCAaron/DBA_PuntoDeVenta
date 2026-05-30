from sqlalchemy import Column, Integer, String, LargeBinary
from app.database import Base

class EvidenciaMultimedia(Base):
    __tablename__ = "EVIDENCIA_MULTIMEDIA"

    id_archivo = Column(Integer, primary_key=True, index=True)
    nombre_archivo = Column(String(100), nullable=False)
    tipo_mime = Column(String(50), nullable=False)
    archivo_blob = Column(LargeBinary(length=2**32 - 1), nullable=False)
    ruta_archivo = Column(String(255), nullable=False)
