import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Tooltip, Legend, Filler
)

const MESES_LABEL = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
const REFRESH_MS  = 30_000   // auto-refresh every 30 seconds

// Glassmorphism-friendly chart colors
const BLUE   = 'rgba(129,140,248,0.85)'
const BLUELT = 'rgba(129,140,248,0.18)'
const GREEN  = 'rgba(52,211,153,0.85)'
const AMBER  = 'rgba(251,191,36,0.85)'
const RED    = 'rgba(248,113,113,0.85)'
const PURPLE = 'rgba(196,181,253,0.85)'
const CYAN   = 'rgba(103,232,249,0.85)'

function KpiCard({ emoji, label, value, sub, color = 'primary' }) {
  return (
    <div className={`card border-0 shadow-sm h-100`}>
      <div className="card-body d-flex align-items-center gap-3">
        <div className={`fs-1 lh-1`}>{emoji}</div>
        <div>
          <div className="text-muted small fw-semibold text-uppercase">{label}</div>
          <div className={`fw-bold fs-4 text-${color}`}>{value}</div>
          {sub && <div className="text-muted small">{sub}</div>}
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ emoji, title, badge }) {
  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <span className="fs-4">{emoji}</span>
      <h5 className="mb-0 fw-bold">{title}</h5>
      {badge && <span className="badge bg-primary rounded-pill ms-1">{badge}</span>}
    </div>
  )
}

const fmt = (n) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

export default function Dashboard() {
  const { usuario } = useAuth()
  const isAdmin = usuario?.rol === 'Admin'

  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const [resumen,     setResumen]     = useState(null)
  const [ventasDia,   setVentasDia]   = useState([])
  const [ventasMes,   setVentasMes]   = useState([])
  const [topProds,    setTopProds]    = useState({ top10: [], bottom10: [] })
  const [porEmpleado, setPorEmpleado] = useState([])
  const [anual,       setAnual]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [refreshing,  setRefreshing]  = useState(false)
  const timerRef = useRef(null)

  const params = useCallback(() => {
    const p = new URLSearchParams({
      year, month,
      usuario_id: usuario?.id_usuario ?? '',
      rol: usuario?.rol ?? 'Cajero',
    })
    return p.toString()
  }, [year, month, usuario])

  const paramsAnual = useCallback(() => {
    const p = new URLSearchParams({
      usuario_id: usuario?.id_usuario ?? '',
      rol: usuario?.rol ?? 'Cajero',
    })
    return p.toString()
  }, [usuario])

  // Extracted fetch function — reused by initial load AND polling interval
  const fetchAll = useCallback((isInitial = false) => {
    if (isInitial) setLoading(true)
    else setRefreshing(true)
    Promise.all([
      api.get(`/dashboard/resumen?${params()}`),
      api.get(`/dashboard/ventas-por-dia?${params()}`),
      api.get(`/dashboard/ventas-por-mes?${params()}`),
      api.get(`/dashboard/top-productos?${params()}`),
      api.get(`/dashboard/por-empleado?${params()}`),
      api.get(`/dashboard/anual?${paramsAnual()}`),
    ]).then(([r, d, m, tp, e, a]) => {
      setResumen(r.data)
      setVentasDia(d.data)
      setVentasMes(m.data)
      setTopProds(tp.data)
      setPorEmpleado(e.data)
      setAnual(a.data)
      setLastUpdated(new Date())
    }).catch(console.error).finally(() => {
      setLoading(false)
      setRefreshing(false)
    })
  }, [params, paramsAnual])

  // Initial fetch + start polling
  useEffect(() => {
    fetchAll(true)
    timerRef.current = setInterval(() => fetchAll(false), REFRESH_MS)
    return () => clearInterval(timerRef.current)   // cleanup on unmount/re-render
  }, [fetchAll])

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i)

  // ─── Chart configs ─────────────────────────────────────────────────────────
  const chartDia = {
    labels: ventasDia.map(r => `Día ${r.dia}`),
    datasets: [{
      label: 'Ingresos ($)',
      data: ventasDia.map(r => r.total),
      backgroundColor: BLUE,
      borderRadius: 6,
    }],
  }

  const chartMes = {
    labels: ventasMes.map(r => r.mes),
    datasets: [{
      label: 'Ingresos mensuales ($)',
      data: ventasMes.map(r => r.total),
      borderColor: BLUE,
      backgroundColor: BLUELT,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
    }],
  }

  const chartAnual = {
    labels: anual.map(r => String(r.año)),
    datasets: [{
      label: 'Ingresos anuales ($)',
      data: anual.map(r => r.total),
      backgroundColor: anual.map((_, i) => [BLUE, GREEN, AMBER, PURPLE, RED][i % 5]),
      borderRadius: 8,
    }],
  }

  const chartEmpleado = {
    labels: porEmpleado.map(r => r.empleado),
    datasets: [{
      data: porEmpleado.map(r => r.total),
      backgroundColor: [BLUE, GREEN, AMBER, RED, PURPLE,
        'rgba(13,202,240,.85)', 'rgba(253,126,20,.85)', 'rgba(102,16,242,.85)'],
    }],
  }

  const barOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  }
  const lineOpts = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  }
  const doughnutOpts = {
    responsive: true,
    plugins: { legend: { position: 'right' } },
  }

  const fmtTime = (d) => d ? d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'

  return (
    <div>
      {/* ─── Header ────────────────────────────────────────────────────────── */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2">
            <h2 className="fw-bold mb-0">📊 Dashboard</h2>
            {/* Live indicator */}
            <span className="d-flex align-items-center gap-1" style={{ fontSize: 12, color: refreshing ? '#fbbf24' : '#34d399' }}>
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: refreshing ? '#fbbf24' : '#34d399',
                boxShadow: refreshing ? '0 0 6px #fbbf24' : '0 0 6px #34d399',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              {refreshing ? 'Actualizando…' : 'En vivo'}
            </span>
          </div>
          <p className="page-subtitle mb-0">
            {isAdmin ? '🔑 Vista Admin — métricas globales' : `👤 Vista Cajero — ${usuario?.nombre_usuario}`}
            {lastUpdated && <span className="ms-2">· Actualizado: {fmtTime(lastUpdated)}</span>}
          </p>
        </div>
        {/* Filtros periodo + botón refrescar */}
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <select
            className="form-select form-select-sm"
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            style={{ width: 130 }}
          >
            {MESES_LABEL.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            className="form-select form-select-sm"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            style={{ width: 90 }}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button
            className="btn btn-sm btn-outline-light"
            onClick={() => fetchAll(false)}
            disabled={refreshing}
            title="Refrescar ahora"
          >
            {refreshing ? '⏳' : '🔄'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-muted mt-3">Cargando métricas…</p>
        </div>
      ) : (
        <>
          {/* ─── KPI Cards ─────────────────────────────────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <KpiCard emoji="💰" label="Ingresos del mes" value={fmt(resumen?.total_ingresos ?? 0)} color="primary" />
            </div>
            <div className="col-6 col-md-3">
              <KpiCard emoji="🛒" label="Ventas realizadas" value={resumen?.num_ventas ?? 0} color="success" />
            </div>
            <div className="col-6 col-md-3">
              <KpiCard emoji="🧾" label="Ticket promedio" value={fmt(resumen?.ticket_promedio ?? 0)} color="warning" />
            </div>
            {isAdmin && (
              <div className="col-6 col-md-3">
                <KpiCard
                  emoji="🏆"
                  label="Top empleado"
                  value={resumen?.top_empleado?.nombre ?? '—'}
                  sub={resumen?.top_empleado ? fmt(resumen.top_empleado.total) : ''}
                  color="danger"
                />
              </div>
            )}
          </div>

          {/* ─── Ventas diarias del mes ─────────────────────────────────────── */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <SectionTitle emoji="📅" title={`Ventas día a día — ${MESES_LABEL[month-1]} ${year}`} />
              {ventasDia.length ? (
                <Bar data={chartDia} options={barOpts} />
              ) : (
                <p className="text-muted text-center py-4">Sin ventas este mes 😴</p>
              )}
            </div>
          </div>

          {/* ─── Ventas mensuales del año ───────────────────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <SectionTitle emoji="📈" title={`Tendencia mensual — ${year}`} />
                  {ventasMes.length ? (
                    <Line data={chartMes} options={lineOpts} />
                  ) : (
                    <p className="text-muted text-center py-4">Sin datos anuales 📭</p>
                  )}
                </div>
              </div>
            </div>

            {/* Ingresos por empleado */}
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <SectionTitle emoji="👥" title="Por empleado" />
                  {porEmpleado.length ? (
                    <Doughnut data={chartEmpleado} options={doughnutOpts} />
                  ) : (
                    <p className="text-muted text-center py-4">Sin datos 📭</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Top 10 / Bottom 10 ─────────────────────────────────────────── */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <SectionTitle emoji="🔥" title="Top 10 productos" badge="más vendidos" />
                  {topProds.top10.length ? (
                    <ol className="list-group list-group-numbered list-group-flush">
                      {topProds.top10.map((p, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between align-items-start px-0 py-2">
                          <div className="ms-2 me-auto">
                            <div className="fw-semibold small">{p.nombre}</div>
                            <span className="text-muted" style={{ fontSize: 12 }}>{p.unidades} unidades</span>
                          </div>
                          <span className="badge bg-success rounded-pill">{fmt(p.ingreso)}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-muted text-center py-4">Sin ventas este mes 😴</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <SectionTitle emoji="🐌" title="Bottom 10 productos" badge="menos vendidos" />
                  {topProds.bottom10.length ? (
                    <ol className="list-group list-group-numbered list-group-flush">
                      {topProds.bottom10.map((p, i) => (
                        <li key={i} className="list-group-item d-flex justify-content-between align-items-start px-0 py-2">
                          <div className="ms-2 me-auto">
                            <div className="fw-semibold small">{p.nombre}</div>
                            <span className="text-muted" style={{ fontSize: 12 }}>{p.unidades} unidades</span>
                          </div>
                          <span className="badge bg-warning text-dark rounded-pill">{fmt(p.ingreso)}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-muted text-center py-4">Sin ventas este mes 😴</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Comparativo Año a Año ──────────────────────────────────────── */}
          {isAdmin && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <SectionTitle emoji="🗓️" title="Comparativo Año a Año" />
                {anual.length ? (
                  <Bar data={chartAnual} options={barOpts} />
                ) : (
                  <p className="text-muted text-center py-4">Sin datos históricos 📭</p>
                )}
              </div>
            </div>
          )}

          {/* ─── Tabla empleados ────────────────────────────────────────────── */}
          {isAdmin && porEmpleado.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <SectionTitle emoji="💼" title="Ingresos por empleado" />
                <div className="table-responsive">
                  <table className="table table-hover table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Empleado</th>
                        <th className="text-end">Ventas</th>
                        <th className="text-end">Total generado</th>
                        <th className="text-end">Ticket promedio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {porEmpleado.map((e, i) => (
                        <tr key={i}>
                          <td><span className="badge bg-secondary rounded-pill">{i + 1}</span></td>
                          <td>
                            {i === 0 && <span className="me-1">🏆</span>}
                            <strong>{e.empleado}</strong>
                          </td>
                          <td className="text-end">{e.ventas}</td>
                          <td className="text-end text-success fw-bold">{fmt(e.total)}</td>
                          <td className="text-end text-muted">{fmt(e.ventas ? e.total / e.ventas : 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
