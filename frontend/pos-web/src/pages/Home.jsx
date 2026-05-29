import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const MODULOS = [
  { label: 'Dashboard',      to: '/dashboard',    emoji: '📊', desc: 'Métricas y reportes' },
  { label: 'Nueva Venta',    to: '/nueva-venta',  emoji: '🛒', desc: 'Registrar una venta' },
  { label: 'Productos',      to: '/productos',    emoji: '📦', desc: 'Catálogo e imágenes' },
  { label: 'Clientes',       to: '/clientes',     emoji: '👤', desc: 'Directorio de clientes' },
  { label: 'Proveedores',    to: '/proveedores',  emoji: '🏭', desc: 'Gestión de proveedores' },
  { label: 'Categorías',     to: '/categorias',   emoji: '🏷️', desc: 'Clasificación de productos' },
  { label: 'Historial Ventas', to: '/ventas',     emoji: '📋', desc: 'Consultar transacciones' },
]

export default function Home() {
  const { usuario } = useAuth()
  const isAdmin = usuario?.rol === 'Admin'

  return (
    <>
      <div className="mb-4">
        <h2 className="page-title mb-1">
          👋 Bienvenido, {usuario?.nombre_usuario}
        </h2>
        <p className="page-subtitle">
          {isAdmin
            ? '🔑 Tienes acceso completo al sistema.'
            : '🧑‍💼 Panel de cajero — selecciona una opción para continuar.'}
        </p>
      </div>

      <div className="row g-3">
        {MODULOS.map(m => (
          <div key={m.to} className="col-12 col-sm-6 col-md-4">
            <Link to={m.to} className="module-card h-100 d-block">
              <span className="module-emoji">{m.emoji}</span>
              <span className="module-label">{m.label}</span>
              <span style={{ display: 'block', fontSize: 11, opacity: 0.8, marginTop: 4 }}>
                {m.desc}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
