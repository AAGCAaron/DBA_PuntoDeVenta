from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from passlib.context import CryptContext

from app.database import get_db
from app.models.usuario import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioOut

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/", response_model=List[UsuarioOut])
def listar(db: Session = Depends(get_db)):
    return db.query(Usuario).all()


@router.get("/{id_usuario}", response_model=UsuarioOut)
def obtener(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.get(Usuario, id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


@router.post("/", response_model=UsuarioOut, status_code=201)
def crear(data: UsuarioCreate, db: Session = Depends(get_db)):
    hashed = pwd_ctx.hash(data.password)
    usuario = Usuario(
        nombre_usuario=data.nombre_usuario,
        rol=data.rol,
        password_hash=hashed,
    )
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario


@router.delete("/{id_usuario}", status_code=204)
def eliminar(id_usuario: int, db: Session = Depends(get_db)):
    usuario = db.get(Usuario, id_usuario)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()
