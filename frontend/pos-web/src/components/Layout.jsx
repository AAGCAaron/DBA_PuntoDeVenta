import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/', label: 'Inicio', emoji: '🏠', end: true },
  { to: '/nueva-venta', label: 'Nueva Venta', emoji: '🛒' },
  { to: '/productos', label: 'Productos', emoji: '📦' },
  { to: '/ventas', label: 'Historial Ventas', emoji: '📋' },
  { to: '/clientes', label: 'Clientes', emoji: '👤' },
  { to: '/proveedores', label: 'Proveedores', emoji: '🏭' },
  { to: '/categorias', label: 'Categorías', emoji: '🏷️' },
]

export default function Layout() {
  const { usuario, logout } = useAuth()
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">POS Tiendita</div>
        {LINKS.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span>{l.emoji}</span> {l.label}
          </NavLink>
        ))}
        <div className="sidebar-footer">
          <div className="sidebar-user">{usuario?.nombre_usuario}</div>
          <button
            className="btn btn-ghost"
            style={{ color: '#ffcdd2', padding: '8px 0', fontSize: 14 }}
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
