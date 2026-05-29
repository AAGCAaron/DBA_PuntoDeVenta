import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!usuario || !password) { setError('Completa todos los campos'); return }
    setCargando(true)
    setError('')
    try {
      await login(usuario, password)
      navigate('/')
    } catch {
      setError('Credenciales incorrectas. Revisa usuario y contraseña.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-box">
        {/* Logo / title */}
        <div className="text-center mb-4">
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 12 }}>🏪</div>
          <h1 className="login-title">POS Tiendita</h1>
          <p className="login-subtitle">Bases de Datos Avanzadas · UNAM FI</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on">
          <div className="mb-3">
            <label htmlFor="login-usuario" className="form-label">Usuario</label>
            <input
              id="login-usuario"
              className="form-control"
              placeholder="Ej. admin_carlos"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="login-password" className="form-label">Contraseña</label>
            <input
              id="login-password"
              className="form-control"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="error-msg">⚠️ {error}</p>}

          <button
            className="btn btn-primary w-100 py-2 mt-1"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? <><span className="spinner-border spinner-border-sm me-2" />Entrando...</>
              : '→ Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
