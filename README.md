# POS_Tiendita_DB

Sistema de Punto de Venta — Proyecto BDA UNAM FI 2026-2

**Integrantes:** Carranza Paula José Carlos · Gutiérrez Contreras Aldo Aarón · Jasso Vazquez Sara

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React Native (Expo) |
| Backend | Python FastAPI |
| Base de datos | MySQL 8.0 |
| Contenedores | Docker Compose |

---

## Estructura del proyecto

```
DBA_PuntoDeVenta/
├── backend/          # FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models/   # Modelos SQLAlchemy (7 tablas)
│   │   ├── schemas/  # Schemas Pydantic
│   │   └── routers/  # Endpoints REST
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   └── POS_Tiendita/ # Expo React Native
├── database/
│   └── schema.sql    # DDL completo MySQL
└── docker-compose.yml
```

---

## Levantar con Docker Compose

```bash
docker-compose up --build
```

- API disponible en: `http://localhost:8000`
- Documentación interactiva: `http://localhost:8000/docs`

---

## Levantar manualmente

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # edita las credenciales
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend/POS_Tiendita
npm install
npx expo start
```

---

## Modelo de datos (7 tablas)

```
Categorias ──< Productos >── Proveedores
                   │
Ventas ──────────< Detalle_Venta
  │
Usuarios    Clientes
```

### Datos no estructurados (BLOB)

| Tabla | Campo | Tipo |
|-------|-------|------|
| Productos | `imagen_articulo` | LONGBLOB (imagen del producto) |
| Ventas | `archivo_factura` | LONGBLOB (PDF/XML de factura) |

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Obtener token JWT |
| GET/POST | `/productos/` | Catálogo de productos |
| POST | `/productos/{id}/imagen` | Subir imagen (BLOB) |
| GET/POST | `/ventas/` | Registrar/consultar ventas |
| POST | `/ventas/{id}/factura` | Subir factura PDF (BLOB) |
| GET/POST | `/clientes/` | Directorio de clientes |
| GET/POST | `/proveedores/` | Proveedores |
| GET/POST | `/categorias/` | Categorías |
| GET/POST | `/usuarios/` | Gestión de usuarios |
