import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import heroImg from '../assets/images/image_salem.png'
import Clients from './Clients'

function getParticleCount() {
  if (typeof window === 'undefined') return 90
  if (window.innerWidth < 640) return 40
  if (window.innerWidth < 1024) return 65
  return 90
}
function buildConfig(count) {
  return {
    fpsLimit: 60, fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    interactivity: {
      detectsOn: 'canvas',
      events: { onHover: { enable: true, mode: 'grab', parallax: { enable: true, force: 20, smooth: 10 } }, onClick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 130, links: { opacity: 0.5 } }, push: { quantity: 4 } },
    },
    particles: {
      number: { value: count, density: { enable: true, area: 750 } },
      color: { value: ['#ffffff', '#e0f4ff', '#b3e5fc'] },
      shape: { type: ['triangle', 'square', 'circle'] },
      opacity: { value: { min: 0.4, max: 0.8 }, animation: { enable: true, speed: 1.2, minimumValue: 0.3, sync: false } },
      size: { value: { min: 2, max: 6 }, animation: { enable: true, speed: 2, minimumValue: 1, sync: false } },
      links: { enable: true, distance: 110, color: '#ffffff', opacity: 0.28, width: 1 },
      move: { enable: true, speed: 2.8, direction: 'none', random: true, straight: false, outModes: { default: 'bounce' } },
      rotate: { value: { min: 0, max: 360 }, direction: 'random', animation: { enable: true, speed: 5, sync: false } },
    },
    detectRetina: true,
  }
}

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

function Counter({ target, suffix, inView }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let n = 0
    const step = Math.max(1, Math.ceil(target / 45))
    const id = setInterval(() => {
      n += step
      if (n >= target) { setVal(target); clearInterval(id) } else setVal(n)
    }, 32)
    return () => clearInterval(id)
  }, [inView, target])
  return <>{val}{suffix}</>
}

const STATS = [
  { value: 100, suffix: '+', label: 'Projets livrés' },
  { value: 10, suffix: '+', label: "Années d'expérience" },
  { value: 98, suffix: '%', label: 'Clients satisfaits' },
]

export default function HomeHero() {
  const [particleCount, setParticleCount] = useState(getParticleCount)
  const [visible, setVisible] = useState(false)
  const [introRef, introInView] = useInView(0.18)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const fn = () => setParticleCount(getParticleCount())
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const particlesInit = useCallback(async (engine) => { await loadSlim(engine) }, [])

  const fi = (delay = '0s') => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.75s ease ${delay}, transform 0.75s ease ${delay}`,
  })

  const fu = (delayMs = 0) => ({
    opacity: introInView ? 1 : 0,
    transform: introInView ? 'translateY(0)' : 'translateY(30px)',
    transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ease ${delayMs}ms`,
  })

  return (
    <>
      {/* ══ 1. HERO ══ */}
      <section id="accueil" style={{
        position: 'relative', minHeight: '100vh', width: '100%',
        display: 'flex', alignItems: 'center', overflow: 'hidden',
        background: 'linear-gradient(145deg, #0d1b3e 0%, #102a5a 40%, #0e2348 70%, #0a1a38 100%)',
      }}>
        <Particles id="tsparticles" init={particlesInit} options={buildConfig(particleCount)} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'linear-gradient(160deg,rgba(13,27,62,0.40) 0%,rgba(16,42,90,0.30) 40%,rgba(13,27,62,0.78) 100%)' }} />
        <div style={{ position: 'absolute', top: '-15%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,195,247,0.28),transparent 70%)', filter: 'blur(90px)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: 0, width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(96,165,250,0.22),transparent 70%)', filter: 'blur(80px)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(56,189,248,0.08),transparent 70%)', filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>

          {/* Image */}
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingTop: '4rem', ...fi('0.2s') }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(ellipse at 50% 60%,rgba(79,195,247,0.22),transparent 72%)', filter: 'blur(32px)', zIndex: 0 }} />
              <img src={heroImg} alt="Salem Technology" style={{ position: 'relative', zIndex: 1, width: '100%', display: 'block', WebkitMaskImage: 'radial-gradient(ellipse 72% 78% at 50% 48%,black 28%,rgba(0,0,0,0.6) 52%,transparent 72%)', maskImage: 'radial-gradient(ellipse 72% 78% at 50% 48%,black 28%,rgba(0,0,0,0.6) 52%,transparent 72%)', filter: 'drop-shadow(0 0 28px rgba(79,195,247,0.30))', animation: 'floatY 5s ease-in-out infinite' }} />
            </div>
          </div>

          {/* Texte */}
          <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: "'DM Sans',sans-serif" }}>

         

            {/* Badge agence */}
            <div style={{ ...fi('0.3s'), display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '4px 14px', borderRadius: '9999px', border: '1px solid rgba(79,195,247,0.32)', background: 'rgba(79,195,247,0.07)', color: '#4fc3f7', fontSize: '0.68rem', letterSpacing: '0.13em', textTransform: 'uppercase', width: 'fit-content' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite', display: 'inline-block' }} />
              Agence IT — Côte d'Ivoire
            </div>

            {/* Titre */}
            <div style={fi('0.45s')}>
              <h1 style={{ fontWeight: 700, color: 'white', lineHeight: 1.15, margin: 0, fontSize: 'clamp(1.55rem,3vw,2.25rem)', fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.02em' }}>
                Solutions <span style={{ background: 'linear-gradient(90deg,#4fc3f7,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>technologiques</span><br />innovantes pour votre entreprise
              </h1>
            </div>

            {/* Description */}
            <div style={fi('0.6s')}>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.75, color: 'rgba(186,230,253,0.72)', margin: 0, maxWidth: '380px' }}>
                Conception de logiciel, sites web, applications mobiles, vidéosurveillance, gps 
tracker – pour entreprises et institutions.
              </p>
            </div>

            {/* CTA */}
            <div style={{ ...fi('0.75s'), marginTop: '0.3rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button onClick={() => navigate('/services')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'linear-gradient(135deg,#4fc3f7,#38bdf8)', color: '#0b1a3a', padding: '10px 22px', borderRadius: '8px', fontSize: '0.83rem', fontWeight: 700, border: 'none', cursor: 'pointer', transition: 'transform 0.25s,box-shadow 0.25s', boxShadow: '0 4px 20px rgba(79,195,247,0.35)' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(79,195,247,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,195,247,0.35)' }}>
                Découvrir nos services
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <button onClick={() => navigate('/contact')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'transparent', color: 'rgba(186,230,253,0.80)', border: '1px solid rgba(79,195,247,0.30)', padding: '10px 20px', borderRadius: '8px', fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(79,195,247,0.7)'; e.currentTarget.style.color = '#4fc3f7' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(79,195,247,0.30)'; e.currentTarget.style.color = 'rgba(186,230,253,0.80)' }}>
                Nous contacter
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '1.6rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', opacity: visible ? 0.45 : 0, transition: 'opacity 1s ease 1.5s' }}>
          <span style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(186,230,253,0.55)', fontFamily: "'DM Sans',sans-serif" }}>Explorer</span>
          <div style={{ width: '18px', height: '30px', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4px' }}>
            <div style={{ width: '3px', height: '7px', borderRadius: '9999px', background: '#4fc3f7', animation: 'scrollDot 1.6s ease-in-out infinite' }} />
          </div>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
          @keyframes floatY    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 60%{transform:translateY(9px);opacity:.4} 100%{transform:translateY(0);opacity:1} }
          @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:.4} }
        `}</style>
      </section>

      {/* ══ 2. INTRO + STATS ══ */}
      <section ref={introRef} style={{
        position: 'relative',
        background: 'linear-gradient(180deg,#0d1b3e 0%,#102a5a 25%,#1a3a6e 50%,#f8faff 100%)',
        padding: '5rem 2rem 7rem', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif",
      }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,195,247,0.08),transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ ...fu(0), marginBottom: '3.5rem' }}>
            <p style={{ fontSize: 'clamp(0.95rem,2vw,1.12rem)', lineHeight: 1.9, color: 'rgba(186,230,253,0.75)', maxWidth: '680px', margin: '0 auto' }}>
              Notre équipe composée d'<strong style={{ color: '#4fc3f7', fontWeight: 700 }}>experts certifiés</strong> vous accompagne dans tous les domaines de l'élaboration de votre projet jusqu'à sa concrétisation. Notre démarche est centrée sur l'<strong style={{ color: '#60a5fa', fontWeight: 700 }}>expérience utilisateur</strong>, ce qui sera sans doute le levier de votre croissance.
            </p>
          </div>

          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(79,195,247,0.15)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(79,195,247,0.18)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ ...fu(i * 110), background: 'rgba(13,27,62,0.85)', padding: '2rem 1.5rem', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 800, fontSize: 'clamp(2rem,4vw,2.8rem)', background: 'linear-gradient(135deg,#4fc3f7,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>
                  <Counter target={s.value} suffix={s.suffix} inView={introInView} />
                </div>
                <div style={{ color: 'rgba(186,230,253,0.52)', fontSize: '0.76rem', letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:580px){ .stats-grid{ grid-template-columns:1fr !important; } }`}</style>
      </section>

      {/* ══ 4. CLIENTS ══ */}
      <Clients />
    </>
  )
}