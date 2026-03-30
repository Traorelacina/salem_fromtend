import { motion } from 'framer-motion'
import { Code2, Globe, Smartphone, Network, TrendingUp, Shield, Camera, MapPin } from 'lucide-react'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import {
  fadeUp,
  fadeDown,
  zoomIn,
  staggerContainer,
} from '../animations/fadeAnimations'
import servicesImg from '../assets/images/Technologies.png'

const services = [
  {
    icon: Code2,
    title: 'Logiciels de gestion',
    description: 'Paie, Facturation, Stock, Immobilisations — logiciels opérationnels ou sur mesure selon votre métier.',
    features: ['Progiciel', 'Logiciel sur mesure', 'ERP/PGI'],
    color: '#0D6EFD',
    bg: '#EBF3FF',
  },
  {
    icon: Globe,
    title: 'Sites Web',
    description: 'Vitrine, e-commerce ou portail — design responsive, SEO optimisé, back-office inclus.',
    features: ['Design sur mesure', 'SEO optimisé', 'Responsive'],
    color: '#00C2FF',
    bg: '#E0F8FF',
  },
  {
    icon: Smartphone,
    title: 'Applications mobiles',
    description: 'Apps iOS & Android avec paiement mobile, géolocalisation et back-office web de gestion.',
    features: ['iOS & Android', 'Paiement mobile', 'Géolocalisation'],
    color: '#7C3AED',
    bg: '#F0EAFF',
  },
  {
    icon: Camera,
    title: 'Vidéosurveillance',
    description: 'Installation et configuration de systèmes de surveillance pour particuliers, entreprises et institutions.',
    features: ['Caméra IP', 'Analogique', 'Vidéophone'],
    color: '#0EA5E9',
    bg: '#E0F4FF',
  },
  {
    icon: Network,
    title: 'Réseaux informatiques',
    description: 'Réseaux locaux, serveurs dédiés et infogérance complète de votre système informatique.',
    features: ['LAN / WAN', 'Serveur dédié', 'Infogérance'],
    color: '#10B981',
    bg: '#E6FBF4',
  },
  {
    icon: TrendingUp,
    title: 'Marketing digital',
    description: "Stratégies digitales pour booster votre visibilité et augmenter votre chiffre d'affaires.",
    features: ['Réseaux sociaux', 'SEO / SEA', 'Analytics'],
    color: '#F59E0B',
    bg: '#FFF8E6',
  },
  {
    icon: Shield,
    title: 'Conseil & Audit IT',
    description: 'Audit de vos systèmes, stratégie digitale personnalisée et accompagnement sur mesure.',
    features: ['Audit système', 'Stratégie digitale', 'Formation'],
    color: '#EF4444',
    bg: '#FEF0F0',
  },
  {
    icon: MapPin,
    title: 'GPS Trackers',
    description: 'Solutions de géolocalisation en temps réel pour sécuriser et suivre vos équipements et flottes.',
    features: ['Voiture', 'Moto', 'Bateau'],
    color: '#16A34A',
    bg: '#DCFCE7',
  },
]

/* ─── ServiceCard ─────────────────────── */
const ServiceCard = ({ service }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{
      y: -8,
      scale: 1.02,
      boxShadow: `0 24px 56px ${service.color}28`,
      borderColor: `${service.color}55`,
    }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    className="bg-white rounded-2xl p-5 border border-gray-100 cursor-default overflow-hidden"
    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
  >
    <div className="flex items-start gap-4">
      <motion.div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: service.bg }}
        whileHover={{ rotate: 14, scale: 1.15 }}
        transition={{ type: 'spring', stiffness: 400, damping: 12 }}
      >
        <service.icon size={22} style={{ color: service.color }} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-dark mb-1 leading-tight">{service.title}</h3>
        <p className="text-gray-400 text-xs leading-relaxed mb-3">{service.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {service.features.map((f) => (
            <span
              key={f}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: service.bg, color: service.color }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>

    <motion.div
      className="mt-4 h-0.5 rounded-full"
      style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
      initial={{ scaleX: 0, originX: 0 }}
      whileHover={{ scaleX: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    />
  </motion.div>
)

/* ─── Main ─────────────────────────────── */
const Services = () => {
  return (
    <section id="services" className="section-padding bg-light">
      <Container>

        <motion.div
          variants={fadeDown}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <SectionTitle
  subtitle="Notre expertise"
  title="Des solutions digitales 360°"
  description="Logiciels, sites web, applications, vidéosurveillance, réseaux, marketing, audit et GPS tracking — de la conception au déploiement, nous couvrons tous vos besoins IT."
  center
/>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center mt-12">

          {/* ── Colonne gauche : 4 premiers services ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4"
          >
            {services.slice(0, 4).map((s) => (
              <ServiceCard key={s.title} service={s} />
            ))}
          </motion.div>

          {/* ── Colonne centrale — image ── */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              variants={zoomIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative w-full flex items-center justify-center"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ position: 'relative', width: '78%', margin: '0 auto' }}
              >
                {/* Glow derrière l'image */}
                <div style={{
                  position: 'absolute',
                  inset: '-30px',
                  background: 'radial-gradient(ellipse at 50% 55%, rgba(13,110,253,0.20) 0%, transparent 68%)',
                  filter: 'blur(28px)',
                  zIndex: 0,
                }} />

                <img
                  src={servicesImg}
                  alt="Nos services Salem Technology"
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    display: 'block',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    WebkitMaskImage: 'radial-gradient(ellipse 58% 62% at 50% 48%, black 15%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.15) 58%, transparent 72%)',
                    maskImage:       'radial-gradient(ellipse 58% 62% at 50% 48%, black 15%, rgba(0,0,0,0.55) 38%, rgba(0,0,0,0.15) 58%, transparent 72%)',
                    filter: 'drop-shadow(0 0 18px rgba(13,110,253,0.15))',
                  }}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* ── Colonne droite : 4 derniers services ── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col gap-4"
          >
            {services.slice(4, 8).map((s) => (
              <ServiceCard key={s.title} service={s} />
            ))}
          </motion.div>

        </div>
      </Container>
    </section>
  )
}

export default Services