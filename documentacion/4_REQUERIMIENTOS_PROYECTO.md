# Requerimientos del Proyecto: POS Tiendita DB
**Materia:** Bases de Datos Avanzadas (UNAM FI 2026-2)  
**Profesora:** M.A.T. Gabriela Betzabé Lizárraga Ramírez  
**Equipo:** Carranza Paula Jose Carlos, Gutiérrez Contreras Aldo Aaron, Jasso Vázquez Sara, Hanny Carballo Ramírez

---

## 1. Requerimientos de la Base de Datos (Necesidades del Negocio)
El sistema de punto de venta requiere una BD centralizada y eficiente para el flujo comercial:
* **Gestión de Catálogo e Inventario:** Registro de artículos (código, precio, existencias), agrupados por categorías y vinculados a sus proveedores.
* **Control de Accesos y Auditoría:** Registro de empleados (cajeros/administradores) para auditar cada transacción.
* **Seguimiento de Clientes:** Almacenamiento de contacto de clientes frecuentes para facturación y lealtad.
* **Procesamiento de Transacciones:** Captura del encabezado de venta (fecha, monto, empleado, cliente) y su detalle preciso (artículos, cantidad, precio).
* **Manejo de Datos No Estructurados (Multimedia):** Almacenamiento de imágenes de productos (pantalla del cajero) y comprobantes/facturas (PDF/XML) integrados en la base de datos.

---

## 2. Modelo de Datos y Estructura de Tablas
El esquema relacional fuerte está compuesto por 7 tablas principales:

### Entidades de Catálogo (Fuertes)
* **`categorias`**: `id_categoria` (PK), `nombre`, `descripcion`.
* **`proveedores`**: `id_proveedor` (PK), `razon_social`, `rfc` (UNIQUE), `telefono_contacto`.
* **`usuarios`**: `id_usuario` (PK), `nombre_usuario` (UNIQUE), `rol`, `password_hash`.
* **`clientes`**: `id_cliente` (PK), `nombre_completo`, `rfc`, `correo_electronico`.
* **`productos`**: `id_producto` (PK), `codigo_barras` (UNIQUE), `nombre_producto`, `precio_venta`, `stock`, `id_categoria` (FK), `id_proveedor` (FK), `imagen_articulo` (BLOB).

### Entidades Transaccionales
* **`ventas`**: `id_venta` (PK), `fecha_hora`, `monto_total`, `id_usuario` (FK), `id_cliente` (FK), `archivo_factura` (BLOB).
* **`detalle_venta`**: `id_venta` (PK, FK), `id_producto` (PK, FK), `cantidad`, `precio_unitario`, `subtotal`. *(Tabla de rompimiento/débil).*

---

## 3. Integración y Modelado de Datos Multimedia
Se requiere el soporte de objetos binarios de gran tamaño (BLOB / BYTEA) combinados con datos tradicionales:
* **Productos:** Almacenamiento de un `[Objeto Binario Bloqueado]` (ej. PNG de 45 KB) en la columna `imagen_articulo`.
* **Ventas:** Almacenamiento de un `[Objeto Binario Documento]` (ej. PDF Fiscal de 120 KB) en la columna `archivo_factura`.

---

## 4. Tabla Comparativa: VARCHAR (Ruta) vs BLOB (Almacenamiento Directo)

| Criterio Técnico | Enfoque VARCHAR (Ruta del Archivo) | Enfoque BLOB / BYTEA (Almacenar en BD) |
| :--- | :--- | :--- |
| **Definición** | Se guarda una cadena de texto con la ubicación física en disco (ej. `/images/leche.png`). | El archivo se inyecta directamente dentro de la celda mediante flujos de bytes. |
| **Tamaño de BD** | Muy ligero. Crecimiento controlado. | Muy pesado. Crece exponencialmente, afectando caché del motor. |
| **Rendimiento** | Rápido (al no cargar objetos pesados en memoria). | Lento en consultas masivas (un `SELECT *` extrae todos los binarios). |
| **Backups** | Complejo. Requiere respaldar la BD y la carpeta de archivos en sincronía. | Sencillo e Integrado. Un solo respaldo de BD salva datos y archivos simultáneamente. |
| **Integridad** | Baja. Riesgo de rutas rotas (Error 404) si se borra el archivo físicamente. | Máxima. El archivo multimedia sigue el ciclo de vida transaccional del registro (ACID). |

### Conclusión del Proyecto
Se implementará un modelo enfocado en **BLOB** para imágenes optimizadas (iconos ligeros < 50KB) para garantizar una interfaz robusta sin rutas rotas, manteniendo el almacenamiento transaccional seguro y altamente íntegro.
