from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, extract, text
from typing import Optional
from datetime import date, datetime, timedelta

from app.database import get_db
from app.models.venta import Venta
from app.models.detalle_venta import DetalleVenta
from app.models.producto import Producto
from app.models.usuario import Usuario

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _restriccion_usuario(usuario_id: Optional[int], rol: Optional[str], db: Session):
    """Devuelve el id_usuario a filtrar, o None si es Admin (ve todo)."""
    if rol and rol.lower() == "admin":
        return None   # Admin ve todo
    return usuario_id  # Cajero solo ve lo suyo


# ─── KPI principal ────────────────────────────────────────────────────────────
@router.get("/resumen")
def resumen(
    usuario_id: Optional[int] = Query(None),
    rol: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    filtro_usuario = _restriccion_usuario(usuario_id, rol, db)
    hoy = datetime.now()
    yr = year or hoy.year
    mo = month or hoy.month

    q = db.query(Venta).filter(
        extract("year", Venta.fecha_hora) == yr,
        extract("month", Venta.fecha_hora) == mo,
    )
    if filtro_usuario:
        q = q.filter(Venta.id_usuario == filtro_usuario)

    ventas = q.all()
    total_ingresos = float(sum(v.monto_total for v in ventas)) if ventas else 0.0
    num_ventas = len(ventas)
    ticket_promedio = total_ingresos / num_ventas if num_ventas else 0.0

    # Top empleado del mes (solo para admin)
    top_empleado = None
    if not filtro_usuario:
        row = (
            db.query(Usuario.nombre_usuario, func.sum(Venta.monto_total).label("total"))
            .join(Venta, Venta.id_usuario == Usuario.id_usuario)
            .filter(
                extract("year", Venta.fecha_hora) == yr,
                extract("month", Venta.fecha_hora) == mo,
            )
            .group_by(Usuario.id_usuario)
            .order_by(func.sum(Venta.monto_total).desc())
            .first()
        )
        if row:
            top_empleado = {"nombre": row.nombre_usuario, "total": float(row.total)}

    return {
        "año": yr,
        "mes": mo,
        "total_ingresos": total_ingresos,
        "num_ventas": num_ventas,
        "ticket_promedio": ticket_promedio,
        "top_empleado": top_empleado,
    }


# ─── Ventas por periodo (diario del mes elegido) ──────────────────────────────
@router.get("/ventas-por-dia")
def ventas_por_dia(
    usuario_id: Optional[int] = Query(None),
    rol: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    filtro_usuario = _restriccion_usuario(usuario_id, rol, db)
    hoy = datetime.now()
    yr = year or hoy.year
    mo = month or hoy.month

    q = (
        db.query(
            func.day(Venta.fecha_hora).label("dia"),
            func.sum(Venta.monto_total).label("total"),
            func.count(Venta.id_venta).label("ventas"),
        )
        .filter(
            extract("year", Venta.fecha_hora) == yr,
            extract("month", Venta.fecha_hora) == mo,
        )
    )
    if filtro_usuario:
        q = q.filter(Venta.id_usuario == filtro_usuario)

    rows = q.group_by(func.day(Venta.fecha_hora)).order_by(func.day(Venta.fecha_hora)).all()

    return [{"dia": r.dia, "total": float(r.total), "ventas": r.ventas} for r in rows]


# ─── Ventas anuales (mes a mes) ───────────────────────────────────────────────
@router.get("/ventas-por-mes")
def ventas_por_mes(
    usuario_id: Optional[int] = Query(None),
    rol: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    filtro_usuario = _restriccion_usuario(usuario_id, rol, db)
    yr = year or datetime.now().year

    q = (
        db.query(
            extract("month", Venta.fecha_hora).label("mes"),
            func.sum(Venta.monto_total).label("total"),
            func.count(Venta.id_venta).label("ventas"),
        )
        .filter(extract("year", Venta.fecha_hora) == yr)
    )
    if filtro_usuario:
        q = q.filter(Venta.id_usuario == filtro_usuario)

    rows = q.group_by(extract("month", Venta.fecha_hora)).order_by(extract("month", Venta.fecha_hora)).all()

    MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
    return [{"mes": MESES[int(r.mes)-1], "mes_num": int(r.mes), "total": float(r.total), "ventas": r.ventas} for r in rows]


# ─── Top / Bottom 10 productos ────────────────────────────────────────────────
@router.get("/top-productos")
def top_productos(
    usuario_id: Optional[int] = Query(None),
    rol: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    filtro_usuario = _restriccion_usuario(usuario_id, rol, db)
    hoy = datetime.now()
    yr = year or hoy.year
    mo = month or hoy.month

    q = (
        db.query(
            Producto.nombre_producto,
            func.sum(DetalleVenta.cantidad).label("unidades"),
            func.sum(DetalleVenta.subtotal).label("ingreso"),
        )
        .join(DetalleVenta, DetalleVenta.id_producto == Producto.id_producto)
        .join(Venta, Venta.id_venta == DetalleVenta.id_venta)
        .filter(
            extract("year", Venta.fecha_hora) == yr,
            extract("month", Venta.fecha_hora) == mo,
        )
    )
    if filtro_usuario:
        q = q.filter(Venta.id_usuario == filtro_usuario)

    rows = q.group_by(Producto.id_producto).order_by(func.sum(DetalleVenta.cantidad).desc()).all()

    todos = [
        {"nombre": r.nombre_producto, "unidades": int(r.unidades), "ingreso": float(r.ingreso)}
        for r in rows
    ]
    return {"top10": todos[:10], "bottom10": list(reversed(todos[-10:]))}


# ─── Ingresos por empleado ────────────────────────────────────────────────────
@router.get("/por-empleado")
def por_empleado(
    usuario_id: Optional[int] = Query(None),
    rol: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    month: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    filtro_usuario = _restriccion_usuario(usuario_id, rol, db)
    hoy = datetime.now()
    yr = year or hoy.year
    mo = month or hoy.month

    q = (
        db.query(
            Usuario.nombre_usuario,
            func.sum(Venta.monto_total).label("total"),
            func.count(Venta.id_venta).label("ventas"),
        )
        .join(Venta, Venta.id_usuario == Usuario.id_usuario)
        .filter(
            extract("year", Venta.fecha_hora) == yr,
            extract("month", Venta.fecha_hora) == mo,
        )
    )
    if filtro_usuario:
        q = q.filter(Venta.id_usuario == filtro_usuario)

    rows = q.group_by(Usuario.id_usuario).order_by(func.sum(Venta.monto_total).desc()).all()
    return [{"empleado": r.nombre_usuario, "total": float(r.total), "ventas": r.ventas} for r in rows]


# ─── Comparativo año a año ────────────────────────────────────────────────────
@router.get("/anual")
def anual(
    usuario_id: Optional[int] = Query(None),
    rol: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    filtro_usuario = _restriccion_usuario(usuario_id, rol, db)

    q = (
        db.query(
            extract("year", Venta.fecha_hora).label("year"),
            func.sum(Venta.monto_total).label("total"),
            func.count(Venta.id_venta).label("ventas"),
        )
    )
    if filtro_usuario:
        q = q.filter(Venta.id_usuario == filtro_usuario)

    rows = q.group_by(extract("year", Venta.fecha_hora)).order_by(extract("year", Venta.fecha_hora)).all()
    return [{"año": int(r.year), "total": float(r.total), "ventas": r.ventas} for r in rows]
