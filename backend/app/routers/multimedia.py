from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.multimedia import EvidenciaMultimedia
import os
import base64

router = APIRouter(
    prefix="/multimedia",
    tags=["Multimedia Evidence"]
)

# Crear directorio de uploads si no existe
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_file(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    try:
        # 1. Guardar el archivo físicamente para tener la RUTA
        file_location = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_location, "wb+") as f:
            f.write(file.file.read())
        
        # 2. Leer los bytes puros para el BLOB
        file.file.seek(0)
        blob_data = file.file.read()
        
        # 3. Guardar en BD
        nuevo_archivo = EvidenciaMultimedia(
            nombre_archivo=file.filename,
            tipo_mime=file.content_type,
            archivo_blob=blob_data,
            ruta_archivo=f"/{file_location}"  # Ruta accesible desde frontend
        )
        db.add(nuevo_archivo)
        db.commit()
        db.refresh(nuevo_archivo)
        
        return {"id": nuevo_archivo.id_archivo, "message": "Archivo guardado por vía dual exitosamente."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
def get_archivos(db: Session = Depends(get_db)):
    archivos = db.query(EvidenciaMultimedia).all()
    resultado = []
    for a in archivos:
        # Codificamos el BLOB a Base64 para enviarlo al frontend
        blob_base64 = base64.b64encode(a.archivo_blob).decode('utf-8') if a.archivo_blob else None
        
        resultado.append({
            "id_archivo": a.id_archivo,
            "nombre_archivo": a.nombre_archivo,
            "tipo_mime": a.tipo_mime,
            "ruta_archivo": f"http://localhost:8000{a.ruta_archivo}", # Generamos URL absoluta
            "blob_base64": blob_base64
        })
    return resultado
