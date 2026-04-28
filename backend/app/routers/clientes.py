from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteOut

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("/", response_model=List[ClienteOut])
def listar(db: Session = Depends(get_db)):
    return db.query(Cliente).all()


@router.get("/{id_cliente}", response_model=ClienteOut)
def obtener(id_cliente: int, db: Session = Depends(get_db)):
    cliente = db.get(Cliente, id_cliente)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


@router.post("/", response_model=ClienteOut, status_code=201)
def crear(data: ClienteCreate, db: Session = Depends(get_db)):
    cliente = Cliente(**data.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)
    return cliente


@router.put("/{id_cliente}", response_model=ClienteOut)
def actualizar(id_cliente: int, data: ClienteCreate, db: Session = Depends(get_db)):
    cliente = db.get(Cliente, id_cliente)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    for k, v in data.model_dump().items():
        setattr(cliente, k, v)
    db.commit()
    db.refresh(cliente)
    return cliente


@router.delete("/{id_cliente}", status_code=204)
def eliminar(id_cliente: int, db: Session = Depends(get_db)):
    cliente = db.get(Cliente, id_cliente)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    db.delete(cliente)
    db.commit()
