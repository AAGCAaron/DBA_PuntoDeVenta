from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.proveedor import Proveedor
from app.schemas.proveedor import ProveedorCreate, ProveedorOut

router = APIRouter(prefix="/proveedores", tags=["Proveedores"])


@router.get("/", response_model=List[ProveedorOut])
def listar(db: Session = Depends(get_db)):
    return db.query(Proveedor).all()


@router.get("/{id_proveedor}", response_model=ProveedorOut)
def obtener(id_proveedor: int, db: Session = Depends(get_db)):
    prov = db.get(Proveedor, id_proveedor)
    if not prov:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return prov


@router.post("/", response_model=ProveedorOut, status_code=201)
def crear(data: ProveedorCreate, db: Session = Depends(get_db)):
    prov = Proveedor(**data.model_dump())
    db.add(prov)
    db.commit()
    db.refresh(prov)
    return prov


@router.put("/{id_proveedor}", response_model=ProveedorOut)
def actualizar(id_proveedor: int, data: ProveedorCreate, db: Session = Depends(get_db)):
    prov = db.get(Proveedor, id_proveedor)
    if not prov:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    for k, v in data.model_dump().items():
        setattr(prov, k, v)
    db.commit()
    db.refresh(prov)
    return prov


@router.delete("/{id_proveedor}", status_code=204)
def eliminar(id_proveedor: int, db: Session = Depends(get_db)):
    prov = db.get(Proveedor, id_proveedor)
    if not prov:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    db.delete(prov)
    db.commit()
