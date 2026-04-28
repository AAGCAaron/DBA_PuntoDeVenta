import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MODULOS = [
  { label: 'Nueva Venta', to: '/nueva-venta', emoji: '🛒' },
  { label: 'Productos', to: '/productos', emoji: '📦' },
  { label: 'Clientes', to: '/clientes', emoji: '👤' },
  { label: 'Proveedores', to: '/proveedores', emoji: '🏭' },
  { label: 'Categorías', to: '/categorias', emoji: '🏷️' },
  { label: 'Historial Ventas', to: '/ventas', emoji: '📋' },
]

export default function Home() {
  const { usuario } = useAuth()
  return (
    <>
      <h2 className="page-title">Bienvenido, {usuario?.nombre_usuario}</h2>
      <div className="module-grid">
        {MODULOS.map(m => (
          <Link key={m.to} to={m.to} className="module-card">
            <span className="module-emoji">{m.emoji}</span>
            <span className="module-label">{m.label}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
