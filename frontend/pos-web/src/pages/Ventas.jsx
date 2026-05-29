import React, { useEffect, useState } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function Ventas() {
  const { usuario } = useAuth()
  const [ventas, setVentas] = useState([])
  const [busqueda, setBusqueda] = useState('')

  // Modal Delete State
  const [modalCancelarVisible, setModalCancelarVisible] = useState(false)
  const [ventaACancelar, setVentaACancelar] = useState(null)

  function cargarVentas() {
    api.get('/ventas/')
      .then(({ data }) => setVentas(data))
      .catch(() => alert('Error al cargar ventas'))
  }

  useEffect(() => {
    cargarVentas()
  }, [])

  function confirmarCancelarVenta(id) {
    setVentaACancelar(id)
    setModalCancelarVisible(true)
  }

  function ejecutarCancelar() {
    if (!ventaACancelar) return
    api.delete(`/ventas/${ventaACancelar}`)
      .then(() => {
        alert('Venta cancelada exitosamente')
        cargarVentas()
        setModalCancelarVisible(false)
      })
      .catch(err => alert('Error al cancelar la venta'))
  }

  const filtradas = ventas.filter(v =>
    String(v.id_venta).includes(busqueda) ||
    new Date(v.fecha_hora).toLocaleDateString().includes(busqueda)
  )

  // Invertir para mostrar las más recientes primero
  const ventasDesc = [...filtradas].reverse()

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="page-title mb-1">📋 Historial de Ventas</h2>
          <p className="page-subtitle mb-0">{ventas.length} venta{ventas.length !== 1 ? 's' : ''} registrada{ventas.length !== 1 ? 's' : ''}</p>
        </div>
        <input
          className="form-control"
          style={{ maxWidth: 260 }}
          placeholder="🔍 Buscar por folio o fecha..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {ventasDesc.length === 0 ? (
        <p className="list-empty">Sin ventas registradas 😴</p>
      ) : (
        <div className="row g-3">
          {ventasDesc.map(v => (
            <div key={v.id_venta} className="col-12 col-sm-6 col-md-4">
              <div className="glass-container p-4 h-100 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge glass-badge mb-2">Folio #{String(v.id_venta).padStart(6, '0')}</span>
                    <div className="fw-bold" style={{ fontSize: 22 }}>
                      ${Number(v.monto_total).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ fontSize: 32 }}>🧾</div>
                </div>

                <div className="catalog-info-row mt-auto">
                  <span className="catalog-info-label">📅 Fecha</span>
                  <span className="catalog-info-value">{new Date(v.fecha_hora).toLocaleDateString()} {new Date(v.fecha_hora).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>

                {v.tiene_factura ? (
                  <div className="mt-3 pt-3 border-top border-light border-opacity-25 d-flex justify-content-between align-items-center">
                    <span className="badge bg-success bg-opacity-75 text-white" style={{ fontSize: 12 }}>✓ Factura generada</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => confirmarCancelarVenta(v.id_venta)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-top border-light border-opacity-25 d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary bg-opacity-50 text-white" style={{ fontSize: 12 }}>Sin factura</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => confirmarCancelarVenta(v.id_venta)}>
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Confirmar Cancelación */}
      {modalCancelarVisible && (
        <div className="modal-overlay" onClick={() => setModalCancelarVisible(false)}>
          <div className="modal-box text-center" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3 className="modal-title mb-3 text-danger">⚠️ Cancelar Venta</h3>
            <p>¿Estás seguro de que deseas marcar la venta <strong>#{ventaACancelar}</strong> como error y eliminarla?</p>
            <p className="text-muted" style={{ fontSize: 13 }}>Esta acción devolverá el stock a los productos y borrará el historial.</p>
            <div className="d-flex justify-content-center gap-2 mt-4">
              <button className="btn btn-secondary" onClick={() => setModalCancelarVisible(false)}>Regresar</button>
              <button className="btn btn-danger" onClick={ejecutarCancelar}>Sí, Cancelar Venta</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
