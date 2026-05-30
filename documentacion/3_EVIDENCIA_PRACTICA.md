# 📝 7. Evidencia Práctica (Script y Comandos)

Este documento contiene la teoría y la evidencia práctica solicitada para la entrega del proyecto sobre la base de datos `pos_tiendita`.

> **Nota:** Todos los comandos están listos para ser ejecutados en el motor de base de datos y se han anexado en el nuevo script ubicado en: `/database/evidencia_practica.sql`.

---

## 🚀 ¿Cómo ejecutar este script de evidencia?

Dado que nuestra base de datos corre dentro de un contenedor Docker, para ejecutar todo el script de evidencia de golpe y aplicar los cambios, solo necesitas abrir tu terminal principal y correr este comando:

```bash
sudo docker compose exec -T db mysql -t -v -u root -prootpassword pos_tiendita < database/evidencia_practica.sql
```

**¿Qué es lo que hace exactamente este script cuando lo ejecutas?**
1. Intenta crear un índice Bitmap sobre los roles de usuario (para hacer búsquedas por rol más veloces).
2. Crea una tabla nueva llamada `USUARIO_PARTICIONADO`, dividiendo físicamente el espacio del disco duro dependiendo del rol de la persona.
3. Clona tu tabla actual de productos y crea `PRODUCTO_RESPALDO` (con todos tus productos intactos).
4. Clona tu tabla de productos y crea `PRODUCTO_HISTORICO` (completamente vacía, solo la estructura).

*(Es totalmente seguro ejecutarlo, no borrará ni afectará tu información actual, solo creará las nuevas estructuras de evidencia).*

---

## 1. Índice Bitmap (Bitmap Index)

**Teoría:** 
Los índices tipo Bitmap (mapa de bits) son estructuras de datos altamente eficientes diseñadas específicamente para **columnas de baja cardinalidad**, es decir, columnas que tienen un conjunto muy limitado de valores distintos (por ejemplo: género, estado civil, o en nuestro caso, el **Rol** de un usuario). Utilizan arreglos de bits para realizar búsquedas mediante operaciones lógicas súper rápidas (AND, OR, NOT).

**Práctica (Aplicado en el Proyecto):**
En nuestro esquema, la tabla ideal para un índice Bitmap es `USUARIO`, específicamente en la columna `rol`, ya que actualmente solo manejamos un conjunto cerrado de valores (`'Admin'`, `'Cajero'`, `'Inactivo'`).

```sql
-- Evidencia: Sintaxis para crear un Índice Bitmap sobre la columna 'rol'
CREATE BITMAP INDEX idx_bitmap_rol ON USUARIO (rol);
```
*(Nota técnica: Aunque el estándar SQL y motores como Oracle lo implementan nativamente, en MySQL puro esta instrucción puede ser asimilada como un índice B-Tree convencional. Sin embargo, conceptualmente y de forma académica cumple el propósito sobre la columna correcta).*

---

## 2. Particionamiento por Lista (List Partitioning)

**Teoría:**
El particionamiento por lista nos permite dividir físicamente una tabla en múltiples segmentos de almacenamiento dependiendo de si el valor de una columna coincide con una lista discreta de valores que nosotros especificamos. Es muy útil para hacer consultas más rápidas y administrar datos segmentados geográficamente o por estados (ej. Ventas Completadas vs Canceladas).

**Práctica (Aplicado en el Proyecto):**
Vamos a particionar una tabla de usuarios basándonos en su Rol. De esta forma, el motor guardará físicamente a los Administradores en una partición, a los Cajeros en otra, y a los Inactivos en una tercera. *(MySQL exige que la columna particionada sea parte de la Llave Primaria, por lo que redefinimos la tabla así)*:

```sql
-- Evidencia: Particionamiento por lista usando 'rol'
CREATE TABLE USUARIO_PARTICIONADO (
    id_usuario INT,
    nombre_usuario VARCHAR(50),
    rol VARCHAR(20),
    PRIMARY KEY (id_usuario, rol)
)
PARTITION BY LIST COLUMNS(rol) (
    PARTITION p_administradores VALUES IN ('Admin', 'admin'),
    PARTITION p_cajeros VALUES IN ('Cajero', 'cajero'),
    PARTITION p_inactivos VALUES IN ('Inactivo', 'inactivo')
);
```

---

## 3. Copia de una tabla (Con y Sin Datos)

**Teoría:**
En el ambiente de bases de datos, constantemente necesitamos crear respaldos inmediatos (copias con datos) antes de alterar tablas sensibles, o crear tablas con la misma estructura pero en blanco (copias sin datos) para fungir como históricos o repositorios de logs.

**Práctica (Aplicado en el Proyecto):**

### A) Copia CON Datos
Supongamos que necesitamos hacer una actualización masiva de precios en los `PRODUCTOS`. Antes de hacerlo, hacemos una copia rápida de seguridad con todos los datos existentes:

```sql
-- Evidencia: Crear una copia exacta de la tabla PRODUCTO con todos sus registros
CREATE TABLE PRODUCTO_RESPALDO AS 
SELECT * FROM PRODUCTO;
```

### B) Copia SIN Datos
Si queremos crear una nueva tabla que sirva de historial muerto (`PRODUCTO_HISTORICO`), podemos clonar la estructura de la tabla original de forma instantánea, manteniéndola totalmente vacía:

```sql
-- Evidencia: Crear una copia del esquema sin migrar ningún registro
CREATE TABLE PRODUCTO_HISTORICO LIKE PRODUCTO;
```

---
*POS Tiendita · Bases de Datos Avanzadas · UNAM FI 2026-2*
