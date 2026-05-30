import React, { useEffect, useState, useRef } from 'react'
import api from '../api/client'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Unique timestamp key forces the browser to re-fetch the image after upload
function imgUrl(id, ts) {
  return `${API_BASE}/productos/${id}/imagen?t=${ts}`
}

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [uploading, setUploading] = useState(null) // id_producto being uploaded
  const [previewMap, setPreviewMap] = useState({}) // { id_producto: blobURL }
  const [tsMap, setTsMap] = useState({})           // { id_producto: timestamp }
  const [imgError, setImgError] = useState({})     // { id_producto: true }
  const fileInputRef = useRef(null)
  const activeProductId = useRef(null)

  const [showModal, setShowModal] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [proveedores, setProveedores] = useState([])
  
  const [nuevoProd, setNuevoProd] = useState({
    codigo_barras: '',
    nombre_producto: '',
    precio_venta: '',
    stock: '',
    id_categoria: '',
    id_proveedor: ''
  })

  function cargarCombos() {
    api.get('/categorias/').then(({ data }) => setCategorias(data)).catch(() => {})
    api.get('/proveedores/').then(({ data }) => setProveedores(data)).catch(() => {})
  }

  function cargarProductos() {
    api.get('/productos/')
      .then(({ data }) => setProductos(data))
      .catch(() => alert('Error al cargar productos'))
  }

  useEffect(() => { 
    cargarProductos()
    cargarCombos()
  }, [])

  async function handleCrearProducto(e) {
    e.preventDefault()
    try {
      await api.post('/productos/', {
        ...nuevoProd,
        precio_venta: parseFloat(nuevoProd.precio_venta),
        stock: parseInt(nuevoProd.stock, 10),
        id_categoria: nuevoProd.id_categoria ? parseInt(nuevoProd.id_categoria, 10) : null,
        id_proveedor: nuevoProd.id_proveedor ? parseInt(nuevoProd.id_proveedor, 10) : null
      })
      setShowModal(false)
      cargarProductos()
      setNuevoProd({
        codigo_barras: '',
        nombre_producto: '',
        precio_venta: '',
        stock: '',
        id_categoria: '',
        id_proveedor: ''
      })
      alert('Producto creado exitosamente')
    } catch (err) {
      alert('Error al crear el producto. Verifica los datos o el código de barras.')
    }
  }

  function abrirSelector(id_producto) {
    activeProductId.current = id_producto
    fileInputRef.current.value = ''
    fileInputRef.current.click()
  }

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const id = activeProductId.current

    // Instant local preview using a blob URL (in-browser, before server responds)
    const blobURL = URL.createObjectURL(file)
    setPreviewMap(prev => ({ ...prev, [id]: blobURL }))
    setImgError(prev => ({ ...prev, [id]: false }))
    setUploading(id)

    try {
      const form = new FormData()
      form.append('imagen', file)
      await api.post(`/productos/${id}/imagen`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      // Force browser to re-fetch the real image from the server
      setTsMap(prev => ({ ...prev, [id]: Date.now() }))
      // Now that the server has confirmed, clean up the blob preview
      setPreviewMap(prev => { const n = { ...prev }; delete n[id]; return n })
      // Refresh the product list so tiene_imagen flag is updated
      cargarProductos()
    } catch (err) {
      // Roll back preview on failure
      setPreviewMap(prev => { const n = { ...prev }; delete n[id]; return n })
      alert('Error al subir imagen. Intenta de nuevo.')
    } finally {
      setUploading(null)
    }
  }

  const filtrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  )

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="page-title mb-0">Productos</h2>
        <button className="btn btn-primary fw-bold" onClick={() => setShowModal(true)}>
          + Nuevo Producto
        </button>
      </div>

      <input
        className="input"
        style={{ marginBottom: 16 }}
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />

      {/* Hidden file input shared by all cards */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {filtrados.length === 0 ? (
        <p className="list-empty">Sin productos</p>
      ) : (
        <div className="row g-3">
          {filtrados.map(p => {
            const isUploading = uploading === p.id_producto
            const preview = previewMap[p.id_producto]
            const ts = tsMap[p.id_producto] || 0
            const hasImg = preview || p.tiene_imagen
            const hasError = imgError[p.id_producto]

            return (
              <div key={p.id_producto} className="col-6 col-sm-4 col-md-3 col-xl-2">
                <div className="producto-card h-100">
                  {/* Image area — clickable to upload */}
                  <div
                    className={`producto-img-wrap ${isUploading ? 'uploading' : ''}`}
                    onClick={() => !isUploading && abrirSelector(p.id_producto)}
                    title="Haz clic para subir o cambiar imagen"
                  >
                    {isUploading && (
                      <div className="img-overlay">
                        <span className="img-spinner" />
                      </div>
                    )}

                    {hasImg && !hasError ? (
                      <img
                        src={preview || imgUrl(p.id_producto, ts)}
                        alt={p.nombre_producto}
                        className="producto-img"
                        onError={() => setImgError(prev => ({ ...prev, [p.id_producto]: true }))}
                      />
                    ) : (
                      <div className="producto-img-placeholder">
                        <span className="img-placeholder-icon">📷</span>
                        <span className="img-placeholder-text">Subir imagen</span>
                      </div>
                    )}

                    {/* Edit badge */}
                    {!isUploading && (
                      <div className="img-edit-badge">✏️</div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="producto-info">
                    <div className="fw-bold mb-1" style={{ fontSize: 14 }}>{p.nombre_producto}</div>
                    <div className="text-muted small mb-2">
                      <span title="Código de barras">#{p.codigo_barras}</span>
                    </div>
                    <div className="producto-footer mt-auto">
                      <span className="producto-precio">${parseFloat(p.precio_venta).toFixed(2)}</span>
                      <span className="producto-stock">Stock: {p.stock}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal para Crear Producto */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box text-start" style={{ width: 500 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="modal-title m-0">Agregar Nuevo Producto</h5>
              <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
            </div>
            
            <form onSubmit={handleCrearProducto}>
              <div className="mb-3">
                <label className="form-label">Código de Barras</label>
                <input type="text" className="form-control" required 
                  value={nuevoProd.codigo_barras} 
                  onChange={e => setNuevoProd({...nuevoProd, codigo_barras: e.target.value})} 
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Nombre del Producto</label>
                <input type="text" className="form-control" required 
                  value={nuevoProd.nombre_producto} 
                  onChange={e => setNuevoProd({...nuevoProd, nombre_producto: e.target.value})} 
                />
              </div>
              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Precio Venta ($)</label>
                  <input type="number" step="0.01" className="form-control" required 
                    value={nuevoProd.precio_venta} 
                    onChange={e => setNuevoProd({...nuevoProd, precio_venta: e.target.value})} 
                  />
                </div>
                <div className="col">
                  <label className="form-label">Stock Inicial</label>
                  <input type="number" className="form-control" required 
                    value={nuevoProd.stock} 
                    onChange={e => setNuevoProd({...nuevoProd, stock: e.target.value})} 
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col">
                  <label className="form-label">Categoría</label>
                  <select className="form-select" required
                    value={nuevoProd.id_categoria}
                    onChange={e => setNuevoProd({...nuevoProd, id_categoria: e.target.value})}
                  >
                    <option value="">Seleccione...</option>
                    {categorias.map(c => (
                      <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Proveedor</label>
                  <select className="form-select" required
                    value={nuevoProd.id_proveedor}
                    onChange={e => setNuevoProd({...nuevoProd, id_proveedor: e.target.value})}
                  >
                    <option value="">Seleccione...</option>
                    {proveedores.map(p => (
                      <option key={p.id_proveedor} value={p.id_proveedor}>{p.razon_social}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary fw-bold" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary fw-bold">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
