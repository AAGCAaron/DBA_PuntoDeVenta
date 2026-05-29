import React, { createContext, useState, useContext } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return {}
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('access_token')
    const nombre = localStorage.getItem('nombre_usuario')
    if (token && nombre) {
      const payload = parseJwt(token)
      return {
        nombre_usuario: nombre,
        id_usuario: payload.sub ? parseInt(payload.sub) : null,
        rol: payload.rol || 'Cajero',
      }
    }
    return null
  })

  async function login(nombre_usuario, password) {
    const form = new URLSearchParams()
    form.append('username', nombre_usuario)
    form.append('password', password)
    const { data } = await api.post('/auth/login', form.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('nombre_usuario', nombre_usuario)
    const payload = parseJwt(data.access_token)
    setUsuario({
      nombre_usuario,
      id_usuario: payload.sub ? parseInt(payload.sub) : null,
      rol: payload.rol || 'Cajero',
    })
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('nombre_usuario')
    setUsuario(null)
  }

  const isAdmin = usuario?.rol?.toLowerCase() === 'admin'

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
