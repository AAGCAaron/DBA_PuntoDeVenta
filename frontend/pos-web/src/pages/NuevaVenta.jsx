import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function NuevaVenta() {
  const navigate = useNavigate()
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [busqueda, setBusqueda] = useState('')

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
      await api.post('/ventas/', body)
      alert(`Venta registrada. Total: $${total.toFixed(2)}`)
      setCarrito([])
      navigate('/')
    } catch (e) {
      alert(e.response?.data?.detail || 'No se pudo registrar la venta')
    }
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
          {filtrados.map(p => (
            <div key={p.id_producto} className="card prod-row" onClick={() => agregarProducto(p)}>
              <span>{p.nombre_producto}</span>
              <span className="prod-precio">${p.precio_venta}</span>
            </div>
          ))}
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
    </>
  )
}
