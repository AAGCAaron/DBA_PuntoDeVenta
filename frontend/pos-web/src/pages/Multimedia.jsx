import React, { useState, useEffect } from 'react'
import api from '../api/client'

export default function Multimedia() {
  const [archivos, setArchivos] = useState([])
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const cargarArchivos = () => {
    api.get('/multimedia/')
      .then(res => setArchivos(res.data))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    cargarArchivos()
  }, [])

  const handleSubir = (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    api.post('/multimedia/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => {
      alert('Archivo subido por vía dual exitosamente.')
      setFile(null)
      cargarArchivos()
    })
    .catch(err => alert('Error al subir: ' + err.message))
    .finally(() => setLoading(false))
  }

  // Componente interno para renderizar dinámicamente imagen/video/audio/txt
  const Reproductor = ({ src, mime, title }) => {
    if (mime.startsWith('image/')) {
      return <img src={src} alt={title} className="img-fluid rounded border shadow-sm" style={{ maxHeight: '250px' }} />
    }
    if (mime.startsWith('video/')) {
      return <video src={src} controls className="img-fluid rounded border shadow-sm" style={{ maxHeight: '250px' }} />
    }
    if (mime.startsWith('audio/')) {
      return <audio src={src} controls className="w-100 mt-2 shadow-sm" />
    }
    // Si es un TXT o PDF, lo metemos en un iframe para que se vea doble en pantalla
    if (mime === 'text/plain' || mime === 'application/pdf') {
      return <iframe src={src} title={title} className="w-100 rounded border shadow-sm" style={{ height: '200px', background: 'white' }} />
    }
    
    // Fallback para otros formatos
    return <a href={src} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm mt-2">Descargar Documento</a>
  }

  return (
    <div className="container-fluid pb-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="page-title mb-1">📼 Evidencia Multimedia</h2>
          <p className="page-subtitle mb-0">Demostración del almacenamiento dual (Ruta Física + LONGBLOB) solicitado en los requerimientos.</p>
        </div>
      </div>

      {/* Formulario de subida */}
      <div className="glass-container p-4 mb-5">
        <h5 className="fw-bold mb-3">Subir Nuevo Archivo</h5>
        <form onSubmit={handleSubir} className="d-flex align-items-center gap-3">
          <input 
            type="file" 
            className="form-control" 
            style={{ maxWidth: '400px' }}
            onChange={e => setFile(e.target.files[0])}
            required 
            accept="image/*,video/*,audio/*,.txt,.pdf"
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !file}>
            {loading ? 'Subiendo y procesando...' : 'Guardar Evidencia'}
          </button>
        </form>
      </div>

      {/* Lista de archivos duplicados */}
      <div className="row g-4">
        {archivos.length === 0 ? (
          <p className="text-muted">Aún no has subido archivos multimedia para probar.</p>
        ) : (
          archivos.map(a => (
            <div key={a.id_archivo} className="col-12">
              <div className="glass-container p-4">
                <h5 className="fw-bold mb-4 border-bottom pb-2">
                  {a.nombre_archivo} <span className="badge bg-secondary ms-2">{a.tipo_mime}</span>
                </h5>
                
                <div className="row g-4">
                  {/* Visualización 1: VARCHAR (Ruta) */}
                  <div className="col-md-6 border-end">
                    <h6 className="text-primary fw-bold mb-3">1. Renderizado por Ruta (VARCHAR)</h6>
                    <p className="text-muted small mb-3">
                      <strong>Ubicación en Servidor:</strong> <br/>
                      <a href={a.ruta_archivo} target="_blank" rel="noreferrer">{a.ruta_archivo}</a>
                    </p>
                    <Reproductor src={a.ruta_archivo} mime={a.tipo_mime} title={a.nombre_archivo} />
                  </div>

                  {/* Visualización 2: LONGBLOB (Base64) */}
                  <div className="col-md-6">
                    <h6 className="text-danger fw-bold mb-3">2. Renderizado desde Motor DB (LONGBLOB)</h6>
                    <p className="text-muted small mb-3">
                      <strong>Ubicación:</strong> Campo `archivo_blob` en MySQL, extraído y decodificado a Base64.<br/>
                      <em>(Mismo archivo, renderizado desde bytes en tiempo real)</em>
                    </p>
                    {a.blob_base64 ? (
                      <Reproductor 
                        src={`data:${a.tipo_mime};base64,${a.blob_base64}`} 
                        mime={a.tipo_mime} 
                        title={a.nombre_archivo} 
                      />
                    ) : (
                      <span className="text-muted">No se pudo extraer el BLOB.</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
