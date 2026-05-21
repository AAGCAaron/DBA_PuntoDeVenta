-- POS_Tiendita -- Esquema + Datos de prueba + Tablespaces & Storage
-- Generado desde base.txt + llenado.txt

CREATE DATABASE IF NOT EXISTS pos_tiendita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_tiendita;

-- ─── TABLESPACES (Requisito de Diseño CASE y Administración de Storage) ──────
-- ts_datos: Destinado para almacenar el DDL de todas las entidades
-- ts_indices: Destinado como espacio lógico reservado para almacenamiento de índices
CREATE TABLESPACE ts_datos ADD DATAFILE 'ts_datos.ibd' ENGINE=InnoDB;
CREATE TABLESPACE ts_indices ADD DATAFILE 'ts_indices.ibd' ENGINE=InnoDB;

-- ─── TABLAS ────────────────────────────────────────────────────────────────────

CREATE TABLE CATEGORIA
(
    id_categoria  INTEGER AUTO_INCREMENT,
    nombre        VARCHAR(50)  NOT NULL,
    descripcion   VARCHAR(255) NULL,
    PRIMARY KEY (id_categoria)
) TABLESPACE = ts_datos ENGINE=InnoDB;

-- 1. CLIENTE: Incorpora parámetros de storage y tablespace
CREATE TABLE CLIENTE
(
    id_cliente           INTEGER AUTO_INCREMENT,
    nombre_completo      VARCHAR(100) NOT NULL,
    rfc                  VARCHAR(13)  NOT NULL,
    correo_electronico   VARCHAR(100) NOT NULL,
    PRIMARY KEY (id_cliente)
) TABLESPACE = ts_datos ENGINE=InnoDB ROW_FORMAT=DYNAMIC MAX_ROWS=500000 AVG_ROW_LENGTH=120;

CREATE UNIQUE INDEX XAK1CLIENTE ON CLIENTE (rfc);

CREATE TABLE PROVEEDOR
(
    id_proveedor       INTEGER AUTO_INCREMENT,
    razon_social       VARCHAR(100) NOT NULL,
    rfc                VARCHAR(13)  NOT NULL,
    telefono_contacto  VARCHAR(20)  NOT NULL,
    PRIMARY KEY (id_proveedor)
) TABLESPACE = ts_datos ENGINE=InnoDB;

CREATE UNIQUE INDEX XAK1PROVEEDOR ON PROVEEDOR (rfc);

-- 2. USUARIO: Incorpora parámetros de storage y tablespace
CREATE TABLE USUARIO
(
    id_usuario     INTEGER AUTO_INCREMENT,
    nombre_usuario VARCHAR(50)  NOT NULL,
    rol            VARCHAR(20)  NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    PRIMARY KEY (id_usuario)
) TABLESPACE = ts_datos ENGINE=InnoDB ROW_FORMAT=DYNAMIC MAX_ROWS=10000 AVG_ROW_LENGTH=150;

CREATE UNIQUE INDEX XAK1USUARIO ON USUARIO (nombre_usuario);

-- 3. PRODUCTO: Incorpora parámetros de storage y tablespace (Optimizado para LONGBLOB)
CREATE TABLE PRODUCTO
(
    id_producto      INTEGER AUTO_INCREMENT,
    codigo_barras    VARCHAR(50)   NOT NULL,
    nombre_producto  VARCHAR(100)  NOT NULL,
    precio_venta     DECIMAL(10,2) NOT NULL,
    stock            INTEGER       NOT NULL,
    imagen_articulo  LONGBLOB      NULL,
    id_categoria     INTEGER       NULL,
    id_proveedor     INTEGER       NULL,
    PRIMARY KEY (id_producto)
) TABLESPACE = ts_datos ENGINE=InnoDB ROW_FORMAT=DYNAMIC MAX_ROWS=100000 AVG_ROW_LENGTH=2048;

CREATE TABLE VENTA
(
    id_venta        INTEGER AUTO_INCREMENT,
    fecha_hora      DATETIME      NOT NULL,
    monto_total     DECIMAL(10,2) NOT NULL,
    archivo_factura LONGBLOB      NULL,
    id_usuario      INTEGER       NULL,
    id_cliente      INTEGER       NULL,
    PRIMARY KEY (id_venta)
) TABLESPACE = ts_datos ENGINE=InnoDB;

CREATE TABLE DETALLE_VENTA
(
    id_venta        INTEGER       NOT NULL,
    id_producto     INTEGER       NOT NULL,
    cantidad        INTEGER       NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (id_venta, id_producto)
) TABLESPACE = ts_datos ENGINE=InnoDB;

-- ─── LLAVES FORÁNEAS ───────────────────────────────────────────────────────────

ALTER TABLE DETALLE_VENTA ADD FOREIGN KEY R_7  (id_venta)    REFERENCES VENTA    (id_venta);
ALTER TABLE DETALLE_VENTA ADD FOREIGN KEY R_9  (id_producto) REFERENCES PRODUCTO (id_producto);
ALTER TABLE PRODUCTO      ADD FOREIGN KEY R_2  (id_categoria) REFERENCES CATEGORIA (id_categoria);
ALTER TABLE PRODUCTO      ADD FOREIGN KEY R_3  (id_proveedor) REFERENCES PROVEEDOR  (id_proveedor);
ALTER TABLE VENTA         ADD FOREIGN KEY R_4  (id_usuario)  REFERENCES USUARIO  (id_usuario);
ALTER TABLE VENTA         ADD FOREIGN KEY R_10 (id_cliente)  REFERENCES CLIENTE  (id_cliente);

-- ─── DATOS ────────────────────────────────────────────────────────────────────

INSERT INTO CATEGORIA (nombre, descripcion) VALUES
('Abarrotes',          'Productos de despensa, enlatados y semillas'),
('Lácteos',            'Leche, quesos, yogur y derivados'),
('Bebidas',            'Refrescos, jugos, aguas y bebidas energéticas'),
('Botanas',            'Frituras, cacahuates y botanas saladas'),
('Dulcería',           'Chocolates, gomitas, caramelos y chicles'),
('Limpieza',           'Detergentes, jabones y productos para el hogar'),
('Higiene Personal',   'Shampoo, desodorantes, papel higiénico'),
('Panadería',          'Pan dulce, pan de caja y galletas'),
('Carnes y Embutidos', 'Jamón, salchichas, tocino y envasados'),
('Mascotas',           'Alimento para perros y gatos');

INSERT INTO PROVEEDOR (razon_social, rfc, telefono_contacto) VALUES
('Distribuidora Bimbo SA de CV',    'BIMB010101AAA', '5551234001'),
('Coca-Cola Femsa',                 'COCA991231XYZ', '5551234002'),
('PepsiCo México',                  'PEPS881122ABC', '5551234003'),
('Sabritas S. de R.L.',             'SABR771010QWE', '5551234004'),
('Grupo Lala SAB de CV',            'LALA660909RTY', '5551234005'),
('Alpura (Ganaderos Productores)',  'ALPU550808UIO', '5551234006'),
('Procter & Gamble',                'PROC440707PAS', '5551234007'),
('Nestlé México',                   'NEST330606DFG', '5551234008'),
('Unilever de México',              'UNIL220505HJK', '5551234009'),
('Purina PetCare',                  'PURI110404LZX', '5551234010');

INSERT INTO USUARIO (nombre_usuario, rol, password_hash) VALUES
('admin_carlos',   'Admin',   'hash_falso_123'),
('cajero_juan',    'Cajero',  'hash_falso_456'),
('cajera_maria',   'Cajero',  'hash_falso_789'),
('gerente_luis',   'Admin',   'hash_falso_101'),
('cajera_ana',     'Cajero',  'hash_falso_102'),
('cajero_pedro',   'Cajero',  'hash_falso_103'),
('supervisor_ro',  'Admin',   'hash_falso_104'),
('cajera_sofia',   'Cajero',  'hash_falso_105'),
('cajero_diego',   'Cajero',  'hash_falso_106'),
('auditor_sys',    'Auditor', 'hash_falso_107');

INSERT INTO CLIENTE (nombre_completo, rfc, correo_electronico) VALUES
('Público en General', 'XAXX010101000', 'sin_correo@tienda.com'),
('Elena Martínez',     'MARE801210XXX', 'elena.m@email.com'),
('Roberto Gómez',      'GOMR900515YYY', 'roberto.g@email.com'),
('Lucía Fernández',    'FERL850320ZZZ', 'lucia.f@email.com'),
('Javier Hernández',   'HERJ920808ABC', 'javier.h@email.com'),
('Carmen Salinas',     'SALC781125DEF', 'carmen.s@email.com'),
('Miguel Ángel Trejo', 'TREM880110GHI', 'miguel.t@email.com'),
('Patricia López',     'LOPP950909JKL', 'paty.lopez@email.com'),
('Fernando Ruiz',      'RUIF820412MNO', 'fernando.ruiz@email.com'),
('Gabriela Torres',    'TORG910724PQR', 'gaby.torres@email.com');

INSERT INTO PRODUCTO (codigo_barras, nombre_producto, precio_venta, stock, id_categoria, id_proveedor) VALUES
('7501000111111', 'Pan Blanco Bimbo Grande',       45.00,  30, 8,  1),
('7501000222222', 'Coca-Cola Regular 600ml',        18.00, 100, 3,  2),
('7501000333333', 'Pepsi Cola 600ml',               17.00,  80, 3,  3),
('7501000444444', 'Papas Sabritas Sal 170g',        42.00,  45, 4,  4),
('7501000555555', 'Leche Lala Entera 1L',           26.50,  60, 2,  5),
('7501000666666', 'Leche Alpura Deslactosada 1L',   27.00,  55, 2,  6),
('7501000777777', 'Detergente Ariel Polvo 1kg',     38.50,  25, 6,  7),
('7501000888888', 'Nescafé Clásico 225g',           95.00,  15, 1,  8),
('7501000999999', 'Mayonesa Hellmanns 390g',        32.00,  20, 1,  9),
('7501000000000', 'Dog Chow Adultos 2kg',          115.00,  10, 10, 10);
