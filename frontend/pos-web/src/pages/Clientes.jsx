import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Clientes() {
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    api.get('/clientes/')
      .then(({ data }) => setClientes(data))
      .catch(() => alert('Error al cargar clientes'))
  }, [])

  return (
    <>
      <h2 className="page-title">Clientes</h2>
      {clientes.length === 0 ? (
        <p className="list-empty">Sin clientes registrados</p>
      ) : (
        clientes.map(c => (
          <div key={c.id_cliente} className="card">
            <div className="card-title">{c.nombre_completo}</div>
            {c.rfc && <div className="card-sub">RFC: {c.rfc}</div>}
            {c.correo_electronico && <div className="card-sub">{c.correo_electronico}</div>}
          </div>
        ))
      )}
    </>
  )
}
