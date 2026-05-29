# 🚀 1. Guía de Arranque: POS Tiendita

Guía paso a paso para levantar el sistema completo localmente:
**Base de Datos + Backend (Docker) + Frontend Web (React)**.

> **Requisitos previos:** Docker instalado con permisos `sudo`, y Node.js ≥ 18.

---

## Paso 1 — Levantar la Base de Datos y el Backend (con Docker)

Abre tu terminal y entra a la carpeta principal del proyecto:

```bash
cd /home/agc_aaron/DBA_PuntoDeVenta
```

Ejecuta el siguiente comando para construir y arrancar los contenedores en segundo plano:

```bash
sudo docker compose up -d --build
```

Este comando hará dos cosas automáticamente:
1. Arrancar **MySQL** en el puerto `3306` (ejecutando `database/schema.sql`).
2. Arrancar el **Backend (FastAPI)** en el puerto `8000`.

> ✅ **Nota:** Espera unos 15-30 segundos la primera vez para que MySQL inicialice las tablas correctamente.

---

## Paso 2 — Levantar el Frontend Web (React + Vite)

Abre una **nueva terminal** y navega a la carpeta del frontend:

```bash
cd /home/agc_aaron/DBA_PuntoDeVenta/frontend/pos-web
```

Instala las dependencias (solo si es tu primera vez o si hubo cambios):

```bash
npm install
```

Arranca el servidor web:

```bash
npm run dev
```

Abre tu navegador en:
**[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Credenciales de prueba principales

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin_carlos` | `hash_falso_123` | Admin 🔑 |
| `cajero_juan` | `hash_falso_456` | Cajero |

> *Puedes gestionar y ver al resto de usuarios desde la pestaña "Usuarios" ingresando como administrador.*

---

## 🔄 ¿Hiciste cambios en el código de Python?

Si modificaste algo en la carpeta `backend/`, dile a Docker que lo vuelva a compilar con:

```bash
sudo docker compose up -d --build backend
```

---

## 🗑️ Borrar toda la Base de Datos (Empezar de cero)

Si necesitas eliminar absolutamente todas las ventas, clientes y productos creados para que el sistema regrese a su estado original de fábrica (solo con los datos semilla o vacía), debes apagar el sistema y **borrar los volúmenes** de Docker.

En la terminal principal ejecuta:

```bash
sudo docker compose down -v
```

> ⚠️ **Atención:** La bandera `-v` (volumes) es la que destruye la base de datos de MySQL de forma permanente.
> Para volver a arrancar de cero, simplemente vuelve a ejecutar el comando del **Paso 1** (`sudo docker compose up -d --build`).

---

## 🛑 Apagar todo el sistema

Cuando termines tu presentación o desarrollo:

```bash
# 1. En la terminal del frontend, presiona Ctrl+C
# 2. En la terminal principal, apaga los contenedores:
sudo docker compose down
```

---
*POS Tiendita · Bases de Datos Avanzadas · UNAM FI 2026-2*
