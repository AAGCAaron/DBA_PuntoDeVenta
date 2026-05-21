# Guía de Ejecución del Sistema: POS Tiendita

Esta guía contiene los comandos paso a paso para montar y encender todos los componentes del sistema (Base de Datos, Backend y Frontend).

---

## 1. Encender Base de Datos y Backend (con Docker Compose)

La forma más sencilla de levantar tanto la base de datos (MySQL) como el backend (FastAPI) es utilizando Docker Compose. Ya está configurado para conectarlos entre sí automáticamente.

### Pasos:

1. Abre tu terminal y asegúrate de estar en la raíz del proyecto (`DBA_PuntoDeVenta`).
2. Ejecuta el siguiente comando para construir y levantar los contenedores en segundo plano:

```bash
sudo docker compose up -d --build
```

**¿Qué hace este comando?**
- Descarga y arranca MySQL en el puerto `3306`.
- Ejecuta el script `database/schema.sql` creando la base de datos `pos_tiendita` y sus tablas.
- Construye y arranca el Backend (Python) en el puerto `8000`.

**Para verificar que los contenedores estén corriendo:**
```bash
sudo docker compose ps
```

> **Nota:** Puedes ver la documentación de la API entrando a [http://localhost:8000/docs](http://localhost:8000/docs) desde tu navegador.

---

## 2. Levantar el Frontend (Web)

El proyecto incluye un portal web creado con React y Vite.

### Pasos:

1. En una nueva pestaña o ventana de la terminal, navega a la carpeta del frontend web:
```bash
cd frontend/pos-web
```

2. Instala las dependencias necesarias:
```bash
npm install
```

3. Arranca el servidor de desarrollo:
```bash
npm run dev
```

> **Nota:** La terminal te mostrará una dirección local (por lo general `http://localhost:5173`). Haz clic o ábrela en tu navegador para ver la interfaz.

---

## 3. Levantar la App Móvil (React Native con Expo)

Si deseas probar la versión móvil de la aplicación:

### Pasos:

1. En otra terminal, navega a la carpeta de la aplicación móvil:
```bash
cd frontend/POS_Tiendita
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de Expo:
```bash
npm start
```

> **Nota:** Esto te generará un código QR en la terminal. Puedes instalar la aplicación "Expo Go" en tu celular (iOS/Android), escanear el código y ver la aplicación corriendo directamente en tu dispositivo físico.

---

## (Opcional) Ejecutar el Backend Manualmente sin Docker

Si en algún momento necesitas correr o depurar el backend de forma local sin que esté dentro de un contenedor Docker:

1. Asegúrate de levantar **solamente** la base de datos con Docker:
```bash
docker compose up -d db
```

2. Navega a la carpeta del backend:
```bash
cd backend
```

3. Crea y activa un entorno virtual de Python:
```bash
python -m venv venv
source venv/bin/activate  # En Linux/Mac
# venv\Scripts\activate   # En Windows
```

4. Instala las librerías:
```bash
pip install -r requirements.txt
```

5. Inicia el servidor de FastAPI:
```bash
uvicorn app.main:app --reload
```
