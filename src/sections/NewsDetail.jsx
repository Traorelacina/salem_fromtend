import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Tag, ArrowLeft, Share2, Clock, Loader } from 'lucide-react'
import Header from '../components/Header'
import Container from '../components/Container'
import { fadeUp } from '../animations/fadeAnimations'

const API = import.meta.env.VITE_API_URL ?? '/api'

export default function NewsDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadArticle()
    window.scrollTo(0, 0)
  }, [slug])

  const loadArticle = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/v1/news/${slug}`, {
        headers: { Accept: 'application/json' }
      })
      const data = await res.json()
      
      if (data.success) {
        setArticle(data.data)
        // Charger les articles similaires si disponibles
        if (data.data.category) {
          loadRelated(data.data.category, data.data.id)
        }
      } else {
        setError("Article non trouvé")
      }
    } catch (err) {
      setError("Erreur lors du chargement de l'article")
    } finally {
      setLoading(false)
    }
  }

  const loadRelated = async (category, currentId) => {
    try {
      const res = await fetch(`${API}/v1/news?per_page=3&category=${category}`, {
        headers: { Accept: 'application/json' }
      })
      const data = await res.json()
      if (data.success) {
        // Filtrer l'article courant
        const filtered = (data.data ?? []).filter(a => a.id !== currentId)
        setRelated(filtered)
      }
    } catch (err) {
      console.error('Erreur chargement articles similaires:', err)
    }
  }

  // ✅ Fonction de formatage de date sécurisée
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date non disponible'
    
    try {
      const date = new Date(dateStr)
      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        return 'Date non disponible'
      }
      
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric', 
        month: 'long', 
        year: 'numeric'
      })
    } catch (e) {
      return 'Date non disponible'
    }
  }

  // ✅ Fonction pour calculer le temps de lecture
  const getReadingTime = (content) => {
    if (!content) return '1 min'
    const wordsPerMinute = 200
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min de lecture`
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Ici on pourrait afficher un toast
      alert('Lien copié dans le presse-papier')
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader size={40} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-400">Chargement de l'article...</p>
          </div>
        </div>
      </>
    )
  }

  if (error || !article) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-6xl mb-4">📄</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Article non trouvé</h1>
            <p className="text-gray-500 mb-6">{error || "L'article que vous recherchez n'existe pas ou a été déplacé."}</p>
            <button
              onClick={() => navigate('/news')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition"
            >
              <ArrowLeft size={18} /> Retour aux articles
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      
      <main className="bg-white min-h-screen pt-24 md:pt-28">
        {/* Hero section avec image */}
        <div className="relative h-[50vh] md:h-[60vh] min-h-[400px] bg-gray-900">
          {article.cover_url ? (
            <img
              src={article.cover_url}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <Container className="relative h-full flex items-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pb-12 md:pb-16 text-white max-w-4xl"
            >
              {/* Catégorie */}
              {article.category && (
                <div className="mb-4">
                  <span className="px-4 py-1.5 bg-primary rounded-full text-xs font-bold uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
              )}
              
              {/* Titre */}
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
              
              {/* Métadonnées - avec vérifications */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-200">
                {article.author && (
                  <span className="flex items-center gap-1.5">
                    <User size={16} /> {article.author}
                  </span>
                )}
                
                {/* ✅ Date sécurisée */}
                {article.published_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} /> {formatDate(article.published_at)}
                  </span>
                )}
                
                {/* Temps de lecture */}
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> 
                  {getReadingTime(article.content)}
                </span>
              </div>
            </motion.div>
          </Container>
        </div>

        {/* Contenu de l'article */}
        <Container className="py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article principal */}
            <motion.article 
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="lg:col-span-8"
            >
              {/* Bouton retour et partage */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => navigate('/news')}
                  className="flex items-center gap-2 text-gray-500 hover:text-primary transition"
                >
                  <ArrowLeft size={18} /> Retour aux articles
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-600"
                >
                  <Share2 size={16} /> Partager
                </button>
              </div>

              {/* Extrait */}
              {article.excerpt && (
                <div className="mb-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-lg text-gray-700 italic leading-relaxed">
                    "{article.excerpt}"
                  </p>
                </div>
              )}

              {/* Contenu principal */}
              <div 
                className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags (si disponibles) */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>

            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Meta card */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">À propos de l'article</h3>
                  <div className="space-y-3 text-sm">
                    {/* ✅ Date sécurisée dans la sidebar */}
                    {article.published_at ? (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={16} className="text-primary" />
                        <span>Publié le {formatDate(article.published_at)}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-400">Non publié</span>
                      </div>
                    )}
                    
                    {article.author && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <User size={16} className="text-primary" />
                        <span>Par {article.author}</span>
                      </div>
                    )}
                    
                    {article.category && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Tag size={16} className="text-primary" />
                        <span>Catégorie : {article.category}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={16} className="text-primary" />
                      <span>Temps de lecture : {getReadingTime(article.content)}</span>
                    </div>
                  </div>
                </div>

                {/* Articles similaires */}
                {related.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-4">Articles similaires</h3>
                    <div className="space-y-4">
                      {related.map(rel => (
                        <button
                          key={rel.id}
                          onClick={() => navigate(`/news/${rel.slug}`)}
                          className="w-full text-left group"
                        >
                          <div className="flex gap-3">
                            {rel.cover_url ? (
                              <img 
                                src={rel.cover_url} 
                                alt={rel.title}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Tag size={20} className="text-primary/40" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition line-clamp-2">
                                {rel.title}
                              </h4>
                              <p className="text-xs text-gray-400 mt-1">
                                {rel.published_at ? formatDate(rel.published_at) : 'Date inconnue'}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </Container>
      </main>

      {/* Styles pour le contenu riche */}
      <style>{`
        .prose {
          color: #374151;
          line-height: 1.75;
        }
        .prose h1, .prose h2, .prose h3, .prose h4 {
          color: #111827;
          margin-top: 2em;
          margin-bottom: 0.5em;
        }
        .prose p {
          margin-bottom: 1.5em;
        }
        .prose img {
          border-radius: 12px;
          margin: 2em 0;
        }
        .prose blockquote {
          border-left: 4px solid #4fc3f7;
          background: #f8fafc;
          padding: 1em 1.5em;
          border-radius: 8px;
          font-style: italic;
          margin: 1.5em 0;
        }
        .prose ul, .prose ol {
          margin: 1.5em 0;
          padding-left: 1.5em;
        }
        .prose li {
          margin: 0.5em 0;
        }
        .prose a {
          color: #4fc3f7;
          text-decoration: none;
          font-weight: 500;
        }
        .prose a:hover {
          text-decoration: underline;
        }
        .prose pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5em 0;
        }
        .prose code {
          background: #f1f5f9;
          color: #0f172a;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .prose pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
      `}</style>
    </>
  )
}
