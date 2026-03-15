import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { CheckCircle2, Users, Code2, Award, TrendingUp } from 'lucide-react'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import { fadeLeft, fadeRight, fadeUp, staggerContainer } from '../animations/fadeAnimations'

const stats = [
  { icon: Code2, value: 100, suffix: '+', label: 'Projets réalisés', color: '#0D6EFD' },
  { icon: Users, value: 50, suffix: '+', label: 'Clients satisfaits', color: '#00C2FF' },
  { icon: Award, value: 5, suffix: '+', label: "Années d'expérience", color: '#7C3AED' },
  { icon: TrendingUp, value: 98, suffix: '%', label: 'Taux de satisfaction', color: '#10B981' },
]

const highlights = [
  'Applications Web, Mobile et Desktop sur mesure',
  'Équipe d\'informaticiens expérimentés et certifiés',
  'Présence en Côte d\'Ivoire et dans la sous-région',
  'Accompagnement de A à Z : conception → déploiement',
  'Support et maintenance après livraison',
]

const StatCard = ({ stat, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(13,110,253,0.12)' }}
      className="bg-white rounded-xl2 p-6 text-center transition-all duration-300 counter-box pb-8"
      style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.07)' }}
    >
      <div
        className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center"
        style={{ background: `${stat.color}15` }}
      >
        <stat.icon size={22} style={{ color: stat.color }} />
      </div>
      <div className="text-4xl font-extrabold text-dark mb-1">
        {inView ? (
          <CountUp end={stat.value} duration={2.5} delay={index * 0.2} />
        ) : (
          '0'
        )}
        <span style={{ color: stat.color }}>{stat.suffix}</span>
      </div>
      <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
    </motion.div>
  )
}

const About = () => {
  const navigate = useNavigate()

  return (
    <section id="about" className="section-padding bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Image/Visual */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            {/* Main visual card */}
            <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(13,110,253,0.15)]">
              <div
                className="aspect-[4/3] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #0A2540, #0D3460)' }}
              >
                {/* Abstract team illustration */}
                <div className="relative w-full h-full p-8 flex items-center justify-center">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #00C2FF 1px, transparent 1px)',
                      backgroundSize: '30px 30px',
                    }}
                  />
                  {/* Central icon */}
                  <div className="relative z-10 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-[0_10px_30px_rgba(13,110,253,0.4)]"
                    >
                      <Code2 size={44} className="text-white" />
                    </motion.div>
                    <h3 className="text-white text-2xl font-bold mb-2">Salem Technology</h3>
                    <p className="text-blue-300/70 text-sm">Start-up Tech — Abidjan, CI</p>
                    {/* Mini stats */}
                    <div className="flex justify-center gap-6 mt-6">
                      {['Web', 'Mobile', 'Desktop'].map((t) => (
                        <div key={t} className="text-center">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mx-auto mb-1">
                            <span className="text-secondary text-xs font-bold">{t[0]}</span>
                          </div>
                          <span className="text-white/50 text-xs">{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl flex items-center gap-3"
              style={{ boxShadow: '0 15px 40px rgba(0,0,0,0.12)' }}
            >
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Award size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-dark text-sm">Certifiés</p>
                <p className="text-gray-400 text-xs">Experts IT</p>
              </div>
            </motion.div>

            {/* Top badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, delay: 1, repeat: Infinity }}
              className="absolute -top-4 -left-4 bg-white rounded-xl px-4 py-2 shadow-lg"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-dark">Disponible pour vos projets</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionTitle
              subtitle="À propos de nous"
              title="Une start-up tech au cœur de l'Afrique digitale"
              description="SALEM TECHNOLOGY est spécialisée dans la conception et le développement d'applications Web, Mobile et PC, avec plusieurs applications déjà déployées dans différents secteurs d'activités."
            />

            <motion.ul variants={staggerContainer} className="space-y-3 mb-8">
              {highlights.map((item) => (
                <motion.li
                  key={item}
                  variants={fadeUp}
                  className="flex items-start gap-3 text-gray-600 text-sm"
                >
                  <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex gap-4">
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => navigate('/contact')}
                className="btn-primary"
              >
                Travaillons ensemble
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                onClick={() => navigate('/portfolio')}
                className="btn-outline"
              >
                Nos réalisations
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

export default About