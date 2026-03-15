import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Calendar, Tag, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import { fadeUp, staggerContainer } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'

const COLORS    = ['#0D6EFD', '#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#059669']
const BG_COLORS = ['#EBF3FF', '#F0EAFF', '#E6FBF4', '#FEF9EC', '#FEF2F2', '#E6FAF4']
const colorFor  = i => COLORS[i % COLORS.length]
const bgFor     = i => BG_COLORS[i % BG_COLORS.length]

const NewsCard = ({ article, index }) => {
  const navigate = useNavigate()
  const color = colorFor(index)
  const bg    = bgFor(index)

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -8, boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
      onClick={() => navigate(`/news/${article.slug}`)}
      className="news-card bg-white rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.07)' }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden h-48 flex items-center justify-center"
        style={{ background: article.cover_url ? 'transparent' : bg }}
      >
        {article.cover_url ? (
          <img
            src={article.cover_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
            <div className="relative z-10 text-center p-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: color }}
              >
                <Tag size={24} className="text-white" />
              </div>
              {article.category && (
                <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${color}20`, color }}>
                  {article.category}
                </span>
              )}
            </div>
          </>
        )}

        {article.category && (
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: color }}>
              {article.category}
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6">
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          {article.published_at && (
            <span className="flex items-center gap-1.5"><Calendar size={12} />{article.published_at}</span>
          )}

        </div>

        <h3 className="font-bold text-dark text-base leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        <div className="flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color }}>
          Lire l'article <ArrowRight size={14} />
        </div>
      </div>
    </motion.article>
  )
}

const News = () => {
  const navigate  = useNavigate()
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(1)
  const [meta, setMeta]         = useState({})

  const load = (p = 1) => {
    setLoading(true)
    fetch(`${API}/v1/news?per_page=9&page=${p}`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data.success) { setArticles(data.data ?? []); setMeta(data.meta ?? {}) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page])

  return (
    <section id="news" className="section-padding bg-white">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <SectionTitle
            subtitle="Notre blog"
            title="À la découverte de nos nouvelles"
            description="Explorez des articles riches d'expériences et de conseils pratiques."
          />
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate('/news')}
            whileHover={{ x: 4 }}
            className="flex items-center gap-2 text-primary font-semibold text-sm whitespace-nowrap mb-14 bg-transparent border-none cursor-pointer"
          >
            Tous les articles <ArrowRight size={16} />
          </motion.button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader size={32} className="animate-spin text-primary opacity-60" />
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">Aucun article publié pour le moment.</div>
        )}

        {!loading && articles.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={staggerContainer}
              initial="hidden" animate="visible" exit={{ opacity: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {articles.map((article, index) => (
                <NewsCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage(p => p - 1)} disabled={page <= 1}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition disabled:opacity-30 disabled:cursor-not-allowed"
            >← Précédent</button>
            <span className="text-sm text-gray-400">Page {page} / {meta.last_page}</span>
            <button
              onClick={() => setPage(p => p + 1)} disabled={page >= meta.last_page}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-500 hover:text-primary hover:border-primary transition disabled:opacity-30 disabled:cursor-not-allowed"
            >Suivant →</button>
          </div>
        )}
      </Container>
    </section>
  )
}

export default News