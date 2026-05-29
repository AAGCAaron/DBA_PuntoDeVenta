import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

// Asigna un emoji de empresa según el índice para darle personalidad
const EMOJIS = ['🏭','🚚','🏪','🏢','🏬','🛒','🏗️','🧴','🍫','🐾']

export default function Proveedores() {
  const { usuario, isAdmin } = useAuth()
  const [proveedores, setProveedores] = useState([])
  const [busqueda, setBusqueda] = useState('')

  // Modal Form State
  const [modalVisible, setModalVisible] = useState(false)
  const [proveedorEditando, setProveedorEditando] = useState(null)
  const [formData, setFormData] = useState({ razon_social: '', rfc: '', telefono_contacto: '', correo_contacto: '' })

  // Modal Delete State
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false)
  const [proveedorAEliminar, setProveedorAEliminar] = useState(null)

  function cargarProveedores() {
    api.get('/proveedores/')
      .then(({ data }) => setProveedores(data))
      .catch(() => alert('Error al cargar proveedores'))
  }

  useEffect(() => {
    cargarProveedores()
  }, [])

  function abrirModal(proveedor = null) {
    if (proveedor) {
      setProveedorEditando(proveedor)
      setFormData({ 
        razon_social: proveedor.razon_social, 
        rfc: proveedor.rfc || '', 
        telefono_contacto: proveedor.telefono_contacto || '',
        correo_contacto: proveedor.correo_contacto || ''
      })
    } else {
      setProveedorEditando(null)
      setFormData({ razon_social: '', rfc: '', telefono_contacto: '', correo_contacto: '' })
    }
    setModalVisible(true)
  }

  function guardarProveedor(e) {
    e.preventDefault()
    if (!formData.razon_social || !formData.rfc || !formData.telefono_contacto) {
      alert('Razón social, RFC y Teléfono son obligatorios')
      return
    }

    const payload = { ...formData }
    const req = proveedorEditando 
      ? api.put(`/proveedores/${proveedorEditando.id_proveedor}`, payload)
      : api.post('/proveedores/', payload)

    req.then(() => {
      cargarProveedores()
      setModalVisible(false)
    }).catch(err => {
      alert('Error al guardar: ' + (err.response?.data?.detail || 'Revisa que el RFC no esté duplicado.'))
    })
  }

  function confirmarEliminarProveedor(id, nombre) {
    setProveedorAEliminar({ id, nombre })
    setModalEliminarVisible(true)
  }

  function ejecutarEliminar() {
    if (!proveedorAEliminar) return
    api.delete(`/proveedores/${proveedorAEliminar.id}`)
      .then(() => {
        cargarProveedores()
        setModalEliminarVisible(false)
      })
      .catch(() => alert('Error al eliminar el proveedor (quizá tiene productos ligados).'))
  }

  const filtrados = proveedores.filter(p =>
    p.razon_social.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.rfc.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="page-title mb-1">🏭 Proveedores</h2>
          <p className="page-subtitle mb-0">{proveedores.length} proveedor{proveedores.length !== 1 ? 'es' : ''} registrado{proveedores.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 260 }}
            placeholder="🔍 Buscar proveedor..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {isAdmin && <button className="btn btn-primary" onClick={() => abrirModal()}>+ Nuevo</button>}
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="list-empty">Sin proveedores que coincidan 😴</p>
      ) : (
        <div className="row g-3">
          {filtrados.map((p, i) => (
            <div key={p.id_proveedor} className="col-12 col-sm-6 col-md-4">
              <div className="glass-container p-4 h-100">
                {/* Icono + nombre */}
                <div className="d-flex align-items-center mb-4">
                  <div className="catalog-icon me-3">🏢</div>
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1" style={{ fontSize: 16 }}>{p.razon_social}</h5>
                    <span className="badge glass-badge" style={{ fontSize: 11 }}>ID #{p.id_proveedor}</span>
                  </div>
                  {isAdmin && (
                    <>
                      <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => abrirModal(p)} title="Editar">
                        ✏️
                      </button>
                      <button className="btn btn-sm btn-outline-danger ms-1" onClick={() => confirmarEliminarProveedor(p.id_proveedor, p.razon_social)} title="Eliminar">
                        ✕
                      </button>
                    </>
                  )}
                </div>

                {/* Info rows */}
                <div className="catalog-info-row">
                  <span className="catalog-info-label">🪪 RFC</span>
                  <span className="catalog-info-value">{p.rfc}</span>
                </div>
                {p.telefono_contacto && (
                  <div className="catalog-info-row">
                    <span className="catalog-info-label">📞 Teléfono</span>
                    <span className="catalog-info-value">{p.telefono_contacto}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Formulario */}
      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-box text-start" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title mb-4">{proveedorEditando ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h3>
            <form onSubmit={guardarProveedor}>
              <div className="mb-3">
                <label className="form-label">Razón Social *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.razon_social}
                  onChange={e => setFormData({...formData, razon_social: e.target.value})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">RFC *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  maxLength={13}
                  value={formData.rfc}
                  onChange={e => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Teléfono *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  maxLength={20}
                  value={formData.telefono_contacto}
                  onChange={e => setFormData({...formData, telefono_contacto: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-control" 
                  value={formData.correo_contacto}
                  onChange={e => setFormData({...formData, correo_contacto: e.target.value})}
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalVisible(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {modalEliminarVisible && (
        <div className="modal-overlay" onClick={() => setModalEliminarVisible(false)}>
          <div className="modal-box text-center" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 className="modal-title mb-3 text-danger">⚠️ Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar al proveedor <strong>{proveedorAEliminar?.nombre}</strong>?</p>
            <p className="text-muted" style={{ fontSize: 13 }}>Esta acción no se puede deshacer.</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-secondary" onClick={() => setModalEliminarVisible(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={ejecutarEliminar}>Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
