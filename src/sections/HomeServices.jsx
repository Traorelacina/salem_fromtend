import { useEffect, useRef, useState } from 'react'

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: 'Logiciels de Gestion Desktop',
    tag: 'Paie · Facturation · Stock · Immobilisations',
    desc: 'Nous disposons de logiciels opérationnels dans des entreprises ivoiriennes et dans la sous-région : paie, facturation, gestion de stock, amortissement des immobilisations, et plus encore.',
    accent: '#4fc3f7',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: 'Sites Web',
    tag: 'B2B · B2C · Vitrine · E-commerce',
    desc: 'Commerçant, artisan ou chef d\'entreprise, un site Internet vous connecte au grand public — en B2B comme en B2C — et amplifie votre visibilité à grande échelle.',
    accent: '#60a5fa',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="17" r="1" />
      </svg>
    ),
    title: 'Applications Mobiles',
    tag: 'iOS · Android · Cross-platform',
    desc: 'Nous concevons des applications mobiles performantes et intuitives, pensées pour l\'utilisateur final et adaptées à tous les secteurs d\'activité.',
    accent: '#818cf8',
  },
]

const clients = ['Entreprises Ivoiriennes', 'PME & Startups', 'Institutions Publiques', 'Sous-région CEDEAO', 'Partenaires Internationaux']

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

const HomeServices = () => {
  const [sectionRef, inView] = useInView()

  const fadeUp = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  })

  return (
    <section
      ref={sectionRef}
      id="apropos"
      style={{
        position: 'relative',
        backgroundColor: '#080c22',
        padding: '5rem 2rem 4rem',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* ── Ambient glow blobs ── */}
      <div style={{ position: 'absolute', top: '-80px', right: '10%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,195,247,0.10), transparent 70%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', left: '5%', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.10), transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* ── Decorative top border line ── */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(79,195,247,0.35), transparent)' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ ...fadeUp(0), textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 14px', borderRadius: '9999px', border: '1px solid rgba(79,195,247,0.28)', background: 'rgba(79,195,247,0.06)', color: '#4fc3f7', fontSize: '0.65rem', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '1.1rem' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            Notre Expertise
          </div>

          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 'clamp(1.55rem, 3vw, 2.2rem)', color: 'white', margin: '0 0 1.1rem', lineHeight: 1.2 }}>
            Des experts{' '}
            <span style={{ background: 'linear-gradient(90deg, #4fc3f7, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              certifiés
            </span>{' '}
            à vos côtés
          </h2>

          <p style={{ fontSize: '0.9rem', lineHeight: 1.8, color: 'rgba(186,230,253,0.55)', maxWidth: '560px', margin: '0 auto' }}>
            Notre équipe vous accompagne de l'élaboration de votre projet jusqu'à sa concrétisation. Notre démarche est centrée sur l'expérience utilisateur — levier clé de votre croissance.
          </p>
        </div>

        {/* ── Service Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '3.5rem',
        }}>
          {services.map((s, i) => (
            <div
              key={i}
              style={{
                ...fadeUp(150 + i * 120),
                position: 'relative',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: '1.75rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${s.accent}44`
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.3), 0 0 0 1px ${s.accent}22`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Top accent line */}
              <div style={{ position: 'absolute', top: 0, left: '24px', right: '24px', height: '2px', borderRadius: '0 0 4px 4px', background: `linear-gradient(90deg, ${s.accent}55, ${s.accent}22)` }} />

              {/* Icon */}
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: `${s.accent}12`, border: `1px solid ${s.accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.accent, flexShrink: 0 }}>
                {s.icon}
              </div>

              {/* Diamond decorator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: s.accent, fontSize: '0.7rem', opacity: 0.7 }}>❖</span>
                <span style={{ fontSize: '0.62rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: `${s.accent}99` }}>{s.tag}</span>
              </div>

              <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '1.05rem', color: 'white', margin: 0 }}>
                {s.title}
              </h3>

              <p style={{ fontSize: '0.83rem', lineHeight: 1.75, color: 'rgba(186,230,253,0.50)', margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ── "Ils nous font confiance" ── */}
        <div style={{ ...fadeUp(600), borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(186,230,253,0.35)', marginBottom: '1.25rem' }}>
            ❖ &nbsp;Ils nous font confiance&nbsp; ❖
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.65rem' }}>
            {clients.map((c, i) => (
              <div
                key={i}
                style={{
                  ...fadeUp(700 + i * 80),
                  padding: '6px 18px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(79,195,247,0.18)',
                  background: 'rgba(79,195,247,0.05)',
                  color: 'rgba(186,230,253,0.65)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </section>
  )
}

export default HomeServices