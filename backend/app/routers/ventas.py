from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Response
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.venta import Venta
from app.models.detalle_venta import DetalleVenta
from app.models.producto import Producto
from app.models.usuario import Usuario
from app.models.cliente import Cliente
from app.schemas.venta import VentaCreate, VentaOut
from app.utils.factura import generar_xml, generar_pdf

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


# ─── Descarga XML (stored BLOB) ────────────────────────────────────────────────
@router.get("/{id_venta}/factura.xml")
def descargar_xml(id_venta: int, db: Session = Depends(get_db)):
    v = db.get(Venta, id_venta)
    if not v or not v.archivo_factura:
        raise HTTPException(status_code=404, detail="Factura no encontrada")
    return Response(
        content=v.archivo_factura,
        media_type="application/xml",
        headers={"Content-Disposition": f"inline; filename=factura_{id_venta:06d}.xml"},
    )


# ─── Descarga PDF (generated on-the-fly from sale data) ───────────────────────
@router.get("/{id_venta}/factura.pdf")
def descargar_pdf(id_venta: int, db: Session = Depends(get_db)):
    v = db.get(Venta, id_venta)
    if not v:
        raise HTTPException(status_code=404, detail="Venta no encontrada")

    detalles_raw = db.query(DetalleVenta).filter(DetalleVenta.id_venta == id_venta).all()
    detalles = []
    for d in detalles_raw:
        p = db.get(Producto, d.id_producto)
        detalles.append({
            "nombre_producto": p.nombre_producto if p else f"Producto #{d.id_producto}",
            "cantidad": d.cantidad,
            "precio_unitario": d.precio_unitario,
            "subtotal": d.subtotal,
        })

    usuario = db.get(Usuario, v.id_usuario)
    cliente = db.get(Cliente, v.id_cliente) if v.id_cliente else None

    pdf_bytes = generar_pdf(
        venta_id=v.id_venta,
        fecha_hora=v.fecha_hora,
        monto_total=float(v.monto_total),
        detalles=detalles,
        nombre_usuario=usuario.nombre_usuario if usuario else "N/A",
        nombre_cliente=cliente.nombre_completo if cliente else "Público General",
    )
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"inline; filename=factura_{id_venta:06d}.pdf"},
    )


# ─── Keep the old /factura endpoint pointing to PDF for backwards compat ──────
@router.get("/{id_venta}/factura")
def obtener_factura_legacy(id_venta: int, db: Session = Depends(get_db)):
    return descargar_pdf(id_venta, db)


# ─── Crear Venta (auto-genera XML y lo guarda en archivo_factura) ─────────────
@router.post("/", response_model=VentaOut, status_code=201)
def crear(data: VentaCreate, db: Session = Depends(get_db)):
    total = sum(d.cantidad * d.precio_unitario for d in data.detalle)

    venta = Venta(
        id_usuario=data.id_usuario,
        id_cliente=data.id_cliente,
        monto_total=total,
    )
    db.add(venta)
    db.flush()  # get venta.id_venta before commit

    detalles_info = []
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
        detalles_info.append({
            "nombre_producto": producto.nombre_producto,
            "cantidad": d.cantidad,
            "precio_unitario": d.precio_unitario,
            "subtotal": d.cantidad * d.precio_unitario,
        })

    # Auto-generar y guardar XML como archivo_factura en el BLOB
    usuario = db.get(Usuario, data.id_usuario)
    cliente = db.get(Cliente, data.id_cliente) if data.id_cliente else None
    xml_bytes = generar_xml(
        venta_id=venta.id_venta,
        fecha_hora=venta.fecha_hora,
        monto_total=float(total),
        detalles=detalles_info,
        nombre_usuario=usuario.nombre_usuario if usuario else "N/A",
        nombre_cliente=cliente.nombre_completo if cliente else "Público General",
    )
    venta.archivo_factura = xml_bytes

    db.commit()
    db.refresh(venta)
    out = VentaOut.model_validate(venta)
    out.tiene_factura = True
    return out


@router.post("/{id_venta}/factura", status_code=204)
async def subir_factura(id_venta: int, factura: UploadFile = File(...), db: Session = Depends(get_db)):
    v = db.get(Venta, id_venta)
    if not v:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    v.archivo_factura = await factura.read()
    db.commit()


@router.delete("/{id_venta}", status_code=204)
def eliminar(id_venta: int, db: Session = Depends(get_db)):
    v = db.get(Venta, id_venta)
    if not v:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    
    # Return stock and delete details
    detalles = db.query(DetalleVenta).filter(DetalleVenta.id_venta == id_venta).all()
    for d in detalles:
        producto = db.get(Producto, d.id_producto)
        if producto:
            producto.stock += d.cantidad
        db.delete(d)
        
    db.delete(v)
    db.commit()
