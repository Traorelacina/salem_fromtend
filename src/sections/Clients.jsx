import { useEffect, useRef, useState } from 'react'
import Container from '../components/Container'

const API = import.meta.env.VITE_API_URL ?? '/api'

const ClientLogo = ({ client }) => (
  <div className="flex-shrink-0 mx-6 flex items-center justify-center">
    <div
      style={{
        width: '120px', height: '120px', borderRadius: '50%',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', flexShrink: 0,
        transition: 'transform 0.3s, box-shadow 0.3s',
        padding: '18px',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.13)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)' }}
    >
      {client.logo_url ? (
        <img
          src={client.logo_url}
          alt={client.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      ) : (
        <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#64748b', letterSpacing: '0.05em' }}>
          {client.name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  </div>
)

const Clients = () => {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const trackRef = useRef(null)

  useEffect(() => {
    fetch(`${API}/v1/clients`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(d => { if (d.success && Array.isArray(d.data)) setClients(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!trackRef.current || clients.length === 0) return
    const track = trackRef.current
    const totalItems = track.children.length
    let pos = window.innerWidth
    let animId
    const speed = 1.2
    const tick = () => {
      pos -= speed
      const setWidth = track.scrollWidth / (totalItems / clients.length)
      if (pos <= -setWidth) pos += setWidth
      track.style.transform = `translateX(${pos}px)`
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [clients])

  const quadrupled = [...clients, ...clients, ...clients, ...clients]
  if (loading || clients.length === 0) return null

  return (
    <section style={{
      background: '#f8faff',
      padding: '3.5rem 0 4.5rem',
      overflow: 'hidden',
      borderTop: '1px solid #e2e8f0',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Container>
        <p style={{
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 800,
          color: '#0b0f2a',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '2.5rem',
        }}>
          ❖ &nbsp;Ils nous font confiance&nbsp; ❖
        </p>
      </Container>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(90deg,#f8faff,transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', background: 'linear-gradient(270deg,#f8faff,transparent)', zIndex: 10, pointerEvents: 'none' }} />
        <div ref={trackRef} style={{ display: 'flex', width: 'max-content', willChange: 'transform', alignItems: 'center', padding: '0.5rem 0' }}>
          {quadrupled.map((c, i) => <ClientLogo key={`${c.id}-${i}`} client={c} />)}
        </div>
      </div>
    </section>
  )
}

export default Clients