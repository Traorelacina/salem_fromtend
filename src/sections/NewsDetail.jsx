import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, User, Tag, Loader } from 'lucide-react'
import Container from '../components/Container'
import PageHero from '../components/Pagehero'
import { fadeUp } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'

const COLORS = ['#0D6EFD', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#059669']
function colorFor(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

/* ─── Skeleton ─── */
const Skeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-screen bg-gray-200" />
    <div className="py-16">
      <Container>
        <div className="max-w-3xl mx-auto space-y-4">
          {[100, 80, 90, 70, 85, 75].map((w, i) => (
            <div key={i} style={{ height: 16, background: '#e5e7eb', borderRadius: 8, width: `${w}%` }} />
          ))}
        </div>
      </Container>
    </div>
  </div>
)

const NewsDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/v1/news/${slug}`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => { if (data.success) setArticle(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Skeleton />

  if (!article) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center', padding: '0 1rem' }}>
      <Tag size={48} style={{ color: '#d1d5db' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0b0f2a', margin: 0 }}>Article introuvable</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Cet article n'existe pas ou a été supprimé.</p>
      <button
        onClick={() => navigate('/news')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 600, color: '#4fc3f7', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <ArrowLeft size={15} /> Retour aux actualités
      </button>
    </div>
  )

  const color = colorFor(article.category ?? article.title)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .news-prose { font-family: 'DM Sans', sans-serif; color: #374151; line-height: 1.85; font-size: 1rem; }
        .news-prose h1, .news-prose h2, .news-prose h3, .news-prose h4 {
          font-family: 'Syne', sans-serif; font-weight: 800;
          color: #0b0f2a; margin: 2rem 0 0.75rem; line-height: 1.2;
        }
        .news-prose h2 { font-size: 1.5rem; }
        .news-prose h3 { font-size: 1.2rem; }
        .news-prose p  { margin: 0 0 1.25rem; }
        .news-prose ul, .news-prose ol { padding-left: 1.5rem; margin: 0 0 1.25rem; }
        .news-prose li { margin-bottom: 0.4rem; }
        .news-prose a  { color: #4fc3f7; text-decoration: underline; }
        .news-prose strong { color: #0b0f2a; font-weight: 700; }
        .news-prose blockquote {
          border-left: 4px solid #4fc3f7;
          margin: 1.5rem 0; padding: 0.75rem 1.25rem;
          background: #f0f9ff; border-radius: 0 8px 8px 0;
          color: #0b0f2a; font-style: italic;
        }
        .news-prose img { width: 100%; border-radius: 12px; margin: 1.5rem 0; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
        .news-prose pre {
          background: #0b0f2a; color: #e2e8f0;
          padding: 1.25rem; border-radius: 10px;
          overflow-x: auto; font-size: 0.875rem; margin: 1.25rem 0;
        }
        .news-prose code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.875rem; }
        .news-prose pre code { background: transparent; padding: 0; }
      `}</style>

      {/* ══ HERO ══ */}
      <section style={{
        background: 'linear-gradient(180deg, #0b0f2a 0%, #0e1535 65%, #111827 100%)',
        paddingTop: '7rem',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300, pointerEvents: 'none',
          background: `radial-gradient(circle, ${color}15, transparent 70%)`,
          filter: 'blur(80px)',
        }} />

        <Container>
          <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '3rem 1rem 2.5rem', position: 'relative', zIndex: 1 }}>

            {/* Breadcrumb */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '1.5rem' }}>
              <button
                onClick={() => navigate('/news')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'rgba(186,230,253,0.45)', fontSize: '0.75rem', fontWeight: 500,
                  background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(186,230,253,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(186,230,253,0.45)'}
              >
                <ArrowLeft size={13} /> Actualités
              </button>
            </motion.div>

            {/* Badge catégorie */}
            {article.category && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: '1.25rem' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: 9999,
                  background: 'rgba(79,195,247,0.08)', color: '#4fc3f7',
                  border: '1px solid rgba(79,195,247,0.28)',
                }}>
                  <Tag size={10} />
                  {article.category}
                </span>
              </motion.div>
            )}

            {/* Titre */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                color: '#fff', lineHeight: 1.15, margin: '0 0 1.25rem',
              }}
            >
              {article.title}
            </motion.h1>

            {/* Excerpt */}
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{
                fontSize: '0.95rem', lineHeight: 1.8,
                color: 'rgba(186,230,253,0.58)',
                margin: '0 auto 1.75rem', maxWidth: 580,
              }}
            >
              {article.excerpt}
            </motion.p>

            {/* Meta row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '1.25rem' }}
            >
              {article.author && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(186,230,253,0.45)' }}>
                  <User size={13} style={{ color: '#4fc3f7' }} />
                  {article.author}
                </span>
              )}
              {article.published_at && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'rgba(186,230,253,0.45)' }}>
                  <Calendar size={13} style={{ color: '#4fc3f7' }} />
                  {article.published_at}
                </span>
              )}
            </motion.div>
          </div>
        </Container>

        {/* Image cover */}
        {article.cover_url && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 2rem' }}
          >
            <div style={{
              borderRadius: '16px 16px 0 0', overflow: 'hidden',
              boxShadow: '0 -12px 60px rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.07)', borderBottom: 'none',
            }}>
              <img
                src={article.cover_url}
                alt={article.title}
                style={{ width: '100%', display: 'block', maxHeight: 460, objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>
          </motion.div>
        )}

        {/* Séparateur si pas d'image */}
        {!article.cover_url && (
          <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{
              height: 60, borderRadius: '16px 16px 0 0',
              background: `linear-gradient(135deg, ${color}10, transparent)`,
              border: '1px solid rgba(255,255,255,0.05)', borderBottom: 'none',
            }} />
          </div>
        )}
      </section>

      {/* ══ CONTENU ══ */}
      <section style={{ background: '#fff', padding: '5rem 0 6rem' }}>
        <Container>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>

            {/* Ligne décorative */}
            <motion.div
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 4, borderRadius: 4, marginBottom: '3rem', transformOrigin: 'left',
                background: `linear-gradient(90deg, ${color}, transparent)`,
              }}
            />

            {/* Contenu HTML */}
            {article.content ? (
              <motion.div
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true, amount: 0.05 }}
                className="news-prose"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem 0', fontSize: '0.9rem' }}>
                Aucun contenu disponible.
              </p>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{
                marginTop: '4rem', paddingTop: '2rem',
                borderTop: '1px solid #f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
              }}
            >
              <button
                onClick={() => navigate('/news')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.875rem', fontWeight: 600, color: '#6b7280',
                  background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#0b0f2a'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
              >
                <ArrowLeft size={15} /> Tous les articles
              </button>

              {article.category && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.8rem', fontWeight: 600,
                  padding: '8px 16px', borderRadius: 10,
                  background: `${color}10`, color,
                  border: `1px solid ${color}25`,
                }}>
                  <Tag size={12} /> {article.category}
                </span>
              )}
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default NewsDetail