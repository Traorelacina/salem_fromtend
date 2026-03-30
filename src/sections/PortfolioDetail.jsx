import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ExternalLink, Globe, Smartphone, Code2,
  Loader, Lock, Tag, ChevronLeft, ChevronRight,
  ArrowRight, Star, ZoomIn, Calendar, User,
  Maximize2, X, ChevronUp
} from 'lucide-react'
import Container from '../components/Container'
import Header from '../components/Header'
import PageHero from '../components/Pagehero'
import Footer from '../components/Footer'
import { fadeUp, staggerContainer } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'
const PALETTE = ['#0D6EFD', '#10B981', '#7C3AED', '#F59E0B', '#EF4444', '#059669']

/* ══════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════ */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex)
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(3,5,14,0.97)',
        backdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {images.length > 1 && (
        <>
          <LbBtn dir="left" onClick={e => { e.stopPropagation(); prev() }}><ChevronLeft size={22} /></LbBtn>
          <LbBtn dir="right" onClick={e => { e.stopPropagation(); next() }}><ChevronRight size={22} /></LbBtn>
        </>
      )}

      <motion.img
        key={idx}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        src={images[idx].url}
        alt={images[idx].caption || ''}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '90vw', maxHeight: '88vh',
          borderRadius: '18px', objectFit: 'contain',
          boxShadow: '0 60px 120px rgba(0,0,0,0.8)',
        }}
      />

      <button onClick={onClose} style={{
        position: 'absolute', top: '1.5rem', right: '1.5rem',
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.14)',
        color: '#fff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
      >
        <X size={18} />
      </button>

      {images.length > 1 && (
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '6px', alignItems: 'center',
        }}>
          {images.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setIdx(i) }} style={{
              width: i === idx ? 28 : 7, height: 7, borderRadius: '9999px',
              background: i === idx ? '#fff' : 'rgba(255,255,255,0.25)',
              border: 'none', cursor: 'pointer', transition: 'all 0.35s cubic-bezier(.22,1,.36,1)', padding: 0,
            }} />
          ))}
        </div>
      )}

      {images[idx].caption && (
        <div style={{
          position: 'absolute',
          bottom: images.length > 1 ? '4.5rem' : '2.2rem',
          left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '6px 18px', borderRadius: '9999px',
          color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem',
          whiteSpace: 'nowrap',
        }}>
          {images[idx].caption}
        </div>
      )}
    </motion.div>
  )
}

const LbBtn = ({ dir, onClick, children }) => (
  <button onClick={onClick} style={{
    position: 'absolute', [dir === 'left' ? 'left' : 'right']: '1.5rem',
    top: '50%', transform: 'translateY(-50%)',
    width: 52, height: 52, borderRadius: '50%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.14)',
    color: '#fff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s',
  }}
    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)' }}
    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)' }}
  >
    {children}
  </button>
)

/* ══════════════════════════════════════════════════════
   PORTFOLIO DETAIL
══════════════════════════════════════════════════════ */
const PortfolioDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${API}/v1/portfolio/${slug}`, { headers: { Accept: 'application/json' } })
      .then(r => { if (r.status === 404) { setNotFound(true); return null } return r.json() })
      .then(data => { if (data?.success) setProject(data.data) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (loading) return <LoadingScreen />
  if (notFound || !project) return <NotFoundScreen navigate={navigate} location={location} />

  const color = PALETTE[0]
  const gallery = project.images ?? []
  const coverImages = project.cover_url
    ? [{ id: '__cover__', url: project.cover_url, caption: project.title }]
    : []

  const links = [
    project.external_link && { label: 'Voir le site', href: project.external_link, icon: Globe },
    project.android_link  && { label: 'Android',      href: project.android_link,  icon: Smartphone },
    project.ios_link      && { label: 'iOS / App Store', href: project.ios_link,   icon: Smartphone },
  ].filter(Boolean)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f5f7fb', minHeight: '100vh' }}>

      <AnimatePresence>
        {lightbox && (
          <Lightbox images={lightbox.images} startIndex={lightbox.index} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      {/* Scroll-to-top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 500,
              width: 46, height: 46, borderRadius: '14px',
              background: color, color: '#fff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: `0 8px 28px ${color}55`,
            }}
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&display=swap');

        /* ── Cover hero ── */
        .cover-hero {
          position: relative;
          width: 100%;
          height: clamp(400px, 54vw, 660px);
          overflow: hidden;
          cursor: zoom-in;
          display: block;
        }
        .cover-hero img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .cover-hero:hover img { transform: scale(1.04); }
        .cover-vignette {
          position: absolute; inset: 0;
          background: linear-gradient(
            180deg,
            rgba(3,5,14,0.06) 0%,
            rgba(3,5,14,0.0) 30%,
            rgba(3,5,14,0.52) 70%,
            rgba(3,5,14,0.88) 100%
          );
          pointer-events: none;
        }
        .cover-zoom-pill {
          position: absolute; top: 1.4rem; right: 1.4rem;
          display: flex; align-items: center; gap: 7px;
          padding: 7px 15px; border-radius: 9999px;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(14px) saturate(1.5);
          border: 1px solid rgba(255,255,255,0.22);
          color: #fff; font-size: 0.73rem; font-weight: 700;
          letter-spacing: 0.04em;
          opacity: 0; transform: translateY(-6px);
          transition: opacity 0.25s, transform 0.25s;
          pointer-events: none;
        }
        .cover-hero:hover .cover-zoom-pill { opacity: 1; transform: translateY(0); }

        /* ── Gallery ── */
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 14px;
        }
        @media (max-width:860px) { .gallery-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width:500px) { .gallery-grid { grid-template-columns: 1fr; } }

        .gallery-item {
          position: relative; border-radius: 14px;
          overflow: hidden; cursor: zoom-in;
          aspect-ratio: 16/10; background: #e2e8f0;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s;
        }
        .gallery-item:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 24px 48px rgba(0,0,0,0.14); }
        .gallery-item img { width:100%; height:100%; object-fit:cover; transition: transform 0.5s ease; }
        .gallery-item:hover img { transform: scale(1.08); }
        .gallery-overlay {
          position: absolute; inset: 0;
          background: rgba(13,110,253,0.72);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: opacity 0.28s;
          color: #fff; font-size: 0.82rem; font-weight: 700; gap: 7px;
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }

        /* ── Prose ── */
        .prose { font-size: 0.94rem; line-height: 1.9; color: #3d4c62; }
        .prose h2 { font-family:'Bricolage Grotesque',sans-serif; font-size:1.25rem; font-weight:700; color:#0c1128; margin:1.8rem 0 0.7rem; }
        .prose h3 { font-family:'Bricolage Grotesque',sans-serif; font-size:1.05rem; font-weight:700; color:#1a2340; margin:1.4rem 0 0.5rem; }
        .prose p  { margin-bottom: 1rem; }
        .prose ul { padding-left:0; list-style:none; }
        .prose ul li { padding-left:1.5rem; position:relative; margin-bottom:0.5rem; }
        .prose ul li::before { content:'▸'; position:absolute; left:0; color:#0D6EFD; font-size:0.7rem; top:0.35rem; }
        .prose a  { color:#0D6EFD; font-weight:600; }

        /* ── Layout ── */
        .main-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 2.5rem; align-items: start;
        }
        @media (max-width:1100px) { .main-layout { grid-template-columns:1fr; } }

        /* ── Card ── */
        .card {
          background:#fff; border-radius:20px;
          border:1px solid rgba(0,0,0,0.055);
          box-shadow:0 2px 16px rgba(0,0,0,0.055);
        }

        /* ── Section title ── */
        .section-title {
          display:flex; align-items:center; gap:11px;
          margin-bottom:1.5rem; padding-bottom:1rem;
          border-bottom:1px solid #f0f4ff;
        }
        .section-title-bar { width:4px; height:24px; border-radius:4px; flex-shrink:0; }
        .section-title h2 {
          font-family:'Bricolage Grotesque',sans-serif;
          font-size:1.1rem; font-weight:700; color:#0c1128; margin:0;
        }
        .section-title h2 span { font-size:0.8rem; color:#94a3b8; font-weight:500; margin-left:4px; }

        /* ── Stat card ── */
        .stat-card {
          background:#fff; border-radius:16px; padding:1.1rem 1.3rem;
          border:1px solid #eef2ff;
          display:flex; align-items:center; gap:14px;
          transition:transform 0.25s, box-shadow 0.25s;
        }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 12px 30px rgba(0,0,0,0.08); }

        /* ── Link item ── */
        .link-item {
          display:flex; align-items:center; gap:10px;
          padding:11px 14px; border-radius:12px;
          font-weight:600; font-size:0.84rem;
          text-decoration:none; transition:all 0.2s;
          border:1px solid transparent;
        }

        /* ── CTA dark card ── */
        .cta-card {
          position:relative; overflow:hidden;
          border-radius:20px; padding:1.8rem;
          background:linear-gradient(145deg,#080e22,#0f1f50);
          border:1px solid rgba(99,144,255,0.18);
        }
        .cta-card::before {
          content:''; position:absolute; top:-80px; right:-80px;
          width:200px; height:200px; border-radius:50%;
          background:radial-gradient(circle,rgba(79,195,247,0.22) 0%,transparent 70%);
          pointer-events:none;
        }
        .cta-card::after {
          content:''; position:absolute; bottom:-60px; left:-40px;
          width:150px; height:150px; border-radius:50%;
          background:radial-gradient(circle,rgba(96,165,250,0.12) 0%,transparent 70%);
          pointer-events:none;
        }
      `}</style>

      <Header />
      <PageHero pathname={location.pathname} meta={{
        badge: project.category,
        title: '',
        titleAccent: project.title,
        description: project.short_description,
      }} />

      {/* ══ Breadcrumb ══ */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eef2ff', padding: '0.9rem 0' }}>
        <Container>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.8rem' }}>
            <nav style={{ display:'flex', alignItems:'center', gap:'7px', fontSize:'0.8rem', fontWeight:500 }}>
              {[['Accueil', '/'], ['Réalisations', '/portfolio']].map(([label, path]) => (
                <span key={path} style={{ display:'flex', alignItems:'center', gap:'7px' }}>
                  <button onClick={() => navigate(path)} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:'0.8rem', fontFamily:'inherit', padding:0, transition:'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = color}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  >{label}</button>
                  <span style={{ color:'#dde4f0' }}>/</span>
                </span>
              ))}
              <span style={{ color:'#0c1128', fontWeight:700 }}>{project.title}</span>
            </nav>

            <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
              {[
                project.category        && { bg:`${color}12`,  fg:color,     border:`${color}22`,  icon:<Tag size={10}/>,  label:project.category },
                project.is_confidential && { bg:'#fef2f2',      fg:'#ef4444', border:'#fecaca',      icon:<Lock size={10}/>, label:'Confidentiel' },
                project.is_featured     && { bg:'#fffbeb',      fg:'#f59e0b', border:'#fde68a',      icon:<Star size={10}/>, label:'À la une' },
              ].filter(Boolean).map((b, i) => (
                <span key={i} style={{
                  display:'inline-flex', alignItems:'center', gap:'5px',
                  padding:'4px 11px', borderRadius:'9999px',
                  background:b.bg, color:b.fg, border:`1px solid ${b.border}`,
                  fontSize:'0.71rem', fontWeight:700,
                }}>{b.icon}{b.label}</span>
              ))}
              <button onClick={() => navigate('/portfolio')} style={{
                display:'flex', alignItems:'center', gap:'6px',
                padding:'6px 14px', borderRadius:'9px',
                background:'#f5f7fb', color:'#475569',
                border:'1px solid #e2e8f0', fontSize:'0.8rem',
                fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='#eef2ff'; e.currentTarget.style.color=color; e.currentTarget.style.borderColor=`${color}30` }}
                onMouseLeave={e => { e.currentTarget.style.background='#f5f7fb'; e.currentTarget.style.color='#475569'; e.currentTarget.style.borderColor='#e2e8f0' }}
              >
                <ArrowLeft size={13}/> Retour
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ══ COVER HERO — pleine largeur, cinématique ══ */}
      {project.cover_url && (
        <Container>
          <motion.div
            initial={{ opacity:0, y:24 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
            style={{ marginTop:'2rem', borderRadius:'24px', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.13)' }}
          >
            {/* Image hero */}
            <div
              className="cover-hero"
              onClick={() => setLightbox({ images: coverImages, index: 0 })}
            >
              <img src={project.cover_url} alt={project.title} />
              <div className="cover-vignette" />
              <div className="cover-zoom-pill"><Maximize2 size={12}/> Plein écran</div>

              {/* Titre + description en overlay */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'2.5rem 2.5rem 2.2rem', zIndex:2 }}>
                <motion.div
                  initial={{ opacity:0, y:20 }}
                  animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.35, duration:0.5, ease:[0.22,1,0.36,1] }}
                >
                  {project.category && (
                    <div style={{
                      display:'inline-flex', alignItems:'center', gap:'6px',
                      padding:'4px 14px', borderRadius:'9999px', marginBottom:'0.9rem',
                      background:'rgba(255,255,255,0.14)',
                      backdropFilter:'blur(10px)',
                      border:'1px solid rgba(255,255,255,0.24)',
                      color:'#fff', fontSize:'0.71rem', fontWeight:700,
                      letterSpacing:'0.07em', textTransform:'uppercase',
                    }}>
                      <Tag size={10}/> {project.category}
                    </div>
                  )}
                  <h1 style={{
                    fontFamily:"'Bricolage Grotesque',sans-serif",
                    fontSize:'clamp(1.6rem,4.5vw,3rem)',
                    fontWeight:800, color:'#fff', margin:0, lineHeight:1.1,
                    textShadow:'0 2px 20px rgba(0,0,0,0.4)',
                  }}>
                    {project.title}
                  </h1>
                  {project.short_description && (
                    <p style={{
                      color:'rgba(255,255,255,0.72)', marginTop:'0.65rem',
                      fontSize:'0.96rem', lineHeight:1.6, maxWidth:'620px',
                    }}>
                      {project.short_description}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Description — collée à l'image dans la même card */}
            {project.content && (
              <div style={{ padding:'2.2rem 2.5rem 2.5rem', background:'#fff' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.4rem', paddingBottom:'1.1rem', borderBottom:'1px solid #f0f4ff' }}>
                  <div style={{ width:4, height:22, borderRadius:4, background:`linear-gradient(160deg,${color},#60a5fa)` }} />
                  <h2 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#0c1128', margin:0 }}>
                    À propos du projet
                  </h2>
                </div>
                <div className="prose" dangerouslySetInnerHTML={{ __html: project.content }} />
              </div>
            )}
          </motion.div>
        </Container>
      )}

      {/* ══ CONTENU PRINCIPAL ══ */}
      <Container>
        <div style={{ padding:'2.5rem 0 5rem' }}>
          <div className="main-layout">

            {/* ════ COLONNE GAUCHE ════ */}
            <motion.div
              initial="hidden" whileInView="visible"
              viewport={{ once:true, amount:0.04 }}
              variants={staggerContainer}
              style={{ display:'flex', flexDirection:'column', gap:'1.8rem' }}
            >
              {/* Stats */}
              {(project.client || project.year || project.duration) && (
                <motion.div variants={fadeUp}>
                  <div style={{
                    display:'grid',
                    gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))',
                    gap:'12px',
                  }}>
                    {project.client && (
                      <div className="stat-card">
                        {project.client_logo_url ? (
                          <div style={{ width:44, height:44, borderRadius:12, background:'#f8faff', border:'1px solid #eef2ff', display:'flex', alignItems:'center', justifyContent:'center', padding:8, flexShrink:0 }}>
                            <img src={project.client_logo_url} alt={project.client} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                          </div>
                        ) : (
                          <div style={{ width:44, height:44, borderRadius:12, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'0.88rem', fontWeight:800, color }}>
                            {project.client.slice(0,2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p style={{ margin:0, fontSize:'0.68rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Client</p>
                          <p style={{ margin:0, fontSize:'0.92rem', fontWeight:700, color:'#0c1128', fontFamily:"'Bricolage Grotesque',sans-serif" }}>{project.client}</p>
                        </div>
                      </div>
                    )}
                    {project.year && (
                      <div className="stat-card">
                        <div style={{ width:44, height:44, borderRadius:12, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Calendar size={18} color={color} />
                        </div>
                        <div>
                          <p style={{ margin:0, fontSize:'0.68rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Année</p>
                          <p style={{ margin:0, fontSize:'0.92rem', fontWeight:700, color:'#0c1128', fontFamily:"'Bricolage Grotesque',sans-serif" }}>{project.year}</p>
                        </div>
                      </div>
                    )}
                    {project.duration && (
                      <div className="stat-card">
                        <div style={{ width:44, height:44, borderRadius:12, background:`${color}14`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <User size={18} color={color} />
                        </div>
                        <div>
                          <p style={{ margin:0, fontSize:'0.68rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Durée</p>
                          <p style={{ margin:0, fontSize:'0.92rem', fontWeight:700, color:'#0c1128', fontFamily:"'Bricolage Grotesque',sans-serif" }}>{project.duration}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <motion.div variants={fadeUp} className="card" style={{ padding:'1.8rem' }}>
                  <div className="section-title">
                    <div className="section-title-bar" style={{ background:`linear-gradient(160deg,${color},#60a5fa)` }} />
                    <h2>Technologies utilisées</h2>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
                    {project.technologies.map((tech, i) => (
                      <span key={i} style={{
                        display:'inline-flex', alignItems:'center',
                        padding:'5px 13px', borderRadius:'9px',
                        background:`${color}0d`, color,
                        fontSize:'0.76rem', fontWeight:700,
                        border:`1px solid ${color}1a`,
                        transition:'all 0.2s', cursor:'default',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background=color; e.currentTarget.style.color='#fff' }}
                        onMouseLeave={e => { e.currentTarget.style.background=`${color}0d`; e.currentTarget.style.color=color }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Galerie */}
              {gallery.length > 0 && (
                <motion.div variants={fadeUp} className="card" style={{ padding:'1.8rem' }}>
                  <div className="section-title">
                    <div className="section-title-bar" style={{ background:'linear-gradient(160deg,#7C3AED,#a78bfa)' }} />
                    <h2>Galerie <span>· {gallery.length} image{gallery.length > 1 ? 's' : ''}</span></h2>
                  </div>
                  <div className="gallery-grid">
                    {gallery.map((img, i) => (
                      <motion.div
                        key={img.id}
                        className="gallery-item"
                        initial={{ opacity:0, y:16 }}
                        whileInView={{ opacity:1, y:0 }}
                        viewport={{ once:true }}
                        transition={{ delay:i * 0.07, duration:0.4, ease:[0.22,1,0.36,1] }}
                        onClick={() => setLightbox({ images: gallery, index: i })}
                      >
                        <img src={img.url} alt={img.caption || `Image ${i+1}`} />
                        <div className="gallery-overlay"><ZoomIn size={18}/> Agrandir</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ════ SIDEBAR ════ */}
            <motion.div
              initial={{ opacity:0, x:24 }}
              animate={{ opacity:1, x:0 }}
              transition={{ duration:0.5, delay:0.22, ease:[0.22,1,0.36,1] }}
              style={{ position:'sticky', top:'90px', display:'flex', flexDirection:'column', gap:'1.2rem' }}
            >
              {/* Liens */}
              {!project.is_confidential && links.length > 0 && (
                <div className="card" style={{ padding:'1.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.1rem' }}>
                    <div style={{ width:4, height:18, borderRadius:4, background:'linear-gradient(160deg,#10B981,#34d399)' }} />
                    <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", fontSize:'0.92rem', fontWeight:700, color:'#0c1128', margin:0 }}>Liens du projet</h3>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'7px' }}>
                    {links.map(l => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                        className="link-item"
                        style={{ background:`${color}08`, color, border:`1px solid ${color}18` }}
                        onMouseEnter={e => { e.currentTarget.style.background=`${color}16`; e.currentTarget.style.borderColor=`${color}35`; e.currentTarget.style.transform='translateX(5px)' }}
                        onMouseLeave={e => { e.currentTarget.style.background=`${color}08`; e.currentTarget.style.borderColor=`${color}18`; e.currentTarget.style.transform='translateX(0)' }}
                      >
                        <l.icon size={15}/> {l.label}
                        <ArrowRight size={13} style={{ marginLeft:'auto', opacity:0.5 }}/>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Contact */}
              <div className="cta-card">
                <div style={{ position:'relative', zIndex:2 }}>
                  <div style={{
                    display:'inline-flex', alignItems:'center', gap:'6px',
                    padding:'3px 11px', borderRadius:'9999px', marginBottom:'0.9rem',
                    background:'rgba(79,195,247,0.15)',
                    border:'1px solid rgba(79,195,247,0.25)',
                    color:'#7dd3fc', fontSize:'0.68rem', fontWeight:700,
                    letterSpacing:'0.06em', textTransform:'uppercase',
                  }}>
                    Nouveau projet
                  </div>
                  <h3 style={{ fontFamily:"'Bricolage Grotesque',sans-serif", color:'#fff', fontWeight:800, fontSize:'1.1rem', margin:'0 0 0.55rem', lineHeight:1.25 }}>
                    Vous avez un projet similaire ?
                  </h3>
                  <p style={{ color:'rgba(186,230,253,0.55)', fontSize:'0.83rem', lineHeight:1.7, marginBottom:'1.4rem' }}>
                    Notre équipe est disponible pour étudier votre besoin et vous proposer la meilleure solution.
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    style={{
                      width:'100%', padding:'12px 16px', borderRadius:'12px',
                      background:'linear-gradient(135deg,#4fc3f7,#38bdf8)',
                      color:'#05111f', fontWeight:800, fontSize:'0.86rem',
                      border:'none', cursor:'pointer',
                      fontFamily:"'Plus Jakarta Sans',sans-serif",
                      boxShadow:'0 6px 24px rgba(79,195,247,0.38)',
                      transition:'transform 0.2s, box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(79,195,247,0.52)' }}
                    onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 6px 24px rgba(79,195,247,0.38)' }}
                  >
                    Nous contacter →
                  </button>
                </div>
              </div>

              {/* Retour */}
              <button
                onClick={() => navigate('/portfolio')}
                style={{
                  width:'100%', padding:'12px', borderRadius:'14px',
                  background:'#fff', color:'#64748b',
                  border:'1.5px solid #e8eef8', cursor:'pointer',
                  fontSize:'0.82rem', fontWeight:600, fontFamily:'inherit',
                  transition:'all 0.2s', display:'flex', alignItems:'center',
                  justifyContent:'center', gap:'7px',
                  boxShadow:'0 2px 10px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${color}35`; e.currentTarget.style.color=color; e.currentTarget.style.background=`${color}06` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#e8eef8'; e.currentTarget.style.color='#64748b'; e.currentTarget.style.background='#fff' }}
              >
                <ArrowLeft size={14}/> Toutes nos réalisations
              </button>
            </motion.div>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  )
}

/* ══ Écrans secondaires ══ */
const LoadingScreen = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f5f7fb', flexDirection:'column', gap:'1rem' }}>
    <motion.div
      animate={{ rotate:360 }}
      transition={{ duration:1.2, repeat:Infinity, ease:'linear' }}
      style={{ width:48, height:48, borderRadius:'50%', border:'3px solid #e2e8f0', borderTopColor:'#0D6EFD' }}
    />
    <p style={{ color:'#94a3b8', fontSize:'0.84rem', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Chargement…</p>
  </div>
)

const NotFoundScreen = ({ navigate, location }) => (
  <div style={{ minHeight:'100vh', background:'#f5f7fb', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
    <Header />
    <PageHero pathname={location.pathname} meta={{ badge:'404', title:'Projet ', titleAccent:'introuvable', description:"La réalisation demandée n'existe pas ou a été retirée." }} />
    <div style={{ textAlign:'center', padding:'5rem 2rem' }}>
      <button onClick={() => navigate('/portfolio')} style={{ padding:'12px 28px', background:'#0D6EFD', color:'#fff', border:'none', borderRadius:'12px', cursor:'pointer', fontWeight:700, fontFamily:'inherit' }}>
        ← Retour aux réalisations
      </button>
    </div>
    <Footer />
  </div>
)

export default PortfolioDetail