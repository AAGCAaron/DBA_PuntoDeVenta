import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Productos() {
  const [productos, setProductos] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    api.get('/productos/')
      .then(({ data }) => setProductos(data))
      .catch(() => alert('Error al cargar productos'))
  }, [])

  const filtrados = productos.filter(p =>
    p.nombre_producto.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  )

  return (
    <>
      <h2 className="page-title">Productos</h2>
      <input
        className="input"
        style={{ marginBottom: 16 }}
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />
      {filtrados.length === 0 ? (
        <p className="list-empty">Sin productos</p>
      ) : (
        filtrados.map(p => (
          <div key={p.id_producto} className="card" style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div className="card-title">{p.nombre_producto}</div>
              <div className="card-sub">
                Código: {p.codigo_barras} &nbsp;|&nbsp; Stock: {p.stock} &nbsp;|&nbsp; Precio: ${p.precio_venta}
              </div>
            </div>
            {p.tiene_imagen && <span style={{ fontSize: 22 }}>🖼️</span>}
          </div>
        ))
      )}
    </>
  )
}
