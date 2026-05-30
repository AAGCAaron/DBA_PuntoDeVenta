-- =========================================================================
-- EVIDENCIA PRÁCTICA: Índices Bitmap, Particionamiento y Copiado de Tablas
-- POS Tiendita - Bases de Datos Avanzadas UNAM FI
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. ÍNDICE BITMAP
-- -------------------------------------------------------------------------
-- Teóricamente, los índices Bitmap se utilizan en columnas de baja cardinalidad
-- (pocos valores distintos). En nuestro caso, la columna `rol` de la tabla USUARIO
-- es el candidato perfecto (solo tiene 'Admin', 'Cajero', 'Inactivo').
--
-- *Nota: Aunque MySQL asimilará esta instrucción como un índice regular (B-Tree)
-- SQL estándar exigida académicamente (CREATE BITMAP INDEX). Sin embargo, 
-- para que el script corra en MySQL sin errores de sintaxis, usamos CREATE INDEX:

-- Limpieza preventiva
-- (Eliminado el DROP INDEX porque MySQL no soporta IF EXISTS para índices, 
-- pero como iniciarás de cero, no habrá problema).

CREATE INDEX idx_bitmap_rol ON USUARIO (rol);


-- -------------------------------------------------------------------------
-- 2. PARTICIONAMIENTO POR LISTA
-- -------------------------------------------------------------------------
-- Particionaremos una tabla de Usuarios basándonos en la columna 'rol'.
-- (Creamos una tabla demostrativa ya que MySQL requiere que la llave primaria 
-- incluya la columna de partición).

-- Limpieza preventiva
DROP TABLE IF EXISTS USUARIO_PARTICIONADO;

CREATE TABLE USUARIO_PARTICIONADO (
    id_usuario INT,
    nombre_usuario VARCHAR(50),
    rol VARCHAR(20),
    PRIMARY KEY (id_usuario, rol)
)
PARTITION BY LIST COLUMNS(rol) (
    PARTITION p_administradores VALUES IN ('Admin'),
    PARTITION p_cajeros VALUES IN ('Cajero'),
    PARTITION p_inactivos VALUES IN ('Inactivo')
);


-- -------------------------------------------------------------------------
-- 3. COPIA DE UNA TABLA (CON DATOS Y SIN DATOS)
-- -------------------------------------------------------------------------

-- Limpieza preventiva
DROP TABLE IF EXISTS PRODUCTO_RESPALDO;
DROP TABLE IF EXISTS PRODUCTO_HISTORICO;

-- A) Copia CON datos (Clonación de estructura y registros actuales)
-- Útil para hacer un respaldo rápido de los productos antes de una actualización masiva.
CREATE TABLE PRODUCTO_RESPALDO AS 
SELECT * FROM PRODUCTO;

-- B) Copia SIN datos (Solo se copia la estructura/esquema original)
-- Útil para crear tablas históricas que empezarán totalmente vacías.
CREATE TABLE PRODUCTO_HISTORICO LIKE PRODUCTO;

-- =========================================================================
-- CONSULTAS DE VERIFICACIÓN (SELECTs para comprobar que todo funcionó)
-- =========================================================================

-- Verificación 1: Comprobar que el índice sobre 'rol' existe en la tabla USUARIO
SHOW INDEX FROM USUARIO WHERE Key_name = 'idx_bitmap_rol';

-- Verificación 2: Comprobar las particiones creadas en la tabla USUARIO_PARTICIONADO
SELECT TABLE_NAME, PARTITION_NAME, PARTITION_METHOD, PARTITION_EXPRESSION, PARTITION_DESCRIPTION 
FROM information_schema.PARTITIONS 
WHERE TABLE_NAME = 'USUARIO_PARTICIONADO';

-- Verificación 3: Comprobar la copia CON datos (Debe regresar el número total de productos)
SELECT 'PRODUCTO_RESPALDO' AS Tabla, COUNT(*) AS Total_Registros FROM PRODUCTO_RESPALDO;

-- Verificación 4: Comprobar la copia SIN datos (Debe regresar 0)
SELECT 'PRODUCTO_HISTORICO' AS Tabla, COUNT(*) AS Total_Registros FROM PRODUCTO_HISTORICO;
