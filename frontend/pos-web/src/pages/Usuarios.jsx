import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Usuarios() {
  const { usuario, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])

  // Modal Delete State
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)

  // Modal Form State
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [formData, setFormData] = useState({ nombre_usuario: '', password: '', rol: 'cajero' })

  // Security check: only admin can view this page
  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
    }
  }, [isAdmin, navigate])

  function cargarUsuarios() {
    api.get('/usuarios/')
      .then(({ data }) => setUsuarios(data))
      .catch(() => alert('Error al cargar usuarios'))
  }

  useEffect(() => {
    if (isAdmin) cargarUsuarios()
  }, [isAdmin])

  function abrirModalForm(u = null) {
    if (u) {
      if (u.id_usuario === usuario.id_usuario) {
        alert('No puedes cambiar tu propio rol.')
        return
      }
      setUsuarioEditando(u)
      setFormData({ nombre_usuario: u.nombre_usuario, password: '', rol: u.rol })
    } else {
      setUsuarioEditando(null)
      setFormData({ nombre_usuario: '', password: '', rol: 'cajero' })
    }
    setModalFormVisible(true)
  }

  function guardarUsuario(e) {
    e.preventDefault()
    
    if (usuarioEditando) {
      // Editar rol
      api.put(`/usuarios/${usuarioEditando.id_usuario}/rol?rol=${formData.rol}`)
        .then(() => {
          alert('Rol y estado actualizado exitosamente en la base de datos.')
          cargarUsuarios()
          setModalFormVisible(false)
        })
        .catch(() => alert('Error al cambiar rol'))
    } else {
      // Crear nuevo
      if (!formData.nombre_usuario || !formData.password) {
        alert('Usuario y contraseña son requeridos')
        return
      }
      api.post('/usuarios/', formData)
        .then(() => {
          alert('Nuevo trabajador registrado exitosamente en la base de datos.')
          cargarUsuarios()
          setModalFormVisible(false)
        })
        .catch((err) => alert(err.response?.data?.detail || 'Error al agregar'))
    }
  }

  function confirmarEliminarUsuario(id, nombre) {
    if (id === usuario.id_usuario) {
      alert('No puedes eliminar tu propio usuario en sesión.')
      return
    }
    setUsuarioAEliminar({ id, nombre })
    setModalEliminarVisible(true)
  }

  function ejecutarEliminar() {
    if (!usuarioAEliminar) return
    api.delete(`/usuarios/${usuarioAEliminar.id}`)
      .then(() => {
        cargarUsuarios()
        setModalEliminarVisible(false)
      })
      .catch(() => alert('No se puede eliminar (quizá tiene ventas ligadas)'))
  }

  const activos = usuarios.filter(u => u.rol?.toLowerCase() !== 'inactivo')
  const inactivos = usuarios.filter(u => u.rol?.toLowerCase() === 'inactivo')

  if (!isAdmin) return null

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="page-title mb-1">👥 Usuarios del Sistema</h2>
          <p className="page-subtitle mb-0">Gestión de accesos y roles (Solo Administrador)</p>
        </div>
        <button className="btn btn-primary" onClick={() => abrirModalForm()}>+ Nuevo Usuario</button>
      </div>

      {/* Usuarios Activos */}
      <h4 className="mb-3" style={{ color: '#fff' }}>Usuarios Activos</h4>
      <div className="row g-3 mb-5">
        {activos.map(u => (
          <div key={u.id_usuario} className="col-12 col-md-6 col-lg-4">
            <div className="glass-container p-4 h-100 d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <div className="catalog-icon me-3 text-white fw-bold" style={{ background: u.rol?.toLowerCase() === 'admin' ? '#ef4444' : '#3b82f6' }}>
                  {u.nombre_usuario.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1">
                  <h5 className="fw-bold mb-1" style={{ fontSize: 16 }}>{u.nombre_usuario}</h5>
                  <span className={`badge ${u.rol?.toLowerCase() === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                    {u.rol?.toLowerCase() === 'admin' ? 'Admin' : 'Cajero'}
                  </span>
                </div>
                <button 
                  className="btn btn-sm btn-outline-danger ms-2" 
                  onClick={() => confirmarEliminarUsuario(u.id_usuario, u.nombre_usuario)}
                  title="Eliminar usuario"
                >
                  ✕
                </button>
              </div>

              <div className="mt-auto pt-3 border-top border-dark border-opacity-10 text-center">
                <button 
                  className="btn btn-sm btn-outline-secondary w-100" 
                  onClick={() => abrirModalForm(u)}
                >
                  Cambiar Rol o Desactivar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Usuarios Inactivos (Bajas) */}
      {inactivos.length > 0 && (
        <>
          <h4 className="mb-3 text-muted">Ex Empleados (Inactivos)</h4>
          <div className="glass-container p-3">
            <div className="table-responsive">
              <table className="table table-sm table-borderless mb-0 align-middle" style={{ color: 'var(--text-dark)' }}>
                <tbody>
                  {inactivos.map(u => (
                    <tr key={u.id_usuario} className="border-bottom border-secondary border-opacity-25">
                      <td style={{ width: '40px' }}>
                        <div className="catalog-icon text-white bg-secondary" style={{ width: 32, height: 32, fontSize: 14 }}>
                          {u.nombre_usuario.charAt(0).toUpperCase()}
                        </div>
                      </td>
                      <td className="fw-bold">{u.nombre_usuario}</td>
                      <td><span className="badge bg-secondary">Inactivo</span></td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => abrirModalForm(u)}>Reactivar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => confirmarEliminarUsuario(u.id_usuario, u.nombre_usuario)}>✕</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal Confirmar Eliminación */}
      {modalEliminarVisible && (
        <div className="modal-overlay" onClick={() => setModalEliminarVisible(false)}>
          <div className="modal-box text-center" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <h3 className="modal-title mb-3 text-danger">⚠️ Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar permanentemente a <strong>{usuarioAEliminar?.nombre}</strong>?</p>
            <p className="text-muted" style={{ fontSize: 13 }}>Esta acción no se puede deshacer.</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-secondary" onClick={() => setModalEliminarVisible(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={ejecutarEliminar}>Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Formulario Usuario */}
      {modalFormVisible && (
        <div className="modal-overlay" onClick={() => setModalFormVisible(false)}>
          <div className="modal-box text-start" onClick={e => e.stopPropagation()} style={{ maxWidth: 450 }}>
            <h3 className="modal-title mb-4">{usuarioEditando ? 'Asignar Nuevo Rol' : 'Dar de Alta Nuevo Trabajador'}</h3>
            <form onSubmit={guardarUsuario}>
              
              {!usuarioEditando && (
                <>
                  <div className="alert alert-info py-2" style={{ fontSize: 13 }}>
                    Estás creando un nuevo usuario. Estos serán los datos con los que esta persona iniciará sesión.
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Nombre de usuario para esta persona *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      required 
                      placeholder="Ej. JuanPerez"
                      value={formData.nombre_usuario}
                      onChange={e => setFormData({...formData, nombre_usuario: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Asignar una contraseña *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      required 
                      placeholder="Escribe la contraseña para el nuevo usuario"
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </>
              )}

              {usuarioEditando && (
                <div className="mb-4">
                  <h5 className="fw-bold text-primary">{usuarioEditando.nombre_usuario}</h5>
                  <p className="text-muted small">Selecciona el nuevo rol para este usuario.</p>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label d-block mb-3">Nivel de Acceso</label>
                
                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="rol" id="rolCajero" 
                    checked={formData.rol === 'cajero'} onChange={() => setFormData({...formData, rol: 'cajero'})} />
                  <label className="form-check-label fw-bold" htmlFor="rolCajero">🧑‍💼 Cajero</label>
                  <div className="text-muted small">Puede realizar ventas y registrar clientes.</div>
                </div>

                <div className="form-check mb-2">
                  <input className="form-check-input" type="radio" name="rol" id="rolAdmin" 
                    checked={formData.rol === 'admin'} onChange={() => setFormData({...formData, rol: 'admin'})} />
                  <label className="form-check-label fw-bold text-danger" htmlFor="rolAdmin">🔑 Administrador</label>
                  <div className="text-muted small">Control total del sistema e inventario.</div>
                </div>

                <div className="form-check mt-3 pt-3 border-top">
                  <input className="form-check-input" type="radio" name="rol" id="rolInactivo" 
                    checked={formData.rol === 'inactivo'} onChange={() => setFormData({...formData, rol: 'inactivo'})} />
                  <label className="form-check-label fw-bold text-secondary" htmlFor="rolInactivo">🚫 Inactivo (Baja)</label>
                  <div className="text-muted small">Revoca el acceso. Pasa al archivo muerto.</div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setModalFormVisible(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
