import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'
import heroImg from '../assets/images/image_salem.png'

function getParticleCount() {
  if (typeof window === 'undefined') return 90
  if (window.innerWidth < 640) return 40
  if (window.innerWidth < 1024) return 65
  return 90
}

function buildConfig(count) {
  return {
    fpsLimit: 60,
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    interactivity: {
      detectsOn: 'canvas',
      events: {
        onHover: { enable: true, mode: 'grab', parallax: { enable: true, force: 20, smooth: 10 } },
        onClick: { enable: true, mode: 'push' },
        resize: true,
      },
      modes: {
        grab: { distance: 130, links: { opacity: 0.5 } },
        push: { quantity: 4 },
      },
    },
    particles: {
      number: { value: count, density: { enable: true, area: 750 } },
      color: { value: ['#ffffff', '#e0f4ff', '#b3e5fc', '#ffffff'] },
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

const PAGE_META = {
  '/about': {
    badge: 'Notre histoire',
    title: 'Qui sommes-',
    titleAccent: 'nous',
    description: 'Une équipe passionnée au service de votre transformation numérique depuis plus de 10 ans en Côte d\'Ivoire.',
  },
  '/services': {
    badge: 'Ce que nous faisons',
    title: 'Nos ',
    titleAccent: 'services',
    description: 'Développement web, mobile, logiciels sur mesure et infrastructures réseau — pour accélérer votre croissance.',
  },
  '/solutions': {
    badge: 'Notre expertise',
    title: 'Nos ',
    titleAccent: 'solutions',
    description: 'Des solutions technologiques clés en main, adaptées aux besoins spécifiques des entreprises et institutions.',
  },
  '/portfolio': {
    badge: 'Notre travail',
    title: 'Nos ',
    titleAccent: 'solutions et réalisations',
    description: 'Découvrez les projets que nous avons menés à bien pour nos clients à travers l\'Afrique et au-delà.',
  },
  '/news': {
    badge: 'Actualités',
    title: 'News & ',
    titleAccent: 'articles',
    description: 'Restez informé des dernières tendances technologiques et des actualités de Salem Technology.',
  },
  '/contact': {
    badge: 'Parlons-en',
    title: 'Contactez-',
    titleAccent: 'nous',
    description: 'Discutons de votre projet ensemble. Notre équipe est disponible et vous répond sous 24h.',
  },
}

const PageHero = ({ pathname }) => {
  const [particleCount, setParticleCount] = useState(getParticleCount)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()
  const meta = PAGE_META[pathname] ?? PAGE_META['/services']

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    const handleResize = () => setParticleCount(getParticleCount())
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const particlesInit = useCallback(async (engine) => { await loadSlim(engine) }, [])

  const fadeIn = (delay = '0.3s') => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 0.75s ease ${delay}, transform 0.75s ease ${delay}`,
  })

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        /* Même bleu marine lumineux que HomeHero */
        background: 'linear-gradient(145deg, #0d1b3e 0%, #102a5a 40%, #0e2348 70%, #0a1a38 100%)',
      }}
    >
      {/* ── Particles ── */}
      <Particles
        id={`particles-${pathname.replace('/', '')}`}
        init={particlesInit}
        options={buildConfig(particleCount)}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
      />

      {/* ── Overlay allégé ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'linear-gradient(160deg, rgba(13,27,62,0.40) 0%, rgba(16,42,90,0.30) 40%, rgba(13,27,62,0.78) 100%)',
      }} />

      {/* ── Glow blobs plus lumineux ── */}
      <div style={{ position: 'absolute', top: '-15%', left: '5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,195,247,0.28), transparent 70%)', filter: 'blur(90px)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '0%', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.22), transparent 70%)', filter: 'blur(80px)', zIndex: 1, pointerEvents: 'none' }} />
      {/* Blob central subtil */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: '600px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(56,189,248,0.08),transparent 70%)', filter: 'blur(60px)', zIndex: 1, pointerEvents: 'none' }} />

      {/* ── Layout 2 colonnes ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: '1100px',
        margin: '0 auto', padding: '0 2rem',
        display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap',
      }}>

        {/* ── GAUCHE : Image flottante ── */}
        <div style={{
          flex: '1 1 300px',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          paddingTop: '4rem', ...fadeIn('0.2s'),
        }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
            <div style={{
              position: 'absolute', inset: '-20px',
              background: 'radial-gradient(ellipse at 50% 60%, rgba(79,195,247,0.22) 0%, transparent 72%)',
              filter: 'blur(32px)', zIndex: 0,
            }} />
            <img
              src={heroImg}
              alt=""
              aria-hidden="true"
              style={{
                position: 'relative', zIndex: 1, width: '100%', display: 'block',
                WebkitMaskImage: 'radial-gradient(ellipse 72% 78% at 50% 48%, black 28%, rgba(0,0,0,0.6) 52%, transparent 72%)',
                maskImage:       'radial-gradient(ellipse 72% 78% at 50% 48%, black 28%, rgba(0,0,0,0.6) 52%, transparent 72%)',
                filter: 'drop-shadow(0 0 28px rgba(79,195,247,0.30))',
                animation: 'floatY 5s ease-in-out infinite',
              }}
            />
          </div>
        </div>

        {/* ── DROITE : Texte page ── */}
        <div style={{
          flex: '1 1 360px',
          display: 'flex', flexDirection: 'column', gap: '1rem',
          fontFamily: "'DM Sans', sans-serif",
        }}>

          {/* Badge */}
          <div style={{
            ...fadeIn('0.3s'),
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '4px 14px', borderRadius: '9999px',
            border: '1px solid rgba(79,195,247,0.32)',
            background: 'rgba(79,195,247,0.07)',
            color: '#4fc3f7', fontSize: '0.68rem',
            letterSpacing: '0.13em', textTransform: 'uppercase',
            width: 'fit-content',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4fc3f7', animation: 'pulse 2s infinite', display: 'inline-block', flexShrink: 0 }} />
            {meta.badge}
          </div>

          {/* Titre */}
          <div style={fadeIn('0.45s')}>
            <h1 style={{
              fontWeight: 700, color: 'white', lineHeight: 1.15, margin: 0,
              fontSize: 'clamp(1.55rem, 3vw, 2.25rem)',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.02em',
            }}>
              {meta.title}
              <span style={{
                background: 'linear-gradient(90deg, #4fc3f7, #60a5fa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                {meta.titleAccent}
              </span>
            </h1>
          </div>

          {/* Description */}
          <div style={fadeIn('0.6s')}>
            <p style={{
              fontSize: '0.88rem', lineHeight: 1.75,
              color: 'rgba(186,230,253,0.72)',
              margin: 0, maxWidth: '380px',
            }}>
              {meta.description}
            </p>
          </div>

          {/* CTA — retour accueil */}
          <div style={{ ...fadeIn('0.75s'), marginTop: '0.3rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                background: 'transparent',
                color: 'rgba(186,230,253,0.75)',
                border: '1px solid rgba(79,195,247,0.28)',
                padding: '9px 20px', borderRadius: '8px',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(79,195,247,0.7)'; e.currentTarget.style.color = '#4fc3f7' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(79,195,247,0.28)'; e.currentTarget.style.color = 'rgba(186,230,253,0.75)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              Accueil
            </button>

            {/* Fil d'Ariane discret */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '0.7rem', color: 'rgba(186,230,253,0.3)' }}>Salem Technology</span>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="rgba(186,230,253,0.25)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              <span style={{ fontSize: '0.7rem', color: '#4fc3f7', fontWeight: 600 }}>{meta.badge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div style={{
        position: 'absolute', bottom: '1.6rem', left: '50%',
        transform: 'translateX(-50%)', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
        opacity: visible ? 0.45 : 0, transition: 'opacity 1s ease 1.5s',
      }}>
        <span style={{ fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(186,230,253,0.55)', fontFamily: "'DM Sans', sans-serif" }}>Défiler</span>
        <div style={{ width: '18px', height: '30px', borderRadius: '9999px', border: '1.5px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '4px' }}>
          <div style={{ width: '3px', height: '7px', borderRadius: '9999px', background: '#4fc3f7', animation: 'scrollDot 1.6s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 60%{transform:translateY(9px);opacity:.4} 100%{transform:translateY(0);opacity:1} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:.4} }
      `}</style>
    </section>
  )
}

export default PageHero