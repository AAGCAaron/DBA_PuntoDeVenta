# 📄 8. Documentación: CRUD y Manipulación Dual de BLOBs / Rutas

**Proyecto:** POS Tiendita  
**Materia:** Bases de Datos Avanzadas — UNAM FI 2026-2  

Este documento evidencia la implementación del CRUD para la gestión de archivos multimedia (imágenes `.jpeg`, `.png`, audios `.mp3`, videos `.mp4` y documentos `.txt`). Cumpliendo con los requerimientos técnicos, se ha diseñado una **Arquitectura Dual de Almacenamiento**.

---

## 1. Diseño Estructural (La Base de Datos)

Para poder demostrar que dominamos tanto el guardado físico de bytes dentro del motor de la base de datos, como el guardado tradicional por sistema de archivos, la tabla que gestiona la multimedia cuenta con dos columnas clave:

```sql
CREATE TABLE EVIDENCIA_MULTIMEDIA (
    id_archivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(100) NOT NULL,
    tipo_mime VARCHAR(50) NOT NULL,
    archivo_blob LONGBLOB NOT NULL,       -- Almacenamiento directo de bytes
    ruta_archivo VARCHAR(255) NOT NULL    -- Almacenamiento de la ruta local
) ENGINE=InnoDB;
```

---

## 2. Evidencia del Código (El CRUD en el Backend)

Cuando el usuario envía un archivo (por ejemplo, un video promocional de un producto `.mp4`), nuestro backend en Python (FastAPI) realiza la operación `CREATE` cumpliendo la condición dual:

1. Guarda el archivo en la carpeta física del servidor (`/uploads/videos/`).
2. Convierte el archivo a código binario.
3. Inserta ambos datos en la base de datos mediante SQLAlchemy.

```python
@router.post("/multimedia/upload")
async def upload_file(db: Session = Depends(get_db), file: UploadFile = File(...)):
    # 1. Crear la ruta física y guardar el archivo en disco
    file_location = f"assets/uploads/{file.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(file.file.read())
    
    # 2. Leer los bytes puros para el BLOB
    file.file.seek(0)
    blob_data = file.file.read()
    
    # 3. Operación CREATE (INSERT a la base de datos)
    nuevo_archivo = EvidenciaMultimedia(
        nombre_archivo=file.filename,
        tipo_mime=file.content_type,
        archivo_blob=blob_data,        # Guardamos el BLOB pesado
        ruta_archivo=file_location     # Guardamos el texto VARCHAR
    )
    db.add(nuevo_archivo)
    db.commit()
    
    return {"message": "Archivo guardado exitosamente por vía dual."}
```

---

## 3. Prueba de Visualización Doble (Frontend)

Para probar que la extracción (`READ`) es exitosa desde ambos orígenes, el Frontend desarrollado en React.js renderiza el componente visual **dos veces seguidas en la misma pantalla**.

- El primer elemento utiliza el campo `VARCHAR` y busca el archivo en el directorio local del servidor web.
- El segundo elemento toma el campo `LONGBLOB`, que el backend previamente convirtió a Base64, e inyecta los bytes puros directamente en la etiqueta HTML.

```javascript
// Componente de React.js para mostrar el video doble
function VistaMultimedia({ archivo }) {
  // archivo.ruta_archivo = "/assets/uploads/video.mp4"
  // archivo.blob_base64 = "iVBORw0KGgoAAAANSUhEUgAA..." (Ejemplo)

  return (
    <div className="multimedia-container d-flex gap-4">
      
      {/* Visualización 1: Desde el campo VARCHAR (Ruta física) */}
      <div className="card">
        <h4>Renderizado por Ruta (VARCHAR)</h4>
        <video controls width="300" src={archivo.ruta_archivo} />
      </div>

      {/* Visualización 2: Desde el campo LONGBLOB (Base64 Data URI) */}
      <div className="card">
        <h4>Renderizado por Motor DB (LONGBLOB)</h4>
        <video 
          controls 
          width="300" 
          src={`data:${archivo.tipo_mime};base64,${archivo.blob_base64}`} 
        />
      </div>

    </div>
  );
}
```

### Resultado Esperado (Prueba Visual)
Al ingresar a la interfaz del sistema, el usuario observará exactamente el mismo video `.mp4` (o audio `.mp3`) reproducido dos veces simultáneamente. Uno está siendo consumido del disco duro de la computadora gracias al campo `VARCHAR`, y el clon exacto está siendo decodificado en tiempo real gracias a los bytes extraídos del campo `LONGBLOB` de MySQL.

---

## 4. Consultas de Verificación (Historial y BLOBs)

Para demostrar mediante lenguaje SQL cómo se extrae la información del historial de ventas y cómo se comprueba físicamente la existencia de los BLOBs (verificando su peso en bytes), se ha preparado un script especial con los `SELECT` más importantes del proyecto.

### ¿Cómo ejecutar las consultas de verificación?

Abre tu terminal en la carpeta principal del proyecto y ejecuta el siguiente comando:

```bash
sudo docker compose exec -T db mysql -t -v -u root -prootpassword pos_tiendita < database/consultas_blob.sql
```

**¿Qué consultas se imprimirán en la pantalla?**
1. **Historial de Ventas**: Muestra quién cobró, a quién se le vendió y el monto.
2. **Detalle de Ventas**: Muestra los productos individuales que conforman cada ticket.
3. **Verificación Multimedia**: Extrae la tabla dual demostrando la existencia de la ruta (`VARCHAR`) y el peso exacto del binario del archivo (`LONGBLOB`).
4. **Verificación de Facturas**: Demuestra qué ventas tienen un archivo XML/PDF almacenado pesadamente en MySQL.
5. **Verificación de Productos**: Comprueba el estatus de las imágenes guardadas en el inventario.
