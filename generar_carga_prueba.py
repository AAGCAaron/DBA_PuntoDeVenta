import random
from datetime import datetime, timedelta

# Nombres y datos para clientes nuevos
clientes_nuevos = [
    ("Valeria Sofía Mendoza", "MENV950312XYZ", "vale.mendoza@email.com"),
    ("Carlos Eduardo Rojas", "ROJC881105ABC", "carlos.rojas@email.com"),
    ("Mariana Ríos", "RIOM920718DEF", "mariana.rios@email.com")
]

# Productos nuevos
productos_nuevos = [
    ("7501111111111", "Galletas Oreo 274g", 22.50, 50, 8, 1),
    ("7502222222222", "Jugo del Valle Manzana 413ml", 15.00, 40, 3, 2),
    ("7503333333333", "Yogurt Yoplait Fresa 240g", 12.50, 30, 2, 5),
    ("7504444444444", "Atún Dolores Agua 140g", 21.00, 60, 1, 9),
    ("7505555555555", "Doritos Nacho 150g", 35.00, 45, 4, 4)
]

# Definición de productos existentes + los nuevos para poder asignar detalles de venta
# (id_producto, precio_venta)
productos_pool = [
    (1, 45.00), (2, 18.00), (3, 17.00), (4, 42.00), (5, 26.50),
    (6, 27.00), (7, 38.50), (8, 95.00), (9, 32.00), (10, 115.00),
    (11, 22.50), (12, 15.00), (13, 12.50), (14, 21.00), (15, 35.00)
]

usuarios_pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
clientes_pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

def random_date(start, end):
    delta = end - start
    int_delta = (delta.days * 24 * 60 * 60) + delta.seconds
    random_second = random.randrange(int_delta)
    return start + timedelta(seconds=random_second)

with open("carga_prueba.sql", "w", encoding="utf-8") as f:
    f.write("-- ==========================================================\n")
    f.write("-- SCRIPT DE CARGA DE PRUEBA PARA DASHBOARD Y VISTAS\n")
    f.write("-- ==========================================================\n\n")
    f.write("SET NAMES utf8mb4;\n")
    f.write("USE pos_tiendita;\n\n")

    f.write("-- 1. Insertar 3 Clientes Nuevos\n")
    f.write("INSERT INTO CLIENTE (nombre_completo, rfc, correo_electronico) VALUES\n")
    clientes_sql = [f"('{c[0]}', '{c[1]}', '{c[2]}')" for c in clientes_nuevos]
    f.write(",\n".join(clientes_sql) + ";\n\n")

    f.write("-- 2. Insertar 5 Productos Nuevos\n")
    f.write("INSERT INTO PRODUCTO (codigo_barras, nombre_producto, precio_venta, stock, id_categoria, id_proveedor) VALUES\n")
    prods_sql = [f"('{p[0]}', '{p[1]}', {p[2]}, {p[3]}, {p[4]}, {p[5]})" for p in productos_nuevos]
    f.write(",\n".join(prods_sql) + ";\n\n")

    f.write("-- 3. Insertar Ventas (Históricas y Recientes)\n")
    
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2026, 5, 29)
    
    for i in range(1, 101):
        # Generar Venta
        fecha_venta = random_date(start_date, end_date)
        id_usuario = random.choice(usuarios_pool)
        id_cliente = random.choice(clientes_pool)
        
        # Generar Detalles
        num_detalles = random.randint(1, 4)
        detalles = []
        monto_total = 0.0
        
        prods_seleccionados = random.sample(productos_pool, num_detalles)
        for prod in prods_seleccionados:
            id_producto = prod[0]
            precio_unitario = prod[1]
            cantidad = random.randint(1, 3)
            subtotal = cantidad * precio_unitario
            monto_total += subtotal
            detalles.append((id_producto, cantidad, precio_unitario, subtotal))
        
        # Escribir VENTA (Usamos NOW() solo como placeholder, la reemplazaremos con la fecha generada)
        f.write(f"INSERT INTO VENTA (fecha_hora, id_usuario, id_cliente, monto_total) VALUES ('{fecha_venta.strftime('%Y-%m-%d %H:%M:%S')}', {id_usuario}, {id_cliente}, {monto_total});\n")
        f.write("SET @ultima_venta = LAST_INSERT_ID();\n")
        
        # Escribir DETALLE_VENTA
        f.write("INSERT INTO DETALLE_VENTA (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES\n")
        detalles_sql = [f"(@ultima_venta, {d[0]}, {d[1]}, {d[2]}, {d[3]})" for d in detalles]
        f.write(",\n".join(detalles_sql) + ";\n\n")

print("Archivo carga_prueba.sql generado exitosamente.")
