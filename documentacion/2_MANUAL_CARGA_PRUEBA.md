# Manual: Cargar Datos de Prueba

Este documento explica cómo inyectar la carga de prueba masiva (100+ ventas, clientes y productos) en la base de datos de manera manual, sin usar Python. Esto es útil si tu profesora te pide demostrar cómo se llena la base de datos o cómo funciona el dashboard con datos históricos.

## Pasos para ejecutar la carga

1. Asegúrate de que tus contenedores de Docker estén encendidos:
   ```bash
   cd /home/agc_aaron/DBA_PuntoDeVenta
   sudo docker compose up -d db
   ```

2. Ejecuta el archivo SQL directamente dentro del contenedor de MySQL utilizando este comando. Te pedirá la contraseña (la contraseña de la base de datos es `pos_password`):
   ```bash
   sudo docker compose exec -T db mysql -u pos_user -ppos_password pos_tiendita < carga_prueba.sql
   ```
   > **Nota:** La `-p` va pegada a la contraseña a propósito (`-ppos_password`).

3. Una vez que el comando termine (no debería mostrar ninguna salida si fue exitoso), ve a tu aplicación web.
4. Navega a **Dashboard** y verás cómo todas las gráficas, KPIs y tablas se han actualizado con los nuevos registros.

## ¿Qué incluye la carga de prueba?
- 3 Clientes nuevos.
- 5 Productos nuevos en distintas categorías.
- 100 Ventas generadas de forma aleatoria con fechas distribuidas entre enero 2025 y la fecha actual.
- Cada venta incluye entre 1 y 4 detalles de venta (productos diferentes comprados en la misma transacción).
