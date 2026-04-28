import React, { createContext, useState, useContext } from 'react'
import api from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const token = localStorage.getItem('access_token')
    const nombre = localStorage.getItem('nombre_usuario')
    return token && nombre ? { nombre_usuario: nombre } : null
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
    setUsuario({ nombre_usuario })
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('nombre_usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
