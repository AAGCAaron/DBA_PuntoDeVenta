import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function imgUrl(id) {
  return `${API_BASE}/productos/${id}/imagen`
}

export default function NuevaVenta() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [ventaRegistrada, setVentaRegistrada] = useState(null) // { id_venta, total }

  useEffect(() => {
    api.get('/productos/').then(({ data }) => setProductos(data)).catch(() => {})
  }, [])

  function agregarProducto(producto) {
    setCarrito(prev => {
      const existe = prev.find(i => i.id_producto === producto.id_producto)
      if (existe) {
        return prev.map(i =>
          i.id_producto === producto.id_producto ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  function quitarProducto(id) {
    setCarrito(prev => prev.filter(i => i.id_producto !== id))
  }

  const total = carrito.reduce((acc, i) => acc + i.cantidad * parseFloat(i.precio_venta), 0)

  async function procesarVenta() {
    if (carrito.length === 0) { alert('El carrito está vacío'); return }
    const body = {
      id_usuario: 1,
      detalle: carrito.map(i => ({
        id_producto: i.id_producto,
        cantidad: i.cantidad,
        precio_unitario: parseFloat(i.precio_venta),
      })),
    }
    try {
      const { data } = await api.post('/ventas/', body)
      setVentaRegistrada({ id_venta: data.id_venta, total: parseFloat(data.monto_total) })
      setCarrito([])
    } catch (e) {
      alert(e.response?.data?.detail || 'No se pudo registrar la venta')
    }
  }

  function descargar(formato) {
    if (!ventaRegistrada) return
    const url = `${API_BASE}/ventas/${ventaRegistrada.id_venta}/factura.${formato}`
    // Open in new tab — browser will trigger the download via Content-Disposition header
    window.open(url, '_blank')
  }

  function cerrarModal() {
    setVentaRegistrada(null)
    navigate('/')
  }

  const filtrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <>
      <h2 className="page-title">Nueva Venta</h2>
      <div className="pos-layout">
        <div className="pos-products">
          <input
            className="input"
            style={{ marginBottom: 12 }}
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
          <div className="row g-2">
            {filtrados.map(p => (
              <div key={p.id_producto} className="col-6 col-sm-4 col-md-3 col-xl-2">
                <div 
                  className="producto-card h-100" 
                  onClick={() => agregarProducto(p)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="producto-img-wrap" style={{ borderBottom: 'none' }}>
                    {p.tiene_imagen ? (
                      <img
                        src={imgUrl(p.id_producto)}
                        alt={p.nombre_producto}
                        className="producto-img"
                        onError={(e) => { e.target.style.display='none' }}
                      />
                    ) : (
                      <div className="producto-img-placeholder">
                        <span className="img-placeholder-icon" style={{ fontSize: 24 }}>📷</span>
                      </div>
                    )}
                  </div>
                  <div className="producto-info" style={{ padding: '8px' }}>
                    <div className="fw-bold mb-1 text-truncate" style={{ fontSize: 12 }} title={p.nombre_producto}>
                      {p.nombre_producto}
                    </div>
                    <div className="producto-precio mt-auto" style={{ fontSize: 13 }}>
                      ${parseFloat(p.precio_venta).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtrados.length === 0 && <p className="list-empty">Sin productos</p>}
        </div>

        <div className="pos-cart">
          <h3 style={{ fontWeight: 'bold', marginBottom: 12, fontSize: 15 }}>Carrito</h3>
          <div className="cart-items">
            {carrito.length === 0 && (
              <p className="list-empty" style={{ padding: '20px 0' }}>Vacío</p>
            )}
            {carrito.map(i => (
              <div key={i.id_producto} className="cart-row">
                <span className="cart-name">{i.nombre_producto} ×{i.cantidad}</span>
                <span className="cart-price">${(i.cantidad * parseFloat(i.precio_venta)).toFixed(2)}</span>
                <button className="cart-remove" onClick={() => quitarProducto(i.id_producto)}>✕</button>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div className="cart-total">Total: ${total.toFixed(2)}</div>
            <button className="btn btn-primary btn-block" onClick={procesarVenta}>Cobrar</button>
          </div>
        </div>
      </div>

      {/* ─── Modal de descarga de factura ─────────────────────────────────── */}
      {ventaRegistrada && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">✅</div>
            <h3 className="modal-title">¡Venta registrada!</h3>
            <p className="modal-sub">
              Folio <strong>#{String(ventaRegistrada.id_venta).padStart(6, '0')}</strong>
              &nbsp;·&nbsp;
              Total: <strong>${ventaRegistrada.total.toFixed(2)}</strong>
            </p>
            <p className="modal-desc">
              El comprobante se guardó en la base de datos.<br />
              Elige el formato para descargar tu factura:
            </p>

            <div className="modal-actions">
              <button
                className="btn btn-download btn-pdf"
                onClick={() => descargar('pdf')}
              >
                📄 Descargar PDF
              </button>
              <button
                className="btn btn-download btn-xml"
                onClick={() => descargar('xml')}
              >
                🗂️ Descargar XML
              </button>
            </div>

            <button className="modal-close" onClick={cerrarModal}>
              Cerrar y volver al inicio
            </button>
          </div>
        </div>
      )}
    </>
  )
}
