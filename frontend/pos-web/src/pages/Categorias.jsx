import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

// Emojis por categoría (coincide con las categorías semilla)
const CATEGORY_EMOJIS = {
  'abarrotes':          '🛒',
  'lácteos':            '🥛',
  'lacteos':            '🥛',
  'bebidas':            '🥤',
  'botanas':            '🍿',
  'dulcería':           '🍬',
  'dulceria':           '🍬',
  'limpieza':           '🧹',
  'higiene personal':   '🧴',
  'higiene':            '🧴',
  'panadería':          '🍞',
  'panaderia':          '🍞',
  'carnes':             '🥩',
  'mascotas':           '🐾',
}

function getCategoryEmoji(nombre) {
  const key = nombre.toLowerCase()
  for (const [k, v] of Object.entries(CATEGORY_EMOJIS)) {
    if (key.includes(k)) return v
  }
  return '🏷️'
}

// Paleta de gradientes para las tarjetas de categorías
const GRADIENTS = [
  'linear-gradient(135deg, rgba(224,231,255,0.95), rgba(199,210,254,0.85))', // Indigo
  'linear-gradient(135deg, rgba(209,250,229,0.95), rgba(167,243,208,0.85))', // Emerald
  'linear-gradient(135deg, rgba(254,243,199,0.95), rgba(253,230,138,0.85))', // Amber
  'linear-gradient(135deg, rgba(254,226,226,0.95), rgba(254,202,202,0.85))', // Red
  'linear-gradient(135deg, rgba(224,242,254,0.95), rgba(186,230,253,0.85))', // Light Blue
  'linear-gradient(135deg, rgba(252,231,243,0.95), rgba(251,207,232,0.85))', // Pink
  'linear-gradient(135deg, rgba(243,232,255,0.95), rgba(233,213,255,0.85))', // Purple
  'linear-gradient(135deg, rgba(255,237,213,0.95), rgba(254,215,170,0.85))', // Orange
  'linear-gradient(135deg, rgba(220,252,231,0.95), rgba(187,247,208,0.85))', // Green
  'linear-gradient(135deg, rgba(207,250,254,0.95), rgba(165,243,252,0.85))', // Cyan
]

export default function Categorias() {
  const { usuario, isAdmin } = useAuth()
  const [categorias, setCategorias] = useState([])
  const [busqueda, setBusqueda] = useState('')

  // Modal Form State
  const [modalVisible, setModalVisible] = useState(false)
  const [categoriaEditando, setCategoriaEditando] = useState(null)
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' })

  // Modal Delete State
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false)
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null)

  function cargarCategorias() {
    api.get('/categorias/')
      .then(({ data }) => setCategorias(data))
      .catch(() => alert('Error al cargar categorías'))
  }

  useEffect(() => {
    cargarCategorias()
  }, [])

  function abrirModal(categoria = null) {
    if (categoria) {
      setCategoriaEditando(categoria)
      setFormData({ 
        nombre: categoria.nombre, 
        descripcion: categoria.descripcion || '' 
      })
    } else {
      setCategoriaEditando(null)
      setFormData({ nombre: '', descripcion: '' })
    }
    setModalVisible(true)
  }

  function guardarCategoria(e) {
    e.preventDefault()
    if (!formData.nombre) {
      alert('El nombre es obligatorio')
      return
    }

    const payload = { ...formData }
    const req = categoriaEditando 
      ? api.put(`/categorias/${categoriaEditando.id_categoria}`, payload)
      : api.post('/categorias/', payload)

    req.then(() => {
      cargarCategorias()
      setModalVisible(false)
    }).catch(err => {
      alert('Error al guardar: ' + (err.response?.data?.detail || 'Revisa los datos'))
    })
  }

  function confirmarEliminarCategoria(id, nombre) {
    setCategoriaAEliminar({ id, nombre })
    setModalEliminarVisible(true)
  }

  function ejecutarEliminar() {
    if (!categoriaAEliminar) return
    api.delete(`/categorias/${categoriaAEliminar.id}`)
      .then(() => {
        cargarCategorias()
        setModalEliminarVisible(false)
      })
      .catch(() => alert('No se puede eliminar la categoría (quizá tiene productos ligados).'))
  }

  const filtradas = categorias.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.descripcion || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="page-title mb-1">🏷️ Categorías</h2>
          <p className="page-subtitle mb-0">{categorias.length} categoría{categorias.length !== 1 ? 's' : ''} registrada{categorias.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 260 }}
            placeholder="🔍 Buscar categoría..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          {isAdmin && <button className="btn btn-primary" onClick={() => abrirModal()}>+ Nueva</button>}
        </div>
      </div>

      {filtradas.length === 0 ? (
        <p className="list-empty">Sin categorías que coincidan 😴</p>
      ) : (
        <div className="row g-3">
          {filtradas.map((c, i) => (
            <div key={c.id_categoria} className="col-12 col-sm-6 col-md-4">
              <div
                className="glass-container p-4 h-100"
                style={{ background: GRADIENTS[i % GRADIENTS.length] }}
              >
                {/* Icono grande + nombre */}
                <div className="text-center mb-3 position-relative">
                  {isAdmin && (
                    <div className="position-absolute top-0 end-0 d-flex gap-1">
                      <button 
                        className="btn btn-sm btn-outline-primary" 
                        onClick={() => abrirModal(c)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => confirmarEliminarCategoria(c.id_categoria, c.nombre)}
                        title="Eliminar"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 10 }}>
                    {getCategoryEmoji(c.nombre)}
                  </div>
                  <h5 className="fw-bold mb-1" style={{ color: '#0f172a' }}>{c.nombre}</h5>
                  <span style={{
                    display: 'inline-block',
                    background: 'rgba(0,0,0,0.05)',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 8, padding: '2px 10px', fontSize: 11, color: '#475569',
                    fontWeight: 600
                  }}>
                    ID #{c.id_categoria}
                  </span>
                </div>

                {/* Descripción */}
                {c.descripcion && (
                  <p style={{
                    fontSize: 13, color: '#475569',
                    textAlign: 'center', margin: 0, lineHeight: 1.5,
                    fontWeight: 500
                  }}>
                    {c.descripcion}
                  </p>
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
            <h3 className="modal-title mb-4">{categoriaEditando ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            <form onSubmit={guardarCategoria}>
              <div className="mb-3">
                <label className="form-label">Nombre de Categoría *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  required 
                  value={formData.nombre}
                  onChange={e => setFormData({...formData, nombre: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="form-label">Descripción</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  value={formData.descripcion}
                  onChange={e => setFormData({...formData, descripcion: e.target.value})}
                ></textarea>
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
            <p>¿Estás seguro de que deseas eliminar la categoría <strong>{categoriaAEliminar?.nombre}</strong>?</p>
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
