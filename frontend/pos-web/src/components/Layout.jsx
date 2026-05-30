import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LINKS = [
  { to: '/',             label: 'Inicio',          emoji: '🏠', end: true },
  { to: '/dashboard',    label: 'Dashboard',        emoji: '📊' },
  { to: '/nueva-venta',  label: 'Nueva Venta',      emoji: '🛒' },
  { to: '/productos',    label: 'Productos',         emoji: '📦' },
  { to: '/ventas',       label: 'Historial Ventas',  emoji: '📋' },
  { to: '/clientes',     label: 'Clientes',          emoji: '👤' },
  { to: '/proveedores',  label: 'Proveedores',       emoji: '🏭' },
  { to: '/categorias',   label: 'Categorías',        emoji: '🏷️' },
  { to: '/multimedia',   label: 'Multimedia',        emoji: '📼' },
]

export default function Layout() {
  const { usuario, logout } = useAuth()
  const isAdmin = usuario?.rol?.toLowerCase() === 'admin'

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* ─── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          🏪 POS Tiendita
          <div className="mt-2">
            <span className={`badge ${isAdmin ? 'bg-warning text-dark' : 'bg-secondary'}`}
              style={{ fontSize: 11 }}>
              {isAdmin ? '🔑 Admin' : '🧑‍💼 Cajero'}
            </span>
          </div>
        </div>

        <nav className="flex-grow-1 mt-1">
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `sidebar-nav-link${isActive ? ' active' : ''}`
              }
            >
              <span style={{ fontSize: 18 }}>{l.emoji}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                `sidebar-nav-link${isActive ? ' active' : ''}`
              }
            >
              <span style={{ fontSize: 18 }}>👥</span>
              <span>Usuarios</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="mb-2" style={{ color: 'var(--text-muted-d)', fontSize: 13 }}>
            👤 {usuario?.nombre_usuario}
          </div>
          <button className="btn btn-sm btn-outline-danger w-100" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ─── Main content ────────────────────────────────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
