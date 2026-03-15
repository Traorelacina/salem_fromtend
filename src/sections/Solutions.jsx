import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'

const API = import.meta.env.VITE_API_URL ?? '/api'

const Solutions = () => {

  const [solutions, setSolutions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/v1/solutions`, {
      headers: { Accept: 'application/json' }
    })
    .then(r => r.json())
    .then(data => {
      if (data.success && Array.isArray(data.data)) {
        setSolutions(data.data)
      }
    })
    .catch(() => {})
    .finally(() => setLoading(false))
  }, [])

  return (
    <section id="solutions" className="section-padding bg-gray-50">
      <Container>

        <SectionTitle
          subtitle="Nos solutions"
          title="Découvrez nos dernières solutions"
          description="Des solutions technologiques innovantes adaptées aux entreprises africaines."
          center
        />

        <div className="grid gap-10 mt-16 md:grid-cols-2 lg:grid-cols-3">
          {solutions.map(solution => (
            <motion.div
              key={solution.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden"
            >
              {/* Image */}
              <div className="h-52 overflow-hidden">
                <img
                  src={solution.cover_url}
                  alt={solution.title}
                  className="w-full h-full object-cover transition group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold mb-3">
                  {solution.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-3">
                  {solution.short_description}
                </p>

                {/* Bouton — lien direct externe */}
                <a
                  href={solution.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition"
                >
                  En savoir plus
                  <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </Container>
    </section>
  )
}

export default Solutions