from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
import app.models  # register all models with Base

from app.routers import (
    categorias,
    proveedores,
    clientes,
    usuarios,
    productos,
    ventas,
    auth,
    dashboard,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="POS Tiendita API",
    description="Backend para el sistema de Punto de Venta — BDA UNAM FI 2026-2",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in [
    auth.router,
    categorias.router,
    proveedores.router,
    clientes.router,
    usuarios.router,
    productos.router,
    ventas.router,
    dashboard.router,
]:
    app.include_router(router)


@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "app": "POS Tiendita"}
