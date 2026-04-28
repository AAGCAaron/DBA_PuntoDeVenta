-- POS_Tiendita_DB - Schema
-- Bases de Datos Avanzadas, UNAM FI, Semestre 2026-2
-- Carranza Paula José Carlos | Gutiérrez Contreras Aldo Aarón | Jasso Vazquez Sara

CREATE DATABASE IF NOT EXISTS pos_tiendita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_tiendita;

CREATE TABLE Categorias (
    id_categoria   INT AUTO_INCREMENT PRIMARY KEY,
    nombre         VARCHAR(100) NOT NULL,
    descripcion    TEXT
);

CREATE TABLE Proveedores (
    id_proveedor      INT AUTO_INCREMENT PRIMARY KEY,
    razon_social      VARCHAR(200) NOT NULL,
    rfc               VARCHAR(13)  NOT NULL UNIQUE,
    telefono_contacto VARCHAR(20)
);

CREATE TABLE Clientes (
    id_cliente          INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo     VARCHAR(200) NOT NULL,
    rfc                 VARCHAR(13),
    correo_electronico  VARCHAR(150)
);

CREATE TABLE Usuarios (
    id_usuario     INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL UNIQUE,
    rol            ENUM('Admin', 'Cajero') NOT NULL DEFAULT 'Cajero',
    password_hash  VARCHAR(255) NOT NULL
);

CREATE TABLE Productos (
    id_producto      INT AUTO_INCREMENT PRIMARY KEY,
    codigo_barras    VARCHAR(50)    NOT NULL UNIQUE,
    nombre_producto  VARCHAR(200)   NOT NULL,
    precio_venta     DECIMAL(10,2)  NOT NULL,
    stock            INT            NOT NULL DEFAULT 0,
    id_categoria     INT,
    id_proveedor     INT,
    imagen_articulo  LONGBLOB,
    CONSTRAINT fk_prod_categoria FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria) ON DELETE SET NULL,
    CONSTRAINT fk_prod_proveedor FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor) ON DELETE SET NULL
);

CREATE TABLE Ventas (
    id_venta         INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    monto_total      DECIMAL(10,2)  NOT NULL,
    id_usuario       INT            NOT NULL,
    id_cliente       INT,
    archivo_factura  LONGBLOB,
    CONSTRAINT fk_venta_usuario FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente) ON DELETE SET NULL
);

CREATE TABLE Detalle_Venta (
    id_venta        INT           NOT NULL,
    id_producto     INT           NOT NULL,
    cantidad        INT           NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    PRIMARY KEY (id_venta, id_producto),
    CONSTRAINT fk_det_venta    FOREIGN KEY (id_venta)    REFERENCES Ventas(id_venta)    ON DELETE CASCADE,
    CONSTRAINT fk_det_producto FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);
