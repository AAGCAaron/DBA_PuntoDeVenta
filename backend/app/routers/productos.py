from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.producto import Producto
from app.schemas.producto import ProductoCreate, ProductoOut

router = APIRouter(prefix="/productos", tags=["Productos"])


@router.get("/", response_model=List[ProductoOut])
def listar(db: Session = Depends(get_db)):
    productos = db.query(Producto).all()
    result = []
    for p in productos:
        out = ProductoOut.model_validate(p)
        out.tiene_imagen = p.imagen_articulo is not None
        result.append(out)
    return result


@router.get("/{id_producto}", response_model=ProductoOut)
def obtener(id_producto: int, db: Session = Depends(get_db)):
    p = db.get(Producto, id_producto)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    out = ProductoOut.model_validate(p)
    out.tiene_imagen = p.imagen_articulo is not None
    return out


@router.get("/{id_producto}/imagen")
def obtener_imagen(id_producto: int, db: Session = Depends(get_db)):
    p = db.get(Producto, id_producto)
    if not p or not p.imagen_articulo:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    return Response(content=p.imagen_articulo, media_type="image/jpeg")


@router.post("/", response_model=ProductoOut, status_code=201)
def crear(data: ProductoCreate, db: Session = Depends(get_db)):
    producto = Producto(**data.model_dump())
    db.add(producto)
    db.commit()
    db.refresh(producto)
    return ProductoOut.model_validate(producto)


@router.put("/{id_producto}", response_model=ProductoOut)
def actualizar(id_producto: int, data: ProductoCreate, db: Session = Depends(get_db)):
    p = db.get(Producto, id_producto)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    for k, v in data.model_dump().items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return ProductoOut.model_validate(p)


@router.post("/{id_producto}/imagen", status_code=204)
async def subir_imagen(id_producto: int, imagen: UploadFile = File(...), db: Session = Depends(get_db)):
    p = db.get(Producto, id_producto)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    p.imagen_articulo = await imagen.read()
    db.commit()


@router.delete("/{id_producto}", status_code=204)
def eliminar(id_producto: int, db: Session = Depends(get_db)):
    p = db.get(Producto, id_producto)
    if not p:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    db.delete(p)
    db.commit()
