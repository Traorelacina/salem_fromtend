import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ExternalLink, Globe, Smartphone, Code2,
  Loader, Lock, Tag, ChevronLeft, ChevronRight,
  MapPin, Phone, Mail, ArrowRight, Star,
} from 'lucide-react'
import Container from '../components/Container'
import Header from '../components/Header'
import PageHero from '../components/Pagehero'
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'
const PALETTE = ['#0D6EFD', '#10B981', '#7C3AED', '#F59E0B', '#EF4444', '#059669']

function categoryIcon(cat) {
  const c = (cat ?? '').toLowerCase()
  if (c === 'mobile')   return Smartphone
  if (c === 'logiciel') return Code2
  return Globe
}

/* ══════════════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════════════ */
const Lightbox = ({ images, startIndex, onClose }) => {
  const [idx, setIdx] = useState(startIndex)
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  useEffect(() => {
    const fn = e => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
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
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(5,8,20,0.95)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Prev */}
      <button onClick={e => { e.stopPropagation(); prev() }} style={{
        position:'absolute', left:'1.5rem', top:'50%', transform:'translateY(-50%)',
        width:48, height:48, borderRadius:'50%',
        background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', color:'#fff', transition:'background 0.2s',
      }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}
         onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}>
        <ChevronLeft size={22} />
      </button>

      <img src={images[idx].url} alt={images[idx].caption || ''} onClick={e=>e.stopPropagation()}
        style={{ maxWidth:'88vw', maxHeight:'82vh', borderRadius:'16px', objectFit:'contain', boxShadow:'0 40px 100px rgba(0,0,0,0.7)' }} />

      {/* Next */}
      <button onClick={e => { e.stopPropagation(); next() }} style={{
        position:'absolute', right:'1.5rem', top:'50%', transform:'translateY(-50%)',
        width:48, height:48, borderRadius:'50%',
        background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)',
        display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer', color:'#fff', transition:'background 0.2s',
      }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.18)'}
         onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}>
        <ChevronRight size={22} />
      </button>

      {/* Close */}
      <button onClick={onClose} style={{
        position:'absolute', top:'1.5rem', right:'1.5rem',
        width:40, height:40, borderRadius:'50%',
        background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.14)',
        color:'#fff', fontSize:'1rem', fontWeight:700,
        display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
      }}>✕</button>

      {/* Counter */}
      <div style={{
        position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)',
        display:'flex', alignItems:'center', gap:'8px',
      }}>
        {images.map((_, i) => (
          <button key={i} onClick={e=>{e.stopPropagation();setIdx(i)}} style={{
            width: i===idx ? 24 : 8, height:8, borderRadius:'9999px',
            background: i===idx ? '#4fc3f7' : 'rgba(255,255,255,0.3)',
            border:'none', cursor:'pointer', transition:'all 0.3s', padding:0,
          }} />
        ))}
      </div>

      {images[idx].caption && (
        <p style={{ position:'absolute', bottom:'4.5rem', left:'50%', transform:'translateX(-50%)', color:'rgba(255,255,255,0.55)', fontSize:'0.8rem', whiteSpace:'nowrap' }}>
          {images[idx].caption}
        </p>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════ */
const Footer = () => {
  const navigate = useNavigate()
  const CYAN = '#4fc3f7'
  const year = new Date().getFullYear()

  const navLinks = [
    { label: 'Accueil',                      href: '/' },
    { label: 'Qui sommes-nous',              href: '/about' },
    { label: 'Nos services',                 href: '/services' },
    { label: 'Nos solutions & réalisations', href: '/portfolio' },
    { label: 'Contact',                      href: '/contact' },
  ]

  const services = ['Sites Web', 'Applications mobiles', 'Logiciels de gestion', 'Réseaux informatiques', 'Vidéosurveillance', 'GPS Trackers']

  const contacts = [
    { icon: MapPin, lines: ["Plateau Dokui, en face de la SODECI", "Abidjan, Côte d'Ivoire"] },
    { icon: Phone,  lines: ['+225 07 08 42 55 01', '+225 05 04 59 47 69', '+225 07 47 11 15 70'] },
    { icon: Mail,   lines: ['salemtechnology2000@gmail.com'] },
  ]

  return (
    <footer style={{
      background: 'linear-gradient(160deg, #080e22 0%, #0b1535 60%, #080e22 100%)',
      fontFamily: "'DM Sans', sans-serif",
      borderTop: '1px solid rgba(79,195,247,0.10)',
      paddingTop: '4.5rem',
    }}>
      {/* Ligne décorative haut */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #4fc3f7 40%, #60a5fa 60%, transparent)', marginBottom: 0 }} />

      <Container>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '3rem',
          padding: '3.5rem 0 3rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.2rem' }}>
              <div style={{
                width:38, height:38, borderRadius:'10px',
                background:'linear-gradient(135deg,#4fc3f7,#60a5fa)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 4px 16px rgba(79,195,247,0.35)',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'0.9rem', color:'#fff', letterSpacing:'0.01em' }}>
                SALEM<span style={{ color:CYAN, fontWeight:300, marginLeft:4 }}>TECHNOLOGY</span>
              </span>
            </div>
            <p style={{ color:'rgba(186,230,253,0.45)', fontSize:'0.81rem', lineHeight:1.8, maxWidth:'220px' }}>
              Agence IT — développement web, mobile, vidéosurveillance et GPS trackers en Côte d'Ivoire depuis 2015.
            </p>
            {/* Social */}
            <div style={{ display:'flex', gap:'8px', marginTop:'1.2rem' }}>
              {['f', 'in', 'tw'].map(s => (
                <div key={s} style={{
                  width:32, height:32, borderRadius:'8px',
                  background:'rgba(79,195,247,0.08)', border:'1px solid rgba(79,195,247,0.15)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'rgba(186,230,253,0.5)', fontSize:'0.7rem', fontWeight:700,
                  cursor:'pointer',
                }}>{s}</div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ color:'rgba(79,195,247,0.7)', fontWeight:700, fontSize:'0.72rem', marginBottom:'1.2rem', letterSpacing:'0.14em', textTransform:'uppercase' }}>Navigation</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {navLinks.map(l => (
                <button key={l.href} onClick={()=>navigate(l.href)} style={{
                  background:'none', border:'none', cursor:'pointer', textAlign:'left', padding:0,
                  color:'rgba(186,230,253,0.45)', fontSize:'0.82rem', fontWeight:500,
                  fontFamily:"'DM Sans',sans-serif", transition:'color 0.2s',
                  display:'flex', alignItems:'center', gap:'6px',
                }}
                  onMouseEnter={e=>{e.currentTarget.style.color=CYAN}}
                  onMouseLeave={e=>{e.currentTarget.style.color='rgba(186,230,253,0.45)'}}>
                  <ArrowRight size={10} style={{opacity:0.4}}/> {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color:'rgba(79,195,247,0.7)', fontWeight:700, fontSize:'0.72rem', marginBottom:'1.2rem', letterSpacing:'0.14em', textTransform:'uppercase' }}>Services</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem' }}>
              {services.map(s => (
                <span key={s} style={{ color:'rgba(186,230,253,0.45)', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ width:4, height:4, borderRadius:'50%', background:CYAN, display:'inline-block', opacity:0.6 }} />{s}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color:'rgba(79,195,247,0.7)', fontWeight:700, fontSize:'0.72rem', marginBottom:'1.2rem', letterSpacing:'0.14em', textTransform:'uppercase' }}>Contact</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {contacts.map(({ icon: Icon, lines }) => (
                <div key={lines[0]} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                  <div style={{ width:28, height:28, borderRadius:'8px', background:'rgba(79,195,247,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Icon size={13} style={{ color:CYAN }} />
                  </div>
                  <div>
                    {lines.map(l => <p key={l} style={{ margin:0, color:'rgba(186,230,253,0.45)', fontSize:'0.78rem', lineHeight:1.7 }}>{l}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid rgba(79,195,247,0.08)',
          padding: '1.4rem 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.5rem',
        }}>
          <p style={{ color:'rgba(186,230,253,0.25)', fontSize:'0.73rem', margin:0 }}>
            © {year} Salem Technology · Tous droits réservés
          </p>
          <p style={{ color:'rgba(186,230,253,0.18)', fontSize:'0.7rem', margin:0 }}>
            Abidjan, Côte d'Ivoire
          </p>
        </div>
      </Container>
    </footer>
  )
}

/* ══════════════════════════════════════════════════════
   PORTFOLIO DETAIL
══════════════════════════════════════════════════════ */
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

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f8faff', flexDirection:'column', gap:'1rem' }}>
      <div style={{ width:56, height:56, borderRadius:'16px', background:'linear-gradient(135deg,#4fc3f7,#60a5fa)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 28px rgba(79,195,247,0.35)', animation:'pulse-load 1.5s ease-in-out infinite' }}>
        <Loader size={26} color="#0b1a3a" style={{ animation:'spin 1s linear infinite' }} />
      </div>
      <p style={{ color:'#94a3b8', fontSize:'0.85rem', fontFamily:"'DM Sans',sans-serif" }}>Chargement du projet…</p>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse-load{0%,100%{box-shadow:0 8px 28px rgba(79,195,247,0.35)} 50%{box-shadow:0 8px 40px rgba(79,195,247,0.6)}}`}</style>
    </div>
  )

  /* ── 404 ── */
  if (notFound || !project) return (
    <div style={{ minHeight:'100vh', background:'#f8faff', fontFamily:"'DM Sans',sans-serif" }}>
      <Header />
      <PageHero pathname={location.pathname} meta={{ badge:'Réalisation introuvable', title:'Projet ', titleAccent:'introuvable', description:"La réalisation demandée n'existe pas ou a été retirée." }} />
      <div style={{ minHeight:'30vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem' }}>
        <button onClick={() => navigate('/portfolio')} style={{ color:'#0D6EFD', background:'none', border:'none', fontWeight:700, cursor:'pointer', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'6px' }}>
          <ArrowLeft size={14}/> Retour aux réalisations
        </button>
      </div>
      <Footer />
    </div>
  )

  const color   = PALETTE[0]
  const gallery = project.images ?? []
  const links   = [
    project.external_link && { label:'Voir le site',    href:project.external_link },
    project.android_link  && { label:'Android',         href:project.android_link },
    project.ios_link      && { label:'iOS / App Store', href:project.ios_link },
  ].filter(Boolean)

  const heroMeta = {
    badge:       project.category,
    title:       '',
    titleAccent: project.title,
    description: project.short_description,
  }

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#f0f4ff', minHeight:'100vh' }}>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && gallery.length > 0 && (
          <Lightbox images={gallery} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Syne:wght@700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap');

        /* ── Gallery thumbs ── */
        .g-thumb {
          aspect-ratio:16/10; overflow:hidden; border-radius:14px; cursor:pointer;
          border:2px solid transparent; position:relative;
          transition:border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          background:#e2e8f0;
        }
        .g-thumb:hover { border-color:#0D6EFD; transform:translateY(-4px); box-shadow:0 16px 36px rgba(13,110,253,0.20); }
        .g-thumb img   { width:100%; height:100%; object-fit:cover; transition:transform 0.4s; }
        .g-thumb:hover img { transform:scale(1.06); }
        .g-thumb-overlay {
          position:absolute; inset:0; background:rgba(13,110,253,0.55);
          display:flex; align-items:center; justify-content:center;
          opacity:0; transition:opacity 0.25s; font-size:0.78rem; color:#fff; font-weight:700; gap:6px;
        }
        .g-thumb:hover .g-thumb-overlay { opacity:1; }

        /* ── Prose content ── */
        .prose h2,.prose h3 { font-family:'Space Grotesk',sans-serif; font-weight:700; color:#0b0f2a; margin:1.6rem 0 0.7rem; }
        .prose h2 { font-size:1.25rem; }
        .prose h3 { font-size:1.05rem; }
        .prose p  { color:#475569; line-height:1.85; margin-bottom:1rem; font-size:0.92rem; }
        .prose ul { list-style:none; padding:0; color:#475569; }
        .prose li { font-size:0.92rem; line-height:1.8; padding-left:1.2rem; position:relative; margin-bottom:0.4rem; }
        .prose li::before { content:'→'; position:absolute; left:0; color:#0D6EFD; font-weight:700; }
        .prose a  { color:#0D6EFD; text-decoration:underline; }

        /* ── Layout ── */
        .detail-layout {
          display:grid;
          grid-template-columns:1fr 340px;
          gap:2rem;
          align-items:start;
        }
        @media(max-width:1100px) { .detail-layout { grid-template-columns:1fr; } }

        .gallery-layout {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:1rem;
        }
        @media(max-width:700px) { .gallery-layout { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:440px) { .gallery-layout { grid-template-columns:1fr; } }

        /* ── Card ── */
        .detail-card {
          background:#fff;
          border-radius:20px;
          border:1px solid rgba(0,0,0,0.05);
          box-shadow:0 2px 20px rgba(0,0,0,0.06);
          overflow:hidden;
        }

        /* ── Sidebar CTA ── */
        .sidebar-cta {
          background:linear-gradient(135deg,#0b1535,#0d1f4a);
          border-radius:20px;
          padding:1.8rem;
          position:relative;
          overflow:hidden;
          border:1px solid rgba(79,195,247,0.12);
        }
        .sidebar-cta::before {
          content:'';
          position:absolute; top:-60px; right:-60px;
          width:160px; height:160px; border-radius:50%;
          background:radial-gradient(circle,rgba(79,195,247,0.18),transparent 70%);
        }

        /* ── Feature pill ── */
        .feat-pill {
          display:inline-flex; align-items:center; gap:5px;
          padding:4px 12px; border-radius:9999px;
          font-size:0.72rem; font-weight:700;
        }
      `}</style>

      {/* ══ 1. HEADER ══ */}
      <Header />

      {/* ══ 2. PAGE HERO ══ */}
      <PageHero pathname={location.pathname} meta={heroMeta} />

      {/* ══ 3. BREADCRUMB BAR ══ */}
      <div style={{ background:'#fff', borderBottom:'1px solid rgba(0,0,0,0.06)', padding:'0.85rem 0' }}>
        <Container>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.75rem' }}>

            {/* Breadcrumb */}
            <div style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'0.78rem', fontWeight:500 }}>
              <button onClick={()=>navigate('/')} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0, fontSize:'0.78rem' }}>Accueil</button>
              <span style={{ color:'#e2e8f0', fontSize:'1rem' }}>›</span>
              <button onClick={()=>navigate('/portfolio')} style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontFamily:"'DM Sans',sans-serif", padding:0, fontSize:'0.78rem' }}>Réalisations</button>
              <span style={{ color:'#e2e8f0', fontSize:'1rem' }}>›</span>
              <span style={{ color:'#0b0f2a', fontWeight:700 }}>{project.title}</span>
            </div>

            {/* Badges + retour */}
            <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
              <span className="feat-pill" style={{ background:`${color}12`, color, border:`1px solid ${color}25` }}>
                <Tag size={10}/>{project.category}
              </span>
              {project.is_confidential && (
                <span className="feat-pill" style={{ background:'#fef2f2', color:'#ef4444', border:'1px solid #fecaca' }}>
                  <Lock size={10}/>Confidentiel
                </span>
              )}
              {project.is_featured && (
                <span className="feat-pill" style={{ background:'#fffbeb', color:'#f59e0b', border:'1px solid #fde68a' }}>
                  <Star size={10}/>À la une
                </span>
              )}
              <button
                onClick={()=>navigate('/portfolio')}
                style={{
                  display:'flex', alignItems:'center', gap:'5px',
                  padding:'6px 14px', borderRadius:'8px',
                  background:'#f8faff', color:'#475569', border:'1px solid #e2e8f0',
                  fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                  fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='#eef2ff';e.currentTarget.style.color=color;e.currentTarget.style.borderColor=`${color}40`}}
                onMouseLeave={e=>{e.currentTarget.style.background='#f8faff';e.currentTarget.style.color='#475569';e.currentTarget.style.borderColor='#e2e8f0'}}
              >
                <ArrowLeft size={13}/> Retour
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* ══ 4. CONTENU PRINCIPAL ══ */}
      <Container>
        <div style={{ padding:'2.5rem 0 6rem' }}>
          <div className="detail-layout">

            {/* ════ COLONNE GAUCHE ════ */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once:true, amount:0.05 }}
              style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}
            >
              {/* ── Cover image ── */}
              {project.cover_url && (
                <motion.div variants={fadeUp} className="detail-card" style={{ padding:0 }}>
                  <div style={{ position:'relative', overflow:'hidden', borderRadius:'20px', maxHeight:480 }}>
                    <img src={project.cover_url} alt={project.title} style={{ width:'100%', maxHeight:480, objectFit:'cover', display:'block', transition:'transform 0.6s' }}
                      onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
                      onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                    />
                    {/* Gradient overlay bas */}
                    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%', background:'linear-gradient(to top,rgba(11,15,42,0.6),transparent)', pointerEvents:'none' }} />
                    {/* Titre en overlay */}
                    <div style={{ position:'absolute', bottom:'1.5rem', left:'1.5rem', right:'1.5rem' }}>
                      <h1 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:800, fontSize:'clamp(1.3rem,3vw,2rem)', color:'#fff', margin:0, lineHeight:1.15, textShadow:'0 2px 12px rgba(0,0,0,0.4)' }}>
                        {project.title}
                      </h1>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Client bar ── */}
              {project.client && (
                <motion.div variants={fadeUp} className="detail-card" style={{ padding:'1.2rem 1.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                    {project.client_logo_url ? (
                      <div style={{ width:52, height:52, borderRadius:'14px', background:'#f8faff', border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', padding:8, flexShrink:0 }}>
                        <img src={project.client_logo_url} alt={project.client} style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                      </div>
                    ) : (
                      <div style={{ width:52, height:52, borderRadius:'14px', background:`${color}15`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'1.1rem', fontWeight:800, color }}>
                        {project.client.slice(0,2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ margin:0, fontSize:'0.7rem', color:'#94a3b8', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em' }}>Client</p>
                      <p style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'#0b0f2a', fontFamily:"'Space Grotesk',sans-serif" }}>{project.client}</p>
                    </div>
                    {/* Lien externe rapide */}
                    {!project.is_confidential && links.length > 0 && (
                      <a href={links[0].href} target="_blank" rel="noopener noreferrer"
                        style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px', borderRadius:'10px', background:`${color}`, color:'#fff', fontWeight:700, fontSize:'0.8rem', textDecoration:'none', boxShadow:`0 4px 16px ${color}44`, transition:'transform 0.2s,box-shadow 0.2s', flexShrink:0 }}
                        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 8px 24px ${color}55`}}
                        onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 4px 16px ${color}44`}}>
                        <ExternalLink size={13}/> {links[0].label}
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ── Contenu ── */}
              {project.content && (
                <motion.div variants={fadeUp} className="detail-card" style={{ padding:'2rem 2rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid #f1f5f9' }}>
                    <div style={{ width:4, height:22, borderRadius:'4px', background:`linear-gradient(135deg,${color},#60a5fa)` }} />
                    <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#0b0f2a', margin:0 }}>À propos du projet</h2>
                  </div>
                  <div className="prose" dangerouslySetInnerHTML={{ __html: project.content }} />
                </motion.div>
              )}

              {/* ── Galerie ── */}
              {gallery.length > 0 && (
                <motion.div variants={fadeUp} className="detail-card" style={{ padding:'2rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid #f1f5f9' }}>
                    <div style={{ width:4, height:22, borderRadius:'4px', background:'linear-gradient(135deg,#7C3AED,#a78bfa)' }} />
                    <h2 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#0b0f2a', margin:0 }}>
                      Galerie · <span style={{ color:'#94a3b8', fontWeight:500 }}>{gallery.length} image{gallery.length>1?'s':''}</span>
                    </h2>
                  </div>
                  <div className="gallery-layout">
                    {gallery.map((img, i) => (
                      <div key={img.id} className="g-thumb" onClick={()=>setLightbox(i)}>
                        <img src={img.url} alt={img.caption||`Image ${i+1}`} />
                        <div className="g-thumb-overlay">
                          <ChevronLeft size={14} style={{transform:'rotate(45deg)'}} /> Agrandir
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* ════ SIDEBAR ════ */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once:true, amount:0.05 }}
              style={{ display:'flex', flexDirection:'column', gap:'1.2rem', position:'sticky', top:'90px' }}
            >
              {/* Infos projet */}
              <motion.div variants={fadeUp} className="detail-card" style={{ padding:'1.6rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.4rem' }}>
                  <div style={{ width:4, height:18, borderRadius:'4px', background:`linear-gradient(135deg,${color},#60a5fa)` }} />
                  <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.92rem', color:'#0b0f2a', margin:0 }}>Informations</h3>
                </div>

                <div style={{ display:'flex', flexDirection:'column' }}>
                  {[
                    { label:'Client',    value:project.client },
                    { label:'Catégorie', value:project.category },
                    { label:'Statut',    value:project.is_confidential?'Confidentiel':'Public' },
                  ].map((row, i, arr) => (
                    <div key={row.label} style={{
                      display:'flex', justifyContent:'space-between', alignItems:'center', gap:'12px',
                      padding:'0.85rem 0',
                      borderBottom: i < arr.length-1 ? '1px solid #f1f5f9' : 'none',
                    }}>
                      <span style={{ color:'#94a3b8', fontSize:'0.75rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', flexShrink:0 }}>{row.label}</span>
                      <span style={{ color:'#0b0f2a', fontSize:'0.85rem', fontWeight:600, textAlign:'right' }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Liens */}
              {!project.is_confidential && links.length > 0 && (
                <motion.div variants={fadeUp} className="detail-card" style={{ padding:'1.6rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.2rem' }}>
                    <div style={{ width:4, height:18, borderRadius:'4px', background:'linear-gradient(135deg,#10B981,#34d399)' }} />
                    <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, fontSize:'0.92rem', color:'#0b0f2a', margin:0 }}>Liens du projet</h3>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                    {links.map(l => (
                      <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" style={{
                        display:'flex', alignItems:'center', gap:'10px', padding:'11px 14px',
                        borderRadius:'12px', background:`${color}08`, color,
                        fontWeight:600, fontSize:'0.83rem', textDecoration:'none',
                        border:`1px solid ${color}20`, transition:'all 0.2s',
                      }}
                        onMouseEnter={e=>{e.currentTarget.style.background=`${color}18`;e.currentTarget.style.transform='translateX(4px)'}}
                        onMouseLeave={e=>{e.currentTarget.style.background=`${color}08`;e.currentTarget.style.transform='none'}}>
                        <ExternalLink size={14}/> {l.label}
                        <ArrowRight size={13} style={{ marginLeft:'auto', opacity:0.5 }}/>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA Contact */}
              <motion.div variants={fadeUp} className="sidebar-cta">
                <h3 style={{ fontFamily:"'Space Grotesk',sans-serif", color:'#fff', fontWeight:800, fontSize:'1rem', marginBottom:'0.6rem', position:'relative', zIndex:1 }}>
                  Un projet similaire ?
                </h3>
                <p style={{ color:'rgba(186,230,253,0.6)', fontSize:'0.82rem', lineHeight:1.7, marginBottom:'1.4rem', position:'relative', zIndex:1 }}>
                  Notre équipe est disponible pour étudier votre besoin et vous proposer la meilleure solution.
                </p>
                <button
                  onClick={()=>navigate('/contact')}
                  style={{
                    width:'100%', padding:'12px', borderRadius:'12px',
                    background:'linear-gradient(135deg,#4fc3f7,#38bdf8)',
                    color:'#0b1a3a', fontWeight:800, fontSize:'0.85rem',
                    border:'none', cursor:'pointer', position:'relative', zIndex:1,
                    transition:'transform 0.2s,box-shadow 0.2s',
                    boxShadow:'0 4px 20px rgba(79,195,247,0.4)',
                    fontFamily:"'DM Sans',sans-serif",
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 30px rgba(79,195,247,0.55)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(79,195,247,0.4)'}}
                >
                  Nous contacter →
                </button>
              </motion.div>

              {/* Retour réalisations */}
              <motion.div variants={fadeUp}>
                <button
                  onClick={()=>navigate('/portfolio')}
                  style={{
                    width:'100%', padding:'12px', borderRadius:'14px',
                    background:'#fff', color:'#64748b',
                    border:'1.5px solid #e2e8f0', cursor:'pointer',
                    fontSize:'0.82rem', fontWeight:600,
                    fontFamily:"'DM Sans',sans-serif", transition:'all 0.2s',
                    display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                    boxShadow:'0 2px 12px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color}40`;e.currentTarget.style.color=color;e.currentTarget.style.background='#f8faff'}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor='#e2e8f0';e.currentTarget.style.color='#64748b';e.currentTarget.style.background='#fff'}}
                >
                  <ArrowLeft size={14}/> Toutes nos réalisations
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* ══ 5. FOOTER ══ */}
      <Footer />
    </div>
  )
}

export default PortfolioDetail