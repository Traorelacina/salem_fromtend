import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, ExternalLink, Globe, Smartphone, Code2,
  Loader, Lock, Tag, ChevronLeft, ChevronRight,
  MapPin, Phone, Mail,
} from 'lucide-react'
import Container from '../components/Container'
import PageHero from './PageHero'
import { fadeUp, fadeRight, staggerContainer } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'
const DEFAULT_COLORS = ['#0D6EFD', '#10B981', '#7C3AED', '#F59E0B', '#EF4444', '#059669']

function categoryIcon(category) {
  const cat = (category ?? '').toLowerCase()
  if (cat === 'mobile')   return Smartphone
  if (cat === 'logiciel') return Code2
  return Globe
}

/* ══ Lightbox ══════════════════════════════════════════════ */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex)
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.93)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
      }}
    >
      <button onClick={e => { e.stopPropagation(); prev() }} style={btnNav('left')}>
        <ChevronLeft size={22} />
      </button>

      <img
        src={images[idx].url} alt={images[idx].caption || ''}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 30px 80px rgba(0,0,0,0.6)' }}
      />

      <button onClick={e => { e.stopPropagation(); next() }} style={btnNav('right')}>
        <ChevronRight size={22} />
      </button>

      <button onClick={onClose} style={{
        position: 'absolute', top: '1rem', right: '1.5rem',
        background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff', fontSize: '1.1rem', fontWeight: 700,
      }}>✕</button>

      {images[idx].caption && (
        <p style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>
          {images[idx].caption}
        </p>
      )}
      <p style={{ position: 'absolute', top: '1.2rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.45)', fontSize: '0.76rem' }}>
        {idx + 1} / {images.length}
      </p>
    </motion.div>
  )
}
function btnNav(side) {
  return {
    position: 'absolute', [side]: '1rem', top: '50%', transform: 'translateY(-50%)',
    background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%',
    width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: '#fff',
  }
}

/* ══ Footer ════════════════════════════════════════════════ */
const Footer = () => {
  const navigate = useNavigate()
  const CYAN = '#4fc3f7'
  const NAVY = '#0b0f2a'
  const year = new Date().getFullYear()

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0A2540 0%, #0b0f2a 100%)',
      fontFamily: "'DM Sans', sans-serif",
      padding: '4rem 0 0',
      borderTop: '1px solid rgba(79,195,247,0.12)',
    }}>
      <Container>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2.5rem', paddingBottom: '3rem' }}>

          {/* Colonne marque */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: `linear-gradient(135deg, ${CYAN}, #60a5fa)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 14px rgba(79,195,247,0.35)`,
              }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#fff', letterSpacing: '0.01em' }}>
                SALEM<span style={{ color: CYAN, fontWeight: 300, marginLeft: 4 }}>TECHNOLOGY</span>
              </span>
            </div>
            <p style={{ color: 'rgba(186,230,253,0.55)', fontSize: '0.82rem', lineHeight: 1.75, maxWidth: '240px' }}>
              Agence IT spécialisée dans le développement web, mobile, vidéosurveillance et GPS en Côte d'Ivoire depuis 2015.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {[
                { label: 'Accueil',                        href: '/' },
                { label: 'Qui sommes-nous',                href: '/about' },
                { label: 'Nos services',                   href: '/services' },
                { label: 'Nos solutions & réalisations',   href: '/portfolio' },
                { label: 'Contact',                        href: '/contact' },
              ].map(l => (
                <button key={l.href} onClick={() => navigate(l.href)} style={{
                  background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                  color: 'rgba(186,230,253,0.55)', fontSize: '0.82rem', fontWeight: 500,
                  transition: 'color 0.2s', padding: 0, fontFamily: "'DM Sans', sans-serif",
                }}
                  onMouseEnter={e => e.currentTarget.style.color = CYAN}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(186,230,253,0.55)'}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {['Sites Web', 'Applications mobiles', 'Logiciels de gestion', 'Réseaux informatiques', 'Vidéosurveillance', 'GPS Trackers'].map(s => (
                <span key={s} style={{ color: 'rgba(186,230,253,0.55)', fontSize: '0.82rem' }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: MapPin, text: 'Plateau Dokui, en face de la SODECI\nAbidjan, Côte d\'Ivoire' },
                { icon: Phone, text: '+225 07 08 42 55 01\n+225 05 04 59 47 69\n+225 07 47 11 15 70' },
                { icon: Mail,  text: 'salemtechnology2000@gmail.com' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Icon size={14} style={{ color: CYAN, flexShrink: 0, marginTop: 3 }} />
                  <span style={{ color: 'rgba(186,230,253,0.55)', fontSize: '0.78rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(79,195,247,0.10)',
          padding: '1.2rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem',
        }}>
          <p style={{ color: 'rgba(186,230,253,0.35)', fontSize: '0.75rem', margin: 0 }}>
            © {year} Salem Technology. Tous droits réservés.
          </p>
          <p style={{ color: 'rgba(186,230,253,0.25)', fontSize: '0.72rem', margin: 0 }}>
            Abidjan, Côte d'Ivoire
          </p>
        </div>
      </Container>
    </footer>
  )
}

/* ══ PortfolioDetail ════════════════════════════════════════ */
const PortfolioDetail = () => {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const location    = useLocation()
  const [project, setProject]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch(`${API}/v1/portfolio/${slug}`, { headers: { Accept: 'application/json' } })
      .then(r => { if (r.status === 404) { setNotFound(true); return null } return r.json() })
      .then(data => { if (data?.success) setProject(data.data) })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  /* ── Chargement ── */
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader size={36} style={{ animation: 'spin 1s linear infinite', color: '#0D6EFD', opacity: 0.7 }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  /* ── 404 ── */
  if (notFound || !project) return (
    <>
      <PageHero pathname={location.pathname} meta={{ badge: 'Réalisation introuvable', title: 'Projet ', titleAccent: 'introuvable', description: 'La réalisation demandée n\'existe pas ou a été retirée.' }} />
      <div style={{ minHeight: '30vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontFamily: "'DM Sans', sans-serif" }}>
        <button onClick={() => navigate('/portfolio')} style={{ color: '#0D6EFD', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
          ← Retour aux réalisations
        </button>
      </div>
      <Footer />
    </>
  )

  const color   = DEFAULT_COLORS[0]
  const Icon    = categoryIcon(project.category)
  const gallery = project.images ?? []
  const links   = [
    project.external_link && { label: 'Voir le site',    href: project.external_link },
    project.android_link  && { label: 'Android',         href: project.android_link },
    project.ios_link      && { label: 'iOS / App Store', href: project.ios_link },
  ].filter(Boolean)

  /* Meta injecté dans PageHero */
  const heroMeta = {
    badge:        project.category,
    title:        '',
    titleAccent:  project.title,
    description:  project.short_description,
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#f8faff', minHeight: '100vh' }}>

      {/* ── Lightbox ── */}
      {lightbox !== null && gallery.length > 0 && (
        <Lightbox images={gallery} startIndex={lightbox} onClose={() => setLightbox(null)} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@700;800&family=Syne:wght@800&display=swap');

        .gallery-thumb {
          aspect-ratio: 4/3; overflow: hidden; border-radius: 12px; cursor: pointer;
          border: 2px solid transparent;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .gallery-thumb:hover { border-color: #0D6EFD; transform: translateY(-3px); box-shadow: 0 12px 30px rgba(13,110,253,0.18); }
        .gallery-thumb img   { width: 100%; height: 100%; object-fit: cover; }

        .content-prose h2,
        .content-prose h3 { font-family:'Space Grotesk',sans-serif; font-weight:700; color:#0b0f2a; margin:1.4rem 0 0.6rem; }
        .content-prose h2 { font-size:1.2rem; }
        .content-prose h3 { font-size:1rem; }
        .content-prose p  { color:#475569; line-height:1.8; margin-bottom:0.9rem; font-size:0.93rem; }
        .content-prose ul { list-style:disc; padding-left:1.4rem; color:#475569; font-size:0.93rem; line-height:1.8; }
        .content-prose li { margin-bottom:0.3rem; }
        .content-prose a  { color:#0D6EFD; text-decoration:underline; }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 2.5rem;
          align-items: start;
        }
        @media (max-width:1023px) { .detail-grid { grid-template-columns:1fr; } }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 1rem;
        }
        @media (max-width:640px) { .gallery-grid { grid-template-columns:repeat(2,1fr); } }
      `}</style>

      {/* ══ 1. PAGE HERO ══ */}
      <PageHero pathname={location.pathname} meta={heroMeta} />

      {/* ══ 2. BANDE INFO RAPIDE ══ */}
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '1rem 0' }}>
        <Container>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
              <button onClick={() => navigate('/')} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0 }}>Accueil</button>
              <span style={{ color:'#cbd5e1' }}>›</span>
              <button onClick={() => navigate('/portfolio')} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0 }}>Réalisations</button>
              <span style={{ color:'#cbd5e1' }}>›</span>
              <span style={{ color:'#0b0f2a', fontWeight:600 }}>{project.title}</span>
            </div>

            <div style={{ marginLeft:'auto', display:'flex', gap:'8px', flexWrap:'wrap', alignItems:'center' }}>
              {/* Badges */}
              <span style={{ padding:'3px 10px', borderRadius:'9999px', background:`${color}12`, color, fontSize:'0.72rem', fontWeight:700, border:`1px solid ${color}25` }}>
                <Tag size={10} style={{ display:'inline', marginRight:4 }} />{project.category}
              </span>
              {project.is_confidential && (
                <span style={{ padding:'3px 10px', borderRadius:'9999px', background:'#fef0f0', color:'#ef4444', fontSize:'0.72rem', fontWeight:700 }}>
                  <Lock size={10} style={{ display:'inline', marginRight:4 }} />Confidentiel
                </span>
              )}
              {project.is_featured && (
                <span style={{ padding:'3px 10px', borderRadius:'9999px', background:'#fff8e6', color:'#f59e0b', fontSize:'0.72rem', fontWeight:700 }}>★ À la une</span>
              )}

              {/* Bouton retour */}
              <button
                onClick={() => navigate('/portfolio')}
                style={{
                  display:'flex', alignItems:'center', gap:'5px',
                  padding:'7px 14px', borderRadius:'8px',
                  background:`${color}10`, color, border:`1px solid ${color}25`,
                  fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                  fontFamily:"'DM Sans',sans-serif",
                  transition:'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = `${color}20`}
                onMouseLeave={e => e.currentTarget.style.background = `${color}10`}
              >
                <ArrowLeft size={13} /> Retour
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ══ 3. CONTENU ══ */}
      <Container>
        <div style={{ padding: '3rem 0 5rem' }}>
          <div className="detail-grid">

            {/* ── Colonne principale ── */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
            >
              {/* Cover image si présente */}
              {project.cover_url && (
                <motion.div variants={fadeUp} style={{ marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
                  <img src={project.cover_url} alt={project.title} style={{ width:'100%', maxHeight:'420px', objectFit:'cover', display:'block' }} />
                </motion.div>
              )}

              {/* Client info bar */}
              {project.client && (
                <motion.div variants={fadeUp} style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  background:'#fff', borderRadius:'12px', padding:'1rem 1.2rem',
                  boxShadow:'0 2px 16px rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.05)',
                  marginBottom:'1.5rem',
                }}>
                  {project.client_logo_url && (
                    <img src={project.client_logo_url} alt={project.client} style={{ width:40, height:40, objectFit:'contain', borderRadius:'8px', background:'#f8faff', padding:4 }} />
                  )}
                  <div>
                    <p style={{ margin:0, fontSize:'0.72rem', color:'#94a3b8', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>Client</p>
                    <p style={{ margin:0, fontSize:'0.92rem', fontWeight:700, color:'#0b0f2a' }}>{project.client}</p>
                  </div>
                </motion.div>
              )}

              {/* Contenu complet */}
              {project.content && (
                <motion.div variants={fadeUp}>
                  <div style={{ background:'#fff', borderRadius:'16px', padding:'2rem', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', marginBottom:'2rem', border:'1px solid rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.15rem', color:'#0b0f2a', marginBottom:'1rem' }}>
                      À propos du projet
                    </h2>
                    <div className="content-prose" dangerouslySetInnerHTML={{ __html: project.content }} />
                  </div>
                </motion.div>
              )}

              {/* Galerie */}
              {gallery.length > 0 && (
                <motion.div variants={fadeUp}>
                  <div style={{ background:'#fff', borderRadius:'16px', padding:'2rem', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.15rem', color:'#0b0f2a', marginBottom:'1.2rem' }}>
                      Galerie ({gallery.length} image{gallery.length > 1 ? 's' : ''})
                    </h2>
                    <div className="gallery-grid">
                      {gallery.map((img, i) => (
                        <div key={img.id} className="gallery-thumb" onClick={() => setLightbox(i)}>
                          <img src={img.url} alt={img.caption || `Image ${i + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ── Sidebar ── */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.05 }}
              style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}
            >
              {/* Infos */}
              <motion.div variants={fadeUp} style={{ background:'#fff', borderRadius:'16px', padding:'1.5rem', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.95rem', color:'#0b0f2a', marginBottom:'1.2rem' }}>Informations</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
                  {[
                    { label:'Client',    value: project.client },
                    { label:'Catégorie', value: project.category },
                    { label:'Statut',    value: project.is_confidential ? 'Confidentiel' : 'Public' },
                  ].map(row => (
                    <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px', paddingBottom:'0.75rem', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                      <span style={{ color:'#94a3b8', fontSize:'0.76rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', flexShrink:0 }}>{row.label}</span>
                      <span style={{ color:'#0b0f2a', fontSize:'0.84rem', fontWeight:600, textAlign:'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Liens externes */}
              {!project.is_confidential && links.length > 0 && (
                <motion.div variants={fadeUp} style={{ background:'#fff', borderRadius:'16px', padding:'1.5rem', boxShadow:'0 4px 24px rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.95rem', color:'#0b0f2a', marginBottom:'1rem' }}>Liens</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    {links.map(l => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                        style={{ display:'flex', alignItems:'center', gap:'8px', padding:'10px 14px', borderRadius:'10px', background:`${color}10`, color, fontWeight:600, fontSize:'0.83rem', textDecoration:'none', border:`1px solid ${color}25`, transition:'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = `${color}20`}
                        onMouseLeave={e => e.currentTarget.style.background = `${color}10`}
                      >
                        <ExternalLink size={14} /> {l.label}
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA contact */}
              <motion.div variants={fadeUp} style={{ background:'linear-gradient(135deg,#0A2540,#0D3460)', borderRadius:'16px', padding:'1.5rem', boxShadow:'0 8px 28px rgba(13,35,64,0.25)' }}>
                <h3 style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem', marginBottom:'0.6rem', fontFamily:"'Space Grotesk',sans-serif" }}>Un projet similaire ?</h3>
                <p style={{ color:'rgba(186,230,253,0.65)', fontSize:'0.80rem', lineHeight:1.6, marginBottom:'1rem' }}>
                  Discutons de votre besoin et trouvons la meilleure solution ensemble.
                </p>
                <button
                  onClick={() => navigate('/contact')}
                  style={{ width:'100%', padding:'10px', borderRadius:'10px', background:'linear-gradient(135deg,#4fc3f7,#38bdf8)', color:'#0b1a3a', fontWeight:700, fontSize:'0.83rem', border:'none', cursor:'pointer', transition:'transform 0.2s,box-shadow 0.2s', boxShadow:'0 4px 18px rgba(79,195,247,0.35)' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 26px rgba(79,195,247,0.5)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 4px 18px rgba(79,195,247,0.35)' }}
                >
                  Nous contacter
                </button>
              </motion.div>

              {/* Autres réalisations */}
              <motion.div variants={fadeUp}>
                <button
                  onClick={() => navigate('/portfolio')}
                  style={{ width:'100%', padding:'12px', borderRadius:'12px', background:'rgba(13,110,253,0.06)', color:'#0D6EFD', fontWeight:600, fontSize:'0.83rem', border:'1.5px solid rgba(13,110,253,0.18)', cursor:'pointer', transition:'all 0.2s', fontFamily:"'DM Sans',sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(13,110,253,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(13,110,253,0.06)' }}
                >
                  ← Voir toutes nos réalisations
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* ══ 4. FOOTER ══ */}
      <Footer />
    </div>
  )
}

export default PortfolioDetail