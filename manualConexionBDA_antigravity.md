# Manual de Conexión a la Base de Datos — Project IDX (Antigravity)

**Proyecto:** POS Tiendita  
**Base de datos:** MySQL 8.0 · `pos_tiendita`  
**Materia:** Bases de Datos Avanzadas — UNAM FI, Semestre 2026-2

---

## Contexto importante

Project IDX corre en la **nube de Google**, no en tu máquina local. Esto significa que el IDE no puede ver directamente tu `localhost`. Para conectarlo a tu contenedor Docker necesitas exponer el puerto 3306 con un túnel antes de configurar la extensión.

---

## Requisitos previos

- Docker instalado y corriendo en tu máquina local
- El contenedor `db` levantado (`docker compose up db -d`)
- Proyecto abierto en Project IDX
- `ngrok` instalado localmente (ver Parte 2)

---

## Parte 1 — Levantar la base de datos

Abre una terminal **en tu máquina local** (no la de IDX) y ejecuta:

```bash
# Solo la primera vez, o si quieres reiniciar desde cero
docker compose down -v

# Levanta el contenedor en segundo plano
docker compose up db -d
```

Verifica que esté sano:

```bash
docker compose ps
```

Espera a que el estado sea **`healthy`** antes de continuar. Para ver el log en tiempo real:

```bash
docker compose logs -f db
```

Busca la línea:
```
ready for connections. Version: '8.0.x'  socket: ...  port: 3306
```

---

## Parte 2 — Exponer el puerto con ngrok

Como IDX vive en la nube, necesitas un túnel TCP para que pueda llegar a tu Docker local.

### 2.1 Instalar ngrok

Ve a [ngrok.com](https://ngrok.com), crea una cuenta gratuita y sigue las instrucciones de instalación para tu SO. Luego autentícate:

```bash
ngrok config add-authtoken TU_TOKEN_AQUI
```

### 2.2 Abrir el túnel

En una terminal **local** (déjala abierta mientras trabajas):

```bash
ngrok tcp 3306
```

Verás una salida similar a esta:

```
Forwarding  tcp://0.tcp.sa.ngrok.io:12345 -> localhost:3306
```

Anota el **host** (`0.tcp.sa.ngrok.io`) y el **puerto** (`12345`) — los usarás en el paso siguiente. Estos valores cambian cada vez que reinicias ngrok.

> **Alternativa sin cuenta:** `npx localtunnel --port 3306` (menos estable)

---

## Parte 3 — Instalar SQLTools en Project IDX

### 3.1 Instalar la extensión base

1. Abre Project IDX
2. Ve al panel de extensiones (`Ctrl+Shift+X`)
3. Busca: `SQLTools`
4. Instala la extensión de **Matheus Teixeira** (ícono de base de datos azul)

> IDX usa el registro **Open VSX** en lugar del Marketplace de Microsoft, pero SQLTools está disponible en ambos.

### 3.2 Instalar el driver de MySQL

1. Busca: `SQLTools MySQL`
2. Instala **SQLTools MySQL/MariaDB/TiDB Driver**

---

## Parte 4 — Configurar la conexión

### 4.1 Abrir el asistente de nueva conexión

- Click en el ícono de SQLTools en la barra lateral izquierda (cilindro con rayo)
- Click en **"Add New Connection"**
- Selecciona **MySQL**

### 4.2 Rellenar los datos

Usa los valores que te dio ngrok en el Paso 2.2:

| Campo | Valor |
|-------|-------|
| Connection name | `pos_tiendita_local` |
| Server/Host | `0.tcp.sa.ngrok.io` ← el de tu ngrok |
| Port | `12345` ← el de tu ngrok |
| Database | `pos_tiendita` |
| Username | `pos_user` |
| Password | `pos_password` |
| SSL | Desactivado |

> Cada vez que reinicias ngrok el host y puerto cambian — actualiza la conexión en SQLTools.

### 4.3 Probar y guardar

1. Click en **"Test Connection"** — debe aparecer un mensaje verde de éxito
2. Click en **"Save Connection"**

---

## Parte 5 — Explorar y consultar

### 5.1 Ver las tablas

En el panel de SQLTools expande:

```
pos_tiendita_local
  └── pos_tiendita
        ├── CATEGORIA
        ├── CLIENTE
        ├── DETALLE_VENTA
        ├── PRODUCTO
        ├── PROVEEDOR
        ├── USUARIO
        └── VENTA
```

Click derecho sobre cualquier tabla → **"Select TOP 10"** para ver los datos de inmediato.

### 5.2 Abrir un editor SQL

- `Ctrl+Shift+P` → escribe `SQLTools: New SQL File`
- O click en el ícono de archivo nuevo dentro del panel de SQLTools

Asegúrate de que la conexión activa sea `pos_tiendita_local` (aparece en la barra de estado inferior).

### 5.3 Consultas de verificación

Ejecuta con `Ctrl+Enter`:

```sql
-- Ver todas las tablas
SHOW TABLES;

-- Contenido de cada tabla
SELECT * FROM CATEGORIA;
SELECT * FROM PROVEEDOR;
SELECT * FROM USUARIO;
SELECT * FROM CLIENTE;
SELECT * FROM PRODUCTO;

-- Productos con su categoría y proveedor
SELECT
    p.codigo_barras,
    p.nombre_producto,
    p.precio_venta,
    p.stock,
    c.nombre         AS categoria,
    pr.razon_social  AS proveedor
FROM PRODUCTO p
JOIN CATEGORIA c  ON p.id_categoria = c.id_categoria
JOIN PROVEEDOR pr ON p.id_proveedor  = pr.id_proveedor;
```

---

## Parte 6 — Credenciales de referencia

| Parámetro | Valor |
|-----------|-------|
| Host (local) | `127.0.0.1` |
| Host (desde IDX) | el que te dé ngrok |
| Puerto (local) | `3306` |
| Puerto (desde IDX) | el que te dé ngrok |
| Base de datos | `pos_tiendita` |
| Usuario (app) | `pos_user` |
| Contraseña (app) | `pos_password` |
| Usuario root | `root` |
| Contraseña root | `rootpassword` |

---

## Parte 7 — Acceso por terminal (opcional)

La terminal integrada de IDX también corre en la nube y no llega a `localhost`. Usa la **terminal de tu máquina local** para entrar directamente al contenedor:

```bash
# En tu terminal LOCAL (no la de IDX)
docker exec -it dba_puntodeventa-db-1 mysql -u pos_user -ppos_password pos_tiendita
```

Comandos útiles dentro del cliente:

```sql
SHOW DATABASES;
USE pos_tiendita;
SHOW TABLES;
DESCRIBE PRODUCTO;
EXIT;
```

---

## Solución de problemas comunes

| Síntoma | Causa probable | Solución |
|---------|---------------|----------|
| `Connection refused` | El contenedor no está corriendo | `docker compose up db -d` en tu máquina local |
| `Connection refused` desde IDX | ngrok no está corriendo | Ejecuta `ngrok tcp 3306` y actualiza el host/puerto |
| `Access denied for user` | Credenciales incorrectas | Verifica usuario/contraseña en la tabla de arriba |
| Tablas vacías | Volumen con datos de corrida anterior | `docker compose down -v` y vuelve a subir |
| `Unknown database pos_tiendita` | MySQL aún está inicializando | Espera el estado `healthy` y reintenta |
| SQLTools no detecta el driver | Driver de MySQL no instalado | Instala `SQLTools MySQL/MariaDB/TiDB Driver` |
| Host/puerto de ngrok no funciona | ngrok fue reiniciado | Copia el nuevo host/puerto y actualiza la conexión |

---

*Generado para el proyecto POS Tiendita · Bases de Datos Avanzadas UNAM FI 2026-2*
