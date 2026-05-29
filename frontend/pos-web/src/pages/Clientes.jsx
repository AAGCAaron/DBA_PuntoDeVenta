import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

// Genera un avatar con las iniciales del cliente
function Avatar({ nombre }) {
  if (!nombre) return null
  const initials = String(nombre)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  // Paleta de colores suaves para el fondo del avatar
  const COLORS = [
    'rgba(129,140,248,0.35)', 'rgba(52,211,153,0.35)',
    'rgba(251,191,36,0.35)',  'rgba(248,113,113,0.35)',
    'rgba(196,181,253,0.35)', 'rgba(103,232,249,0.35)',
  ]
  const color = COLORS[initials.charCodeAt(0) % COLORS.length]

  return (
    <div style={{
      width: 46, height: 46, borderRadius: 12,
      background: color,
      border: '1px solid rgba(255,255,255,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 16, color: '#fff',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export default function Clientes() {
  const { usuario } = useAuth()
  // Modal Form State
  const [modalVisible, setModalVisible] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [formData, setFormData] = useState({ nombre_completo: '', rfc: '', correo_electronico: '' })

  // Modal Delete State
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false)
  const [clienteAEliminar, setClienteAEliminar] = useState(null)

  function cargarClientes() {
    api.get('/clientes/')
      .then(({ data }) => setClientes(data))
      .catch(() => alert('Error al cargar clientes'))
  }

  useEffect(() => {
    cargarClientes()
  }, [])

  function abrirModal(cliente = null) {
    if (cliente) {
      setClienteEditando(cliente)
      setFormData({ 
        nombre_completo: cliente.nombre_completo, 
        rfc: cliente.rfc || '', 
        correo_electronico: cliente.correo_electronico || '' 
      })
    } else {
      setClienteEditando(null)
      setFormData({ nombre_completo: '', rfc: '', correo_electronico: '' })
    }
    setModalVisible(true)
  }

  function guardarCliente(e) {
    e.preventDefault()
    if (!formData.nombre_completo || !formData.rfc) {
      alert('Nombre y RFC son obligatorios')
      return
    }

    const payload = { ...formData }
    const req = clienteEditando 
      ? api.put(`/clientes/${clienteEditando.id_cliente}`, payload)
      : api.post('/clientes/', payload)

    req.then(() => {
      cargarClientes()
      setModalVisible(false)
    }).catch(err => {
      alert('Error al guardar: ' + (err.response?.data?.detail || 'Verifica que el RFC no esté repetido.'))
    })
  }

  function confirmarEliminarCliente(id, nombre) {
    setClienteAEliminar({ id, nombre })
    setModalEliminarVisible(true)
  }

  function ejecutarEliminar() {
    if (!clienteAEliminar) return
    api.delete(`/clientes/${clienteAEliminar.id}`)
      .then(() => {
        cargarClientes()
        setModalEliminarVisible(false)
      })
      .catch(() => alert('No se puede eliminar porque tiene ventas registradas en el historial.'))
  }

  const filtrados = clientes.filter(c =>
    (c.nombre_completo || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.rfc || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.correo_electronico || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  const esPublicoGeneral = (c) => c.rfc === 'XAXX010101000'

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="page-title mb-1">👤 Clientes</h2>
          <p className="page-subtitle mb-0">{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} registrado{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 260 }}
            placeholder="🔍 Buscar cliente..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => abrirModal()}>+ Nuevo</button>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <p className="list-empty">Sin clientes que coincidan 😴</p>
      ) : (
        <div className="row g-3">
          {filtrados.map(c => (
            <div key={c.id_cliente} className="col-12 col-sm-6 col-md-4">
              <div className="glass-container p-4 h-100">
                {/* Header (Avatar + Name) */}
                <div className="d-flex align-items-center mb-4">
                  <Avatar nombre={c.nombre_completo} />
                  <div className="flex-grow-1 ms-3">
                    <h5 className="fw-bold mb-1" style={{ fontSize: 16 }}>{c.nombre_completo}</h5>
                    <span className="badge glass-badge" style={{ fontSize: 11 }}>ID #{c.id_cliente}</span>
                  </div>
                  <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => abrirModal(c)} title="Editar">
                    ✏️
                  </button>
                  <button className="btn btn-sm btn-outline-danger ms-1" onClick={() => confirmarEliminarCliente(c.id_cliente, c.nombre_completo)} title="Eliminar">
                    ✕
                  </button>
                </div>

                {/* Info rows */}
                {c.rfc && (
                  <div className="catalog-info-row">
                    <span className="catalog-info-label">🪪 RFC</span>
                    <span className="catalog-info-value">{c.rfc}</span>
                  </div>
                )}
                {c.correo_electronico && (
                  <div className="catalog-info-row">
                    <span className="catalog-info-label">✉️ Email</span>
                    <span className="catalog-info-value" style={{ fontSize: 12 }}>{c.correo_electronico}</span>
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
            <h3 className="modal-title mb-4">{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
            <form onSubmit={guardarCliente}>
              <div className="mb-3">
                <label className="form-label">Nombre Completo *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.nombre_completo}
                  onChange={e => setFormData({...formData, nombre_completo: e.target.value})}
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
              <div className="mb-4">
                <label className="form-label">Correo Electrónico *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  required
                  value={formData.correo_electronico}
                  onChange={e => setFormData({...formData, correo_electronico: e.target.value})}
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
            <p>¿Estás seguro de que deseas eliminar a <strong>{clienteAEliminar?.nombre}</strong>?</p>
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
