import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([])

  useEffect(() => {
    api.get('/proveedores/')
      .then(({ data }) => setProveedores(data))
      .catch(() => alert('Error al cargar proveedores'))
  }, [])

  return (
    <>
      <h2 className="page-title">Proveedores</h2>
      {proveedores.length === 0 ? (
        <p className="list-empty">Sin proveedores</p>
      ) : (
        proveedores.map(p => (
          <div key={p.id_proveedor} className="card">
            <div className="card-title">{p.razon_social}</div>
            <div className="card-sub">RFC: {p.rfc}</div>
            {p.telefono_contacto && <div className="card-sub">Tel: {p.telefono_contacto}</div>}
          </div>
        ))
      )}
    </>
  )
}
