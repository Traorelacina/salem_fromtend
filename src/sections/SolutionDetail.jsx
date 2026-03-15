import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink, Layers, Tag } from 'lucide-react'
import Container from '../components/Container'
import { fadeUp, fadeDown, staggerContainer } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'

/* ─── Skeleton ─────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse">
    <div style={{ background: '#0b0f2a', paddingTop: '7rem', paddingBottom: '2rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '3rem 1rem' }}>
        <div style={{ height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 8, width: 120, margin: '0 auto 2rem' }} />
        <div style={{ height: 48, background: 'rgba(255,255,255,0.08)', borderRadius: 8, width: '60%', margin: '0 auto 1rem' }} />
        <div style={{ height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 8, width: '80%', margin: '0 auto 0.5rem' }} />
        <div style={{ height: 16, background: 'rgba(255,255,255,0.06)', borderRadius: 8, width: '65%', margin: '0 auto' }} />
      </div>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ height: 400, background: 'rgba(255,255,255,0.05)', borderRadius: '16px 16px 0 0' }} />
      </div>
    </div>
    <div style={{ padding: '4rem 2rem' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {[100, 80, 90, 70, 85].map((w, i) => (
          <div key={i} style={{ height: 16, background: '#e5e7eb', borderRadius: 8, width: `${w}%`, marginBottom: 12 }} />
        ))}
      </div>
    </div>
  </div>
)

/* ─── Main ─────────────────────────────── */
const SolutionDetail = () => {
  const { slug } = useParams()
  const [solution, setSolution] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/v1/solutions/${slug}`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => { if (data.success) setSolution(data.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Skeleton />

  if (!solution) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center', padding: '0 1rem' }}>
      <Layers size={48} style={{ color: '#d1d5db' }} />
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0b0f2a', margin: 0 }}>Solution introuvable</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: 0 }}>Cette solution n'existe pas ou a été supprimée.</p>
      <Link to="/#solutions" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', fontWeight: 600, color: '#4fc3f7', textDecoration: 'none' }}>
        <ArrowLeft size={15} /> Retour aux solutions
      </Link>
    </div>
  )

  const color = solution.color ?? '#4fc3f7'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* ══════════════════════════════════════
          HERO — texte EN HAUT, image EN DESSOUS
      ══════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(180deg, #0b0f2a 0%, #0e1535 65%, #111827 100%)',
        paddingTop: '7rem',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Glow décoratif ── */}
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: `radial-gradient(circle, ${color}18, transparent 70%)`,
          filter: 'blur(80px)', pointerEvents: 'none',
        }} />

        {/* ── Bloc texte centré ── */}
        <Container>
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', padding: '3rem 1rem 2.5rem', position: 'relative', zIndex: 1 }}>

            {/* Breadcrumb */}
            <motion.div variants={fadeDown} initial="hidden" animate="visible" style={{ marginBottom: '1.5rem' }}>
              <Link
                to="/#solutions"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'rgba(186,230,253,0.45)', fontSize: '0.75rem', fontWeight: 500,
                  textDecoration: 'none', transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(186,230,253,0.85)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(186,230,253,0.45)'}
              >
                <ArrowLeft size={13} /> Nos solutions
              </Link>
            </motion.div>

            {/* Logo + category */}
            <motion.div
              variants={staggerContainer} initial="hidden" animate="visible"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}
            >
              {solution.logo_url && (
                <motion.div variants={fadeUp} style={{
                  width: 64, height: 64, borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}20`, border: `2px solid ${color}45`,
                  boxShadow: `0 8px 28px ${color}28`, overflow: 'hidden',
                }}>
                  <img src={solution.logo_url} alt={solution.title} style={{ width: 40, height: 40, objectFit: 'contain' }} />
                </motion.div>
              )}

              {solution.category && (
                <motion.span variants={fadeUp} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '4px 14px', borderRadius: 9999,
                  background: 'rgba(79,195,247,0.08)', color: '#4fc3f7',
                  border: '1px solid rgba(79,195,247,0.28)',
                }}>
                  <Tag size={10} />
                  {solution.category}
                </motion.span>
              )}
            </motion.div>

            {/* Titre */}
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible"
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: '#fff', lineHeight: 1.15, margin: '0 0 1rem',
              }}
            >
              {solution.title}
            </motion.h1>

            {/* Description courte */}
            <motion.p
              variants={fadeUp} initial="hidden" animate="visible"
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '0.95rem', lineHeight: 1.8,
                color: 'rgba(186,230,253,0.58)',
                margin: '0 auto', maxWidth: 560,
              }}
            >
              {solution.short_description}
            </motion.p>

            {/* CTA externe */}
            {solution.external_link && (
              <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }} style={{ marginTop: '2rem' }}>
                <motion.a
                  href={solution.external_link}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    fontWeight: 700, fontSize: '0.85rem',
                    padding: '10px 24px', borderRadius: 10,
                    background: `linear-gradient(135deg, ${color}, ${color}bb)`,
                    color: '#fff', textDecoration: 'none',
                    boxShadow: `0 8px 24px ${color}38`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  whileHover={{ y: -2 }}
                >
                  Voir la solution <ExternalLink size={14} />
                </motion.a>
              </motion.div>
            )}
          </div>
        </Container>

        {/* ── Image cover sous le texte, bords hauts arrondis ── */}
        {solution.cover_url ? (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: '100%', maxWidth: 960, margin: '0 auto', padding: '0 2rem' }}
          >
            <div style={{
              borderRadius: '16px 16px 0 0', overflow: 'hidden',
              boxShadow: '0 -12px 60px rgba(0,0,0,0.45)',
              border: '1px solid rgba(255,255,255,0.07)', borderBottom: 'none',
            }}>
              <img
                src={solution.cover_url}
                alt={solution.title}
                style={{ width: '100%', display: 'block', maxHeight: 460, objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          </motion.div>
        ) : (
          /* Séparateur décoratif si pas d'image */
          <div style={{ width: '100%', maxWidth: 960, margin: '0 auto', padding: '0 2rem' }}>
            <div style={{
              height: 80, borderRadius: '16px 16px 0 0',
              background: `linear-gradient(135deg, ${color}12, transparent)`,
              border: '1px solid rgba(255,255,255,0.05)', borderBottom: 'none',
            }} />
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          CONTENU DÉTAILLÉ
      ══════════════════════════════════════ */}
      <section style={{ background: '#fff', padding: '5rem 0' }}>
        <Container>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>

            {/* Ligne décorative */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                height: 4, borderRadius: 4, marginBottom: '3rem', transformOrigin: 'left',
                background: `linear-gradient(90deg, ${color}, transparent)`,
              }}
            />

            {/* Contenu HTML riche */}
            {solution.content ? (
              <motion.div
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true, amount: 0.1 }}
                className="prose prose-lg max-w-none
                  prose-headings:font-extrabold prose-headings:text-dark
                  prose-p:text-gray-500 prose-p:leading-relaxed
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-li:text-gray-500
                  prose-strong:text-dark
                  prose-img:rounded-2xl prose-img:shadow-lg"
                dangerouslySetInnerHTML={{ __html: solution.content }}
              />
            ) : (
              <motion.p
                variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem 0', fontSize: '0.9rem' }}
              >
                Aucun contenu détaillé disponible pour cette solution.
              </motion.p>
            )}

            {/* Footer actions */}
            <motion.div
              variants={staggerContainer} initial="hidden"
              whileInView="visible" viewport={{ once: true }}
              style={{
                marginTop: '4rem', paddingTop: '2rem',
                borderTop: '1px solid #f3f4f6',
                display: 'flex', flexWrap: 'wrap',
                alignItems: 'center', justifyContent: 'space-between', gap: 16,
              }}
            >
              <motion.div variants={fadeUp}>
                <Link
                  to="/#solutions"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '0.875rem', fontWeight: 600,
                    color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0b0f2a'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  <ArrowLeft size={15} /> Toutes les solutions
                </Link>
              </motion.div>

              {solution.external_link && (
                <motion.a
                  variants={fadeUp}
                  href={solution.external_link}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '0.875rem', fontWeight: 600,
                    padding: '10px 20px', borderRadius: 10,
                    background: `${color}10`, color, border: `1px solid ${color}28`,
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                >
                  Accéder à la solution <ArrowRight size={15} />
                </motion.a>
              )}
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  )
}

export default SolutionDetail