-- =========================================================================
-- CONSULTAS DE EVIDENCIA: Historial de Ventas y Verificación de BLOBs
-- POS Tiendita - Bases de Datos Avanzadas UNAM FI
-- =========================================================================

SELECT '=========================================================================' AS '';
SELECT ' PASO 1: VERIFICAR QUE LA BASE DE DATOS ESTÁ VACÍA ANTES DE LA PRUEBA' AS '';
SELECT '=========================================================================' AS '';

SELECT 'Conteo de Archivos Multimedia (Debe ser 0 antes de tu prueba):' AS '';
SELECT COUNT(*) AS Total_Archivos_Multimedia FROM EVIDENCIA_MULTIMEDIA;

SELECT 'Conteo de Facturas y Ventas (Debe ser 0 antes de tu prueba):' AS '';
SELECT COUNT(*) AS Total_Ventas FROM VENTA;

SELECT '' AS '';
SELECT '=========================================================================' AS '';
SELECT ' PASO 2: DETALLES DE LOS DATOS (Para verificar DESPUÉS de tu carga)' AS '';
SELECT '=========================================================================' AS '';

SELECT '--- 1. HISTORIAL DE VENTAS (Query Principal) ---' AS '';
SELECT 
    v.id_venta, 
    v.fecha_hora, 
    c.nombre_completo AS Cliente, 
    u.nombre_usuario AS Cajero, 
    v.monto_total 
FROM VENTA v
LEFT JOIN CLIENTE c ON v.id_cliente = c.id_cliente
LEFT JOIN USUARIO u ON v.id_usuario = u.id_usuario
ORDER BY v.fecha_hora DESC;


SELECT '--- 2. DETALLE DE VENTAS (Items vendidos) ---' AS '';
SELECT 
    v.id_venta,
    p.nombre_producto,
    d.cantidad,
    d.precio_unitario,
    d.subtotal
FROM DETALLE_VENTA d
JOIN VENTA v ON d.id_venta = v.id_venta
JOIN PRODUCTO p ON d.id_producto = p.id_producto;


-- -------------------------------------------------------------------------
-- ENFOCADO EN LOS BLOBS (Multimedia y Facturas)
-- Nota: En la consola SQL comprobamos los BLOBs usando LENGTH() para ver 
-- su peso en bytes y confirmar que están incrustados en el disco.
-- -------------------------------------------------------------------------

SELECT '--- 3. ARCHIVOS MULTIMEDIA DUALES (Requisito de la Profesora) ---' AS '';
SELECT 
    id_archivo,
    nombre_archivo,
    tipo_mime,
    ruta_archivo AS 'VARCHAR_Ruta_Fisica',
    IF(archivo_blob IS NOT NULL, 'Binario_OK', 'Vacio') AS 'LONGBLOB_Base_Datos',
    LENGTH(archivo_blob) AS 'Peso_En_Bytes'
FROM EVIDENCIA_MULTIMEDIA;


SELECT '--- 4. FACTURAS XML/PDF DE LAS VENTAS (LONGBLOB) ---' AS '';
SELECT 
    id_venta, 
    monto_total, 
    IF(archivo_factura IS NOT NULL, 'Factura_Guardada', 'Sin_Factura') AS Estatus_Factura,
    LENGTH(archivo_factura) AS Tamano_Bytes
FROM VENTA;


SELECT '--- 5. PRODUCTOS CON IMÁGENES (LONGBLOB) ---' AS '';
SELECT 
    id_producto, 
    nombre_producto, 
    stock,
    IF(imagen_articulo IS NOT NULL, 'Imagen_Guardada', 'Sin_Imagen') AS Estado_Imagen,
    LENGTH(imagen_articulo) AS Tamano_Bytes
FROM PRODUCTO;

SELECT '--- 6. GESTIÓN DE USUARIOS Y ROLES (Panel de Administración) ---' AS '';
SELECT 
    id_usuario,
    nombre_usuario,
    rol AS 'Nivel_de_Acceso',
    IF(password_hash IS NOT NULL AND password_hash != '', 'Encriptado (OK)', 'Sin Seguridad') AS Estado_Password
FROM USUARIO
ORDER BY rol ASC, id_usuario ASC;
