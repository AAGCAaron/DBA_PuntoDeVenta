# POS Tiendita — Contexto para Claude Code

Sistema de Punto de Venta para el proyecto de clase BDA (Bases de Datos Avanzadas) UNAM FI 2026-2.

**Integrantes:** Carranza Paula José Carlos · Gutiérrez Contreras Aldo Aarón · Jasso Vazquez Sara

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite — `frontend/pos-web/` |
| Backend | Python FastAPI — `backend/` |
| Base de datos | MySQL 8.0 |
| Contenedores | Docker Compose |

## Levantar el proyecto

```bash
# BD + Backend
docker-compose up --build

# Frontend (en otra terminal)
cd frontend/pos-web && npm install && npm run dev
```

- API: `http://localhost:8000` · Docs: `http://localhost:8000/docs`
- Frontend: `http://localhost:5173`

## Modelo de datos (7 tablas)

```
Categorias ──< Productos >── Proveedores
                   │
Ventas ──────────< Detalle_Venta
  │
Usuarios    Clientes
```

Campos BLOB: `Productos.imagen_articulo` (LONGBLOB), `Ventas.archivo_factura` (LONGBLOB).

## Permisos Docker (ya configurados en .claude/settings.local.json)

`docker compose *`, `npm run *`, `npm install *`, `curl` health-checks.

## Convenciones del proyecto

- Backend: SQLAlchemy models en `backend/app/models/`, Pydantic schemas en `backend/app/schemas/`, endpoints en `backend/app/routers/`.
- Frontend: contexto de autenticación JWT en `frontend/pos-web/src/context/`, llamadas a la API en `frontend/pos-web/src/api/`.
- Base de datos: DDL completo en `database/schema.sql`.
