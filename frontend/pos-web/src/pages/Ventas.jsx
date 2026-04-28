import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Ventas() {
  const [ventas, setVentas] = useState([])

  useEffect(() => {
    api.get('/ventas/')
      .then(({ data }) => setVentas(data))
      .catch(() => alert('Error al cargar ventas'))
  }, [])

  return (
    <>
      <h2 className="page-title">Historial de Ventas</h2>
      {ventas.length === 0 ? (
        <p className="list-empty">Sin ventas registradas</p>
      ) : (
        ventas.map(v => (
          <div key={v.id_venta} className="card">
            <div className="card-title">Folio #{v.id_venta}</div>
            <div className="card-sub">{new Date(v.fecha_hora).toLocaleString()}</div>
            <div style={{ color: '#1a73e8', fontWeight: 'bold', marginTop: 6 }}>
              Total: ${v.monto_total}
            </div>
            {v.tiene_factura && (
              <div style={{ color: '#43a047', marginTop: 4 }}>📄 Factura adjunta</div>
            )}
          </div>
        ))
      )}
    </>
  )
}
