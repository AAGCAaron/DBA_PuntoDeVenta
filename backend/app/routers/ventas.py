from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.venta import Venta
from app.models.detalle_venta import DetalleVenta
from app.models.producto import Producto
from app.schemas.venta import VentaCreate, VentaOut

router = APIRouter(prefix="/ventas", tags=["Ventas"])


@router.get("/", response_model=List[VentaOut])
def listar(db: Session = Depends(get_db)):
    ventas = db.query(Venta).all()
    result = []
    for v in ventas:
        out = VentaOut.model_validate(v)
        out.tiene_factura = v.archivo_factura is not None
        result.append(out)
    return result


@router.get("/{id_venta}", response_model=VentaOut)
def obtener(id_venta: int, db: Session = Depends(get_db)):
    v = db.get(Venta, id_venta)
    if not v:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    out = VentaOut.model_validate(v)
    out.tiene_factura = v.archivo_factura is not None
    return out


@router.get("/{id_venta}/factura")
def obtener_factura(id_venta: int, db: Session = Depends(get_db)):
    v = db.get(Venta, id_venta)
    if not v or not v.archivo_factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return Response(content=v.archivo_factura, media_type="application/pdf")


@router.post("/", response_model=VentaOut, status_code=201)
def crear(data: VentaCreate, db: Session = Depends(get_db)):
    total = sum(d.cantidad * d.precio_unitario for d in data.detalle)

    venta = Venta(
        id_usuario=data.id_usuario,
        id_cliente=data.id_cliente,
        monto_total=total,
    )
    db.add(venta)
    db.flush()

    for d in data.detalle:
        producto = db.get(Producto, d.id_producto)
        if not producto:
            raise HTTPException(status_code=404, detail=f"Producto {d.id_producto} no encontrado")
        if producto.stock < d.cantidad:
            raise HTTPException(status_code=400, detail=f"Stock insuficiente para {producto.nombre_producto}")
        producto.stock -= d.cantidad
        detalle = DetalleVenta(
            id_venta=venta.id_venta,
            id_producto=d.id_producto,
            cantidad=d.cantidad,
            precio_unitario=d.precio_unitario,
            subtotal=d.cantidad * d.precio_unitario,
        )
        db.add(detalle)

    db.commit()
    db.refresh(venta)
    return VentaOut.model_validate(venta)


@router.post("/{id_venta}/factura", status_code=204)
async def subir_factura(id_venta: int, factura: UploadFile = File(...), db: Session = Depends(get_db)):
    v = db.get(Venta, id_venta)
    if not v:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    v.archivo_factura = await factura.read()
    db.commit()
