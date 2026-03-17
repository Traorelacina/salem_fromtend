import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Globe, Smartphone, Code2, Loader } from 'lucide-react'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import { fadeUp, staggerContainer } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'

function categoryIcon(category) {
  const cat = (category ?? '').toLowerCase()
  if (cat === 'mobile')   return Smartphone
  if (cat === 'logiciel') return Code2
  return Globe
}

const DEFAULT_COLORS = ['#0D6EFD', '#10B981', '#7C3AED', '#F59E0B', '#EF4444', '#059669']
function colorFor(index) {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length]
}

const ProjectCard = ({ project, color }) => {
  const [hovered, setHovered] = useState(false)
  const Icon = categoryIcon(project.category)
  const link = project.external_link || project.android_link || project.ios_link || null

  return (
    <motion.div
      variants={fadeUp}
      className="portfolio-item relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
    >
      {/* Card background */}
      <div
        className="portfolio-img aspect-[4/3] flex items-center justify-center relative"
        style={{
          background: project.cover_url
            ? 'transparent'
            : `linear-gradient(135deg, ${color}20, ${color}05)`,
          border: `1px solid ${color}20`,
        }}
      >
        {project.cover_url ? (
          <img
            src={project.cover_url}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
              backgroundSize: '25px 25px',
            }}
          />
        )}

        {!project.cover_url && (
          <div className="relative z-10 text-center p-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{ background: color }}
            >
              <Icon size={28} className="text-white" />
            </div>
            <h4 className="font-bold text-dark text-base mb-1">{project.title}</h4>
            <p className="text-gray-400 text-xs">{project.category}</p>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="portfolio-overlay absolute inset-0 flex flex-col items-center justify-center p-6 z-10"
          style={{ background: `linear-gradient(135deg, ${color}ee, ${color}cc)` }}
        >
          {project.client_logo_url && (
            <img
              src={project.client_logo_url}
              alt={project.client}
              className="w-10 h-10 object-contain mb-3 rounded-lg bg-white/20 p-1"
            />
          )}
          <h4 className="text-white font-bold text-lg mb-2 text-center">{project.title}</h4>
          <p className="text-white/80 text-sm text-center leading-relaxed mb-4 line-clamp-3">
            {project.short_description}
          </p>
          {link && (
            // ✅ Correction : balise <a> correctement formatée
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white font-semibold text-sm bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 transition"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={14} /> Voir le projet
            </a>
          )}
        </motion.div>
      </div>

      {/* Card footer */}
      <div className="bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {project.client_logo_url && (
              <img
                src={project.client_logo_url}
                alt={project.client}
                className="w-6 h-6 object-contain rounded flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <h4 className="font-semibold text-dark text-sm truncate">{project.title}</h4>
              <p className="text-gray-400 text-xs truncate">{project.client}</p>
            </div>
          </div>
          <span
            className="px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
            style={{ background: `${color}15`, color }}
          >
            {project.category}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

const Portfolio = () => {
  const [projects, setProjects]             = useState([])
  const [categories, setCategories]         = useState([])
  const [loading, setLoading]               = useState(true)
  const [activeCategory, setActiveCategory] = useState('Tous')

  useEffect(() => {
    fetch(`${API}/v1/portfolio`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setProjects(data.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetch(`${API}/v1/portfolio-categories`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) setCategories(data.data)
      })
      .catch(() => {})
  }, [])

  const tabs = ['Tous', ...categories.map(c => c.name)]

  const filtered = activeCategory === 'Tous'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="section-padding bg-light">
      <Container>
        <SectionTitle
          subtitle="Nos réalisations"
          title="Découvrez certaines de nos réalisations"
          description="Des projets livrés avec succès pour des clients en Côte d'Ivoire, en Afrique et en Europe."
          center
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center gap-2 mb-10 flex-wrap"
        >
          {tabs.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === cat
                  ? 'gradient-bg text-white shadow-[0_4px_15px_rgba(13,110,253,0.3)]'
                  : 'bg-white text-gray-500 hover:text-primary border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader size={32} className="animate-spin text-primary opacity-60" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 text-sm">
            Aucune réalisation dans cette catégorie.
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  color={colorFor(index)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </Container>
    </section>
  )
}

export default Portfolio
