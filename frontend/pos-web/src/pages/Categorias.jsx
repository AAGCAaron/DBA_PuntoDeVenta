import React, { useEffect, useState } from 'react'
import api from '../api/client'

export default function Categorias() {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    api.get('/categorias/')
      .then(({ data }) => setCategorias(data))
      .catch(() => alert('Error al cargar categorías'))
  }, [])

  return (
    <>
      <h2 className="page-title">Categorías</h2>
      {categorias.length === 0 ? (
        <p className="list-empty">Sin categorías</p>
      ) : (
        categorias.map(c => (
          <div key={c.id_categoria} className="card">
            <div className="card-title">{c.nombre}</div>
            {c.descripcion && <div className="card-sub">{c.descripcion}</div>}
          </div>
        ))
      )}
    </>
  )
}
