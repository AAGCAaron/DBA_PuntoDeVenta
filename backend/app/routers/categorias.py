from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCreate, CategoriaOut

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.get("/", response_model=List[CategoriaOut])
def listar(db: Session = Depends(get_db)):
    return db.query(Categoria).all()


@router.get("/{id_categoria}", response_model=CategoriaOut)
def obtener(id_categoria: int, db: Session = Depends(get_db)):
    cat = db.get(Categoria, id_categoria)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return cat


@router.post("/", response_model=CategoriaOut, status_code=201)
def crear(data: CategoriaCreate, db: Session = Depends(get_db)):
    cat = Categoria(**data.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.put("/{id_categoria}", response_model=CategoriaOut)
def actualizar(id_categoria: int, data: CategoriaCreate, db: Session = Depends(get_db)):
    cat = db.get(Categoria, id_categoria)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    for k, v in data.model_dump().items():
        setattr(cat, k, v)
    db.commit()
    db.refresh(cat)
    return cat


@router.delete("/{id_categoria}", status_code=204)
def eliminar(id_categoria: int, db: Session = Depends(get_db)):
    cat = db.get(Categoria, id_categoria)
    if not cat:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    db.delete(cat)
    db.commit()
