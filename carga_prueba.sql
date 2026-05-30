-- ==========================================================
-- SCRIPT DE CARGA DE PRUEBA PARA DASHBOARD Y VISTAS
-- ==========================================================

SET NAMES utf8mb4;
USE pos_tiendita;

-- ==========================================================
-- EVIDENCIA 1: ESTADO INICIAL (Base de datos antes de cargar)
-- ==========================================================
SELECT '--- ANTES DE LA CARGA MASIVA ---' AS '';
SELECT 'Cantidad de Clientes:' AS Metrica, COUNT(*) AS Total FROM CLIENTE;
SELECT 'Cantidad de Productos:' AS Metrica, COUNT(*) AS Total FROM PRODUCTO;
SELECT 'Cantidad de Ventas:' AS Metrica, COUNT(*) AS Total FROM VENTA;
SELECT '==================================================' AS '';

-- 1. Insertar 3 Clientes Nuevos
INSERT INTO CLIENTE (nombre_completo, rfc, correo_electronico) VALUES
('Valeria Sofía Mendoza', 'MENV950312XYZ', 'vale.mendoza@email.com'),
('Carlos Eduardo Rojas', 'ROJC881105ABC', 'carlos.rojas@email.com'),
('Mariana Ríos', 'RIOM920718DEF', 'mariana.rios@email.com');

-- 2. Insertar 5 Productos Nuevos
INSERT INTO PRODUCTO (codigo_barras, nombre_producto, precio_venta, stock, id_categoria, id_proveedor) VALUES
('7501111111111', 'Galletas Oreo 274g', 22.5, 50, 8, 1),
('7502222222222', 'Jugo del Valle Manzana 413ml', 15.0, 40, 3, 2),
('7503333333333', 'Yogurt Yoplait Fresa 240g', 12.5, 30, 2, 5),
('7504444444444', 'Atún Dolores Agua 140g', 21.0, 60, 1, 9),
('7505555555555', 'Doritos Nacho 150g', 35.0, 45, 4, 4);

-- 3. Insertar Ventas (Históricas y Recientes)
INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-09-04 07:28:55', 10, 13, 200.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 1, 22.5, 22.5),
(@ultima_venta, 4, 3, 42.0, 126.0),
(@ultima_venta, 15, 1, 35.0, 35.0),
(@ultima_venta, 3, 1, 17.0, 17.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-23 16:40:08', 8, 2, 145.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 15, 2, 35.0, 70.0),
(@ultima_venta, 14, 1, 21.0, 21.0),
(@ultima_venta, 2, 3, 18.0, 54.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-11 17:02:24', 3, 8, 207.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 3, 21.0, 63.0),
(@ultima_venta, 11, 3, 22.5, 67.5),
(@ultima_venta, 7, 2, 38.5, 77.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-09-02 09:34:08', 7, 10, 233.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 13, 3, 12.5, 37.5),
(@ultima_venta, 10, 1, 115.0, 115.0),
(@ultima_venta, 6, 3, 27.0, 81.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-20 01:00:03', 1, 9, 22.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 1, 22.5, 22.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-12-26 19:36:39', 6, 9, 45.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 2, 22.5, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-03-14 19:49:13', 2, 4, 224.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 2, 18.0, 36.0),
(@ultima_venta, 3, 1, 17.0, 17.0),
(@ultima_venta, 4, 3, 42.0, 126.0),
(@ultima_venta, 1, 1, 45.0, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-18 06:40:13', 5, 2, 64.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 1, 22.5, 22.5),
(@ultima_venta, 4, 1, 42.0, 42.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-03 15:45:36', 3, 13, 115.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 5, 2, 26.5, 53.0),
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 3, 1, 17.0, 17.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-29 02:06:04', 2, 6, 102.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 13, 2, 12.5, 25.0),
(@ultima_venta, 7, 2, 38.5, 77.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-21 08:04:45', 9, 8, 36.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 2, 18.0, 36.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-22 23:27:36', 2, 7, 568.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 3, 21.0, 63.0),
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 7, 3, 38.5, 115.5),
(@ultima_venta, 10, 3, 115.0, 345.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-25 19:31:48', 9, 9, 151.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 4, 1, 42.0, 42.0),
(@ultima_venta, 2, 1, 18.0, 18.0),
(@ultima_venta, 13, 3, 12.5, 37.5),
(@ultima_venta, 6, 2, 27.0, 54.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-27 18:09:28', 10, 5, 143.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 9, 2, 32.0, 64.0),
(@ultima_venta, 5, 3, 26.5, 79.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-15 05:08:19', 10, 7, 141.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 2, 18.0, 36.0),
(@ultima_venta, 14, 1, 21.0, 21.0),
(@ultima_venta, 4, 2, 42.0, 84.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-07 03:27:21', 10, 7, 206.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 5, 2, 26.5, 53.0),
(@ultima_venta, 14, 3, 21.0, 63.0),
(@ultima_venta, 1, 2, 45.0, 90.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-24 20:05:08', 2, 9, 114.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 3, 21.0, 63.0),
(@ultima_venta, 3, 3, 17.0, 51.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-14 18:22:26', 1, 8, 94.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 3, 1, 17.0, 17.0),
(@ultima_venta, 7, 2, 38.5, 77.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-09-11 03:33:23', 5, 1, 425.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 13, 2, 12.5, 25.0),
(@ultima_venta, 10, 1, 115.0, 115.0),
(@ultima_venta, 8, 3, 95.0, 285.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-16 18:47:51', 9, 6, 172.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 5, 3, 26.5, 79.5),
(@ultima_venta, 11, 3, 22.5, 67.5),
(@ultima_venta, 13, 2, 12.5, 25.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-03-23 22:53:40', 2, 10, 317.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 2, 21.0, 42.0),
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 10, 2, 115.0, 230.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-23 19:05:50', 3, 3, 51.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 3, 3, 17.0, 51.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-12-07 13:32:50', 1, 11, 236.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 12, 2, 15.0, 30.0),
(@ultima_venta, 13, 1, 12.5, 12.5),
(@ultima_venta, 11, 3, 22.5, 67.5),
(@ultima_venta, 4, 3, 42.0, 126.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-02-24 12:46:03', 6, 2, 70.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 15, 2, 35.0, 70.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-15 08:59:13', 8, 8, 87.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 14, 2, 21.0, 42.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-14 03:47:26', 10, 7, 316.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 8, 2, 95.0, 190.0),
(@ultima_venta, 13, 3, 12.5, 37.5),
(@ultima_venta, 14, 1, 21.0, 21.0),
(@ultima_venta, 11, 3, 22.5, 67.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-17 13:11:36', 3, 6, 217.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 4, 3, 42.0, 126.0),
(@ultima_venta, 13, 1, 12.5, 12.5),
(@ultima_venta, 3, 2, 17.0, 34.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-10 05:14:05', 9, 4, 319.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 8, 2, 95.0, 190.0),
(@ultima_venta, 11, 2, 22.5, 45.0),
(@ultima_venta, 4, 2, 42.0, 84.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-14 20:57:06', 3, 1, 30.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 12, 2, 15.0, 30.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-04-23 11:40:13', 2, 11, 539.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 2, 22.5, 45.0),
(@ultima_venta, 2, 3, 18.0, 54.0),
(@ultima_venta, 10, 3, 115.0, 345.0),
(@ultima_venta, 8, 1, 95.0, 95.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-02-23 13:18:28', 5, 11, 52.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 12, 2, 15.0, 30.0),
(@ultima_venta, 11, 1, 22.5, 22.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-18 01:25:33', 9, 2, 38.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 1, 38.5, 38.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-06 03:44:24', 6, 6, 115.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 10, 1, 115.0, 115.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-20 13:11:12', 9, 5, 204.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 1, 18.0, 18.0),
(@ultima_venta, 3, 3, 17.0, 51.0),
(@ultima_venta, 1, 3, 45.0, 135.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-12 01:17:28', 7, 3, 194.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 12, 3, 15.0, 45.0),
(@ultima_venta, 6, 2, 27.0, 54.0),
(@ultima_venta, 2, 1, 18.0, 18.0),
(@ultima_venta, 7, 2, 38.5, 77.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-01-02 05:43:57', 4, 4, 298.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 4, 1, 42.0, 42.0),
(@ultima_venta, 9, 3, 32.0, 96.0),
(@ultima_venta, 10, 1, 115.0, 115.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-28 22:55:21', 7, 10, 90.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 1, 2, 45.0, 90.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-03 12:34:41', 7, 11, 42.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 4, 1, 42.0, 42.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-01 15:33:53', 4, 11, 250.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 6, 1, 27.0, 27.0),
(@ultima_venta, 11, 3, 22.5, 67.5),
(@ultima_venta, 14, 1, 21.0, 21.0),
(@ultima_venta, 1, 3, 45.0, 135.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-05-06 01:35:41', 9, 8, 95.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 8, 1, 95.0, 95.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-03-07 07:09:44', 8, 13, 89.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 6, 1, 27.0, 27.0),
(@ultima_venta, 3, 1, 17.0, 17.0),
(@ultima_venta, 12, 3, 15.0, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-02-25 14:10:57', 5, 13, 444.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 3, 22.5, 67.5),
(@ultima_venta, 14, 1, 21.0, 21.0),
(@ultima_venta, 4, 3, 42.0, 126.0),
(@ultima_venta, 10, 2, 115.0, 230.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-19 21:58:00', 1, 4, 284.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 3, 3, 17.0, 51.0),
(@ultima_venta, 10, 1, 115.0, 115.0),
(@ultima_venta, 6, 3, 27.0, 81.0),
(@ultima_venta, 13, 3, 12.5, 37.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-14 10:31:29', 10, 7, 166.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 15, 2, 35.0, 70.0),
(@ultima_venta, 4, 1, 42.0, 42.0),
(@ultima_venta, 6, 2, 27.0, 54.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-20 09:22:24', 8, 1, 293.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 1, 22.5, 22.5),
(@ultima_venta, 4, 3, 42.0, 126.0),
(@ultima_venta, 10, 1, 115.0, 115.0),
(@ultima_venta, 12, 2, 15.0, 30.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-02-08 20:53:15', 10, 7, 167.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 2, 22.5, 45.0),
(@ultima_venta, 5, 1, 26.5, 26.5),
(@ultima_venta, 4, 1, 42.0, 42.0),
(@ultima_venta, 6, 2, 27.0, 54.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-24 21:53:37', 1, 4, 135.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 1, 3, 45.0, 135.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-03-18 20:03:10', 7, 9, 143.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 6, 1, 27.0, 27.0),
(@ultima_venta, 5, 1, 26.5, 26.5),
(@ultima_venta, 11, 2, 22.5, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-11-13 14:59:42', 8, 2, 113.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 2, 38.5, 77.0),
(@ultima_venta, 2, 2, 18.0, 36.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-29 15:33:36', 4, 13, 99.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 9, 1, 32.0, 32.0),
(@ultima_venta, 11, 3, 22.5, 67.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-10 18:01:20', 8, 10, 285.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 8, 3, 95.0, 285.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-12 06:57:53', 6, 3, 142.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 3, 21.0, 63.0),
(@ultima_venta, 5, 3, 26.5, 79.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-15 11:44:35', 10, 10, 140.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 6, 3, 27.0, 81.0),
(@ultima_venta, 3, 2, 17.0, 34.0),
(@ultima_venta, 13, 2, 12.5, 25.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-03-21 10:15:50', 10, 13, 105.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 15, 3, 35.0, 105.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-01-19 10:19:23', 9, 10, 248.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 1, 18.0, 18.0),
(@ultima_venta, 10, 2, 115.0, 230.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-18 17:20:07', 4, 8, 142.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 3, 3, 17.0, 51.0),
(@ultima_venta, 14, 1, 21.0, 21.0),
(@ultima_venta, 15, 2, 35.0, 70.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-16 05:56:48', 6, 6, 53.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 5, 2, 26.5, 53.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-06 19:44:07', 2, 11, 435.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 2, 18.0, 36.0),
(@ultima_venta, 10, 3, 115.0, 345.0),
(@ultima_venta, 6, 2, 27.0, 54.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-02 08:10:05', 8, 9, 37.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 13, 3, 12.5, 37.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-20 06:13:53', 1, 6, 21.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 1, 21.0, 21.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-02 00:50:15', 8, 5, 124.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 12, 3, 15.0, 45.0),
(@ultima_venta, 14, 2, 21.0, 42.0),
(@ultima_venta, 13, 3, 12.5, 37.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-25 03:17:21', 2, 1, 77.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 2, 38.5, 77.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-12-07 16:45:33', 1, 8, 128.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 3, 38.5, 115.5),
(@ultima_venta, 13, 1, 12.5, 12.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-19 07:14:08', 8, 9, 12.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 13, 1, 12.5, 12.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-04-13 18:50:25', 5, 12, 835.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 10, 3, 115.0, 345.0),
(@ultima_venta, 5, 3, 26.5, 79.5),
(@ultima_venta, 4, 3, 42.0, 126.0),
(@ultima_venta, 8, 3, 95.0, 285.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-07-22 01:07:46', 7, 5, 257.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 2, 38.5, 77.0),
(@ultima_venta, 4, 2, 42.0, 84.0),
(@ultima_venta, 9, 3, 32.0, 96.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-23 14:16:29', 5, 3, 77.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 2, 38.5, 77.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-12-03 05:42:00', 10, 13, 387.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 3, 3, 17.0, 51.0),
(@ultima_venta, 4, 3, 42.0, 126.0),
(@ultima_venta, 10, 1, 115.0, 115.0),
(@ultima_venta, 8, 1, 95.0, 95.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-04-07 18:11:28', 7, 3, 179.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 3, 38.5, 115.5),
(@ultima_venta, 9, 2, 32.0, 64.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-01-09 19:48:29', 1, 2, 137.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 13, 1, 12.5, 12.5),
(@ultima_venta, 8, 1, 95.0, 95.0),
(@ultima_venta, 12, 2, 15.0, 30.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-02 16:43:18', 1, 6, 169.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 3, 18.0, 54.0),
(@ultima_venta, 7, 3, 38.5, 115.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-05 00:57:49', 1, 4, 490.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 1, 21.0, 21.0),
(@ultima_venta, 10, 3, 115.0, 345.0),
(@ultima_venta, 5, 3, 26.5, 79.5),
(@ultima_venta, 1, 1, 45.0, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-11-28 04:21:48', 5, 10, 305.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 10, 2, 115.0, 230.0),
(@ultima_venta, 14, 3, 21.0, 63.0),
(@ultima_venta, 13, 1, 12.5, 12.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-25 14:32:40', 4, 7, 12.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 13, 1, 12.5, 12.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-12-23 17:29:16', 5, 6, 126.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 4, 3, 42.0, 126.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-01-03 11:46:00', 8, 9, 22.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 1, 22.5, 22.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-03-27 00:03:40', 3, 9, 91.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 6, 1, 27.0, 27.0),
(@ultima_venta, 9, 2, 32.0, 64.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-07 00:20:24', 8, 11, 67.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 3, 22.5, 67.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-02-15 05:56:35', 10, 11, 34.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 3, 2, 17.0, 34.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-28 00:36:43', 5, 11, 45.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 2, 22.5, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-01-10 20:45:54', 9, 10, 423.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 14, 2, 21.0, 42.0),
(@ultima_venta, 10, 2, 115.0, 230.0),
(@ultima_venta, 11, 3, 22.5, 67.5),
(@ultima_venta, 4, 2, 42.0, 84.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-09-16 21:52:39', 9, 11, 82.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 9, 1, 32.0, 32.0),
(@ultima_venta, 15, 1, 35.0, 35.0),
(@ultima_venta, 12, 1, 15.0, 15.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-04-07 13:28:24', 3, 1, 490.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 3, 22.5, 67.5),
(@ultima_venta, 9, 3, 32.0, 96.0),
(@ultima_venta, 4, 1, 42.0, 42.0),
(@ultima_venta, 8, 3, 95.0, 285.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-01-06 17:40:49', 1, 4, 215.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 2, 22.5, 45.0),
(@ultima_venta, 3, 3, 17.0, 51.0),
(@ultima_venta, 4, 1, 42.0, 42.0),
(@ultima_venta, 7, 2, 38.5, 77.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-05-11 00:40:26', 6, 5, 95.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 8, 1, 95.0, 95.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-01-03 05:38:20', 10, 4, 230.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 10, 2, 115.0, 230.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-04-11 18:39:45', 7, 7, 477.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 5, 2, 26.5, 53.0),
(@ultima_venta, 10, 3, 115.0, 345.0),
(@ultima_venta, 3, 2, 17.0, 34.0),
(@ultima_venta, 12, 3, 15.0, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-06-30 03:49:42', 9, 2, 18.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 1, 18.0, 18.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-20 19:43:42', 2, 1, 415.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 2, 1, 18.0, 18.0),
(@ultima_venta, 7, 2, 38.5, 77.0),
(@ultima_venta, 15, 1, 35.0, 35.0),
(@ultima_venta, 8, 3, 95.0, 285.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-26 20:59:05', 4, 5, 153.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 5, 1, 26.5, 26.5),
(@ultima_venta, 15, 2, 35.0, 70.0),
(@ultima_venta, 14, 2, 21.0, 42.0),
(@ultima_venta, 12, 1, 15.0, 15.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-02-16 04:26:58', 8, 4, 53.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 5, 2, 26.5, 53.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-04-27 17:49:08', 9, 3, 22.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 1, 22.5, 22.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-03-20 18:25:53', 10, 5, 131.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 4, 1, 42.0, 42.0),
(@ultima_venta, 3, 3, 17.0, 51.0),
(@ultima_venta, 7, 1, 38.5, 38.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2026-02-04 15:12:36', 4, 9, 160.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 9, 1, 32.0, 32.0),
(@ultima_venta, 13, 1, 12.5, 12.5),
(@ultima_venta, 7, 3, 38.5, 115.5);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-09-27 04:58:08', 2, 8, 45.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 11, 2, 22.5, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-08-20 09:21:26', 1, 2, 171.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 12, 2, 15.0, 30.0),
(@ultima_venta, 9, 3, 32.0, 96.0),
(@ultima_venta, 1, 1, 45.0, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-11-12 15:26:29', 5, 9, 423.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 10, 3, 115.0, 345.0),
(@ultima_venta, 5, 1, 26.5, 26.5),
(@ultima_venta, 15, 1, 35.0, 35.0),
(@ultima_venta, 3, 1, 17.0, 17.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-09-19 02:08:16', 2, 8, 137.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 9, 1, 32.0, 32.0),
(@ultima_venta, 15, 3, 35.0, 105.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-05-04 13:45:57', 1, 6, 160.5);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 7, 3, 38.5, 115.5),
(@ultima_venta, 1, 1, 45.0, 45.0);

INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('2025-10-01 16:38:05', 10, 9, 62.0);
SET @ultima_venta = LAST_INSERT_ID();
INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(@ultima_venta, 1, 1, 45.0, 45.0),
(@ultima_venta, 3, 1, 17.0, 17.0);

-- 4. Reabastecer Inventario
-- Como las ventas históricas de prueba restan stock agresivamente gracias a los Triggers,
-- reabastecemos el inventario a 100 unidades de cada producto para poder usar el sistema hoy.
UPDATE PRODUCTO SET stock = 100;

-- ==========================================================
-- EVIDENCIA 2: ESTADO FINAL (Base de datos después de cargar)
-- ==========================================================
SELECT '--- DESPUÉS DE LA CARGA MASIVA ---' AS '';
SELECT 'Cantidad de Clientes:' AS Metrica, COUNT(*) AS Total FROM CLIENTE;
SELECT 'Cantidad de Productos:' AS Metrica, COUNT(*) AS Total FROM PRODUCTO;
SELECT 'Cantidad de Ventas:' AS Metrica, COUNT(*) AS Total FROM VENTA;
SELECT '==================================================' AS '';
