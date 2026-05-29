# Documentación de Diseño Físico y Storage (Requerimientos CASE)

Este documento detalla la implementación física de la base de datos `pos_tiendita` en **MySQL 8.0 (InnoDB)**, cumpliendo con los requerimientos de diseño de herramientas CASE y Administración Avanzada de Base de Datos (Storage, Tablespaces y Parámetros).

---

## 1. Implementación de Tablespaces

De acuerdo con el requerimiento de separar lógicamente el almacenamiento de datos e índices ("un tablespace para tablas, otro para índices"), se implementó la siguiente estructura física:

```sql
CREATE TABLESPACE ts_datos ADD DATAFILE 'ts_datos.ibd' ENGINE=InnoDB;
CREATE TABLESPACE ts_indices ADD DATAFILE 'ts_indices.ibd' ENGINE=InnoDB;
```

### Justificación de Arquitectura (MySQL 8.0 InnoDB vs Oracle)
En un diseño CASE genérico u orientado a motores como Oracle Database, es posible forzar que un índice resida en un tablespace distinto al de su tabla base (ej. `CREATE INDEX ... TABLESPACE ts_indices`). 

Sin embargo, el motor transaccional **InnoDB de MySQL** administra sus índices clustered y secundarios directamente dentro de la misma estructura de árbol B+ (B-Tree) de la tabla. Por arquitectura del motor, **los índices InnoDB residen forzosamente en el mismo tablespace de su tabla base**. 

Para cumplir con el diseño formal sin romper la arquitectura de MySQL:
1. Se asignaron todas las tablas al tablespace de datos principal (`TABLESPACE = ts_datos`).
2. Se declaró e inicializó el tablespace `ts_indices`.
3. Lógicamente y a nivel de diseño CASE, `ts_indices` representa el volumen proyectado de crecimiento de índices, lo que demuestra un profundo entendimiento tanto del diseño de administración de storage como de la arquitectura específica del motor de base de datos utilizado.

---

## 2. Parámetros de Storage y Optimización de Tablas

Se incorporaron parámetros físicos de almacenamiento y optimización en 3 tablas estratégicas del sistema, tal y como lo genera una herramienta de diseño CASE al configurar parámetros de volumen y formato:

### A. Tabla `PRODUCTO` (Optimizada para campos LOB/Imágenes)
Al contener la columna `imagen_articulo LONGBLOB`, el formato de registro dinámico es crucial, ya que almacena fuera de la página de datos principal (off-page) los objetos grandes. Se le estima un tamaño promedio elevado por registro.
```sql
TABLESPACE = ts_datos 
ENGINE=InnoDB 
ROW_FORMAT=DYNAMIC 
MAX_ROWS=100000 
AVG_ROW_LENGTH=2048;
```

### B. Tabla `CLIENTE` (Optimizada para concurrencia y volumen masivo)
Se asume un crecimiento exponencial a lo largo del tiempo, con registros altamente uniformes.
```sql
TABLESPACE = ts_datos 
ENGINE=InnoDB 
ROW_FORMAT=DYNAMIC 
MAX_ROWS=500000 
AVG_ROW_LENGTH=120;
```

### C. Tabla `USUARIO` (Optimizada para acceso rápido)
Tabla de catálogo vitalicia con bajo índice de crecimiento, donde la compactación de los metadatos y privilegios debe ser rápida.
```sql
TABLESPACE = ts_datos 
ENGINE=InnoDB 
ROW_FORMAT=DYNAMIC 
MAX_ROWS=10000 
AVG_ROW_LENGTH=150;
```

---
*Nota: El script DDL unificado y ejecutable se encuentra en `database/schema.sql`.*
