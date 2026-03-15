import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

const IconDesktop = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="42" height="28" rx="3" />
    <path d="M3 27h42" /><path d="M15 35v4M33 35v4M10 39h28" />
    <path d="M13 17l5 5-5 5M24 27h8" />
  </svg>
)

const IconWeb = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="24" cy="24" r="19" />
    <path d="M5 24h38" />
    <path d="M24 5c-5 5.5-8 11.5-8 19s3 13.5 8 19c5-5.5 8-11.5 8-19S29 10.5 24 5z" />
    <path d="M8.5 15h31M8.5 33h31" />
  </svg>
)

const IconMobile = () => (
  <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="12" y="3" width="24" height="42" rx="4" />
    <path d="M12 10h24M12 38h24" />
    <circle cx="24" cy="43" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="24" cy="7" r="1" fill="currentColor" stroke="none" />
    <path d="M18 20l4 4-4 4M26 28h5" />
  </svg>
)

const SERVICES = [
  {
    Icon: IconDesktop,
    title: 'Conception de Logiciels de Gestion Desktop',
    desc: 'Nous avons déjà des logiciels opérationnels dans des entreprises ivoiriennes et dans la sous-région — Paie, Facturation, Gestion de stock, Amortissement des immobilisations, etc.',
    tags: ['Paie', 'Facturation', 'Stock', 'Immobilisations'],
    accent: '#0ea5e9', lightBg: '#e0f2fe',
    gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
    animFrom: 'translateX(-48px)', delay: 0,
  },
  {
    Icon: IconWeb,
    title: 'Conception de Sites Web',
    desc: "Si vous êtes commerçant, artisan ou chef d'entreprise, la création d'un site Internet vous permet de vous faire connaître auprès du grand public en B2B comme en B2C.",
    tags: ['Vitrine', 'E-commerce', 'B2B', 'B2C'],
    accent: '#6366f1', lightBg: '#eef2ff',
    gradient: 'linear-gradient(135deg,#6366f1,#818cf8)',
    animFrom: 'translateY(48px)', delay: 140,
  },
  {
    Icon: IconMobile,
    title: "Conception d'Applications Mobiles",
    desc: "Nous concevons des applications mobiles performantes et intuitives, pensées pour l'utilisateur final et adaptées à tous les secteurs d'activité.",
    tags: ['iOS', 'Android', 'Cross-platform', 'UX/UI'],
    accent: '#10b981', lightBg: '#d1fae5',
    gradient: 'linear-gradient(135deg,#10b981,#34d399)',
    animFrom: 'translateX(48px)', delay: 280,
  },
]

function ServiceCard({ s, inView }) {
  const [hov, setHov] = useState(false)
  const navigate = useNavigate()

  return (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : s.animFrom,
      transition: `opacity 0.7s ease ${s.delay}ms, transform 0.75s cubic-bezier(0.22,1,0.36,1) ${s.delay}ms`,
    }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: 'white', borderRadius: '20px', padding: '2rem 1.75rem',
          height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem',
          border: `1px solid ${hov ? s.accent + '45' : '#e2e8f0'}`,
          boxShadow: hov ? `0 20px 56px rgba(0,0,0,0.10),0 0 0 1px ${s.accent}18` : '0 2px 16px rgba(0,0,0,0.055)',
          transform: hov ? 'translateY(-8px)' : 'translateY(0)',
          transition: 'all 0.38s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative', overflow: 'hidden', cursor: 'default',
        }}
      >
        {/* Bubble */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: s.lightBg, opacity: hov ? 0.85 : 0.4, transform: hov ? 'scale(1.3)' : 'scale(1)', transition: 'opacity 0.4s,transform 0.5s', pointerEvents: 'none' }} />
        {/* Top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: hov ? s.gradient : 'transparent', borderRadius: '20px 20px 0 0', transition: 'background 0.35s' }} />
        {/* Icon */}
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', flexShrink: 0, background: hov ? s.gradient : s.lightBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hov ? 'white' : s.accent, transform: hov ? 'rotate(8deg) scale(1.1)' : 'rotate(0) scale(1)', boxShadow: hov ? `0 10px 28px ${s.accent}35` : 'none', transition: 'all 0.38s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative', zIndex: 1 }}>
          <s.Icon />
        </div>
        {/* Title */}
        <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.02rem', color: '#0f172a', margin: 0, lineHeight: 1.3, letterSpacing: '-0.01em', position: 'relative', zIndex: 1 }}>{s.title}</h3>
        {/* Desc */}
        <p style={{ fontSize: '0.84rem', lineHeight: 1.78, color: '#64748b', margin: 0, flex: 1, position: 'relative', zIndex: 1 }}>{s.desc}</p>
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', position: 'relative', zIndex: 1 }}>
          {s.tags.map((t, i) => (
            <span key={i} style={{ padding: '3px 11px', borderRadius: '9999px', background: s.lightBg, color: s.accent, fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.04em' }}>{t}</span>
          ))}
        </div>
        {/* CTA */}
        <div
          onClick={() => navigate('/services')}
          style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            color: s.accent, fontSize: '0.78rem', fontWeight: 700,
            opacity: hov ? 1 : 0,
            transform: hov ? 'translateX(0)' : 'translateX(-10px)',
            transition: 'opacity 0.3s,transform 0.3s',
            position: 'relative', zIndex: 1,
            cursor: 'pointer',
          }}
        >
          En savoir plus
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
  )
}

export default function ServicesDescription() {
  const [secRef, secInView] = useInView(0.1)
  const [hdRef, hdInView] = useInView(0.25)

  return (
    <section ref={secRef} style={{ position: 'relative', background: 'linear-gradient(180deg,#f8faff 0%,#f0f7ff 40%,#ffffff 100%)', padding: '6rem 2rem 5.5rem', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Dot grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle,#cbd5e1 1px,transparent 1px)', backgroundSize: '28px 28px', opacity: 0.4, zIndex: 0 }} />
      {/* Blobs */}
      <div style={{ position: 'absolute', top: '5%', left: '-80px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.07),transparent 70%)', animation: 'blobFloat 9s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.07),transparent 70%)', animation: 'blobFloat 11s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div ref={hdRef} style={{ textAlign: 'center', marginBottom: '3.5rem', opacity: hdInView ? 1 : 0, transform: hdInView ? 'translateY(0)' : 'translateY(-28px)', transition: 'opacity 0.7s ease,transform 0.7s ease' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '5px 16px', borderRadius: '9999px', background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', color: '#0ea5e9', fontSize: '0.63rem', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '1.1rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0ea5e9', display: 'inline-block', animation: 'pulseDot 2s infinite' }} />
            Nos Services
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 'clamp(1.7rem,3.5vw,2.5rem)', color: '#0f172a', margin: '0 0 1rem', lineHeight: 1.18, letterSpacing: '-0.02em' }}>
            Des solutions{' '}
            <span style={{ background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>sur mesure</span>
            {' '}pour votre entreprise
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto' }}>
            De la conception à la mise en production, notre équipe certifiée vous accompagne à chaque étape avec une démarche centrée sur l'expérience utilisateur.
          </p>
        </div>

        {/* Grid */}
        <div className="svc-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
          {SERVICES.map((s, i) => <ServiceCard key={i} s={s} inView={secInView} />)}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.8)} }
        @keyframes blobFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @media(max-width:900px){ .svc-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:580px){ .svc-grid{ grid-template-columns:1fr !important; } }
      `}</style>
    </section>
  )
}