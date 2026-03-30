import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import CountUp from 'react-countup'
import { CheckCircle2, Code2, Award, TrendingUp } from 'lucide-react'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import aboutImg from '../assets/images/about_salem.jpeg'
import { fadeLeft, fadeUp, staggerContainer } from '../animations/fadeAnimations'

const stats = [
  { icon: Code2,      value: 100, suffix: '+', label: 'Projets réalisés',    color: '#0D6EFD' },
  { icon: Award,      value: 10,  suffix: '+', label: "Années d'expérience", color: '#7C3AED' },
  { icon: TrendingUp, value: 98,  suffix: '%', label: 'Clients satisfaits',  color: '#10B981' },
]

const highlights = [
  "Équipe d'Ingénieurs et de Techniciens expérimentés et certifiés",
  "Présence en Côte d'Ivoire et dans la sous-région",
  "Accompagnement de A à Z : conception → déploiement",
  "Support et maintenance après livraison",
]

const StatCard = ({ stat, index }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(13,110,253,0.13)' }}
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: `${stat.color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 1rem',
      }}>
        <stat.icon size={24} style={{ color: stat.color }} />
      </div>
      <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0b0f2a', lineHeight: 1, marginBottom: '0.4rem' }}>
        {inView ? (
          <CountUp end={stat.value} duration={2.5} delay={index * 0.2} />
        ) : '0'}
        <span style={{ color: stat.color }}>{stat.suffix}</span>
      </div>
      <p style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 600, margin: 0 }}>{stat.label}</p>
    </motion.div>
  )
}

const About = () => {
  const navigate = useNavigate()

  return (
    <section id="about" style={{ padding: '5rem 0', background: '#fff', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 5rem;
        }
        @media (max-width: 1023px) {
          .about-grid { grid-template-columns: 1fr; gap: 3rem; }
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 767px) {
          .stats-grid { grid-template-columns: 1fr; gap: 1rem; }
        }
        @media (min-width: 480px) and (max-width: 767px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .about-img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(13,110,253,0.14);
          aspect-ratio: 4/3;
          background: linear-gradient(135deg, #0A2540, #0D3460);
        }
        .about-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: absolute;
          inset: 0;
          transition: transform 0.6s ease;
        }
        .about-img-wrap:hover img { transform: scale(1.03); }
        .about-img-wrap .dot-pattern {
          position: absolute; inset: 0; opacity: 0.08; z-index: 1; pointer-events: none;
          background-image: radial-gradient(circle, #00C2FF 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .badge-available {
          position: absolute; top: -16px; left: -16px;
          background: #fff; border-radius: 12px; padding: 8px 16px;
          box-shadow: 0 8px 28px rgba(0,0,0,0.10);
          display: flex; align-items: center; gap: 8px;
          z-index: 10; white-space: nowrap;
        }
        @media (max-width: 480px) {
          .badge-available { top: -12px; left: 12px; }
        }

        .highlight-item {
          display: flex; align-items: flex-start; gap: 10px;
          color: #475569; font-size: 0.9rem; line-height: 1.6;
        }

        .btns-wrap {
          display: flex; gap: 1rem; flex-wrap: wrap;
        }

        .btn-about {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 11px 26px; border-radius: 10px;
          font-size: 0.88rem; font-weight: 700;
          cursor: pointer; border: none;
          font-family: 'DM Sans', sans-serif;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .btn-about.primary {
          background: linear-gradient(135deg, #0D6EFD, #0a54c7);
          color: #fff;
          box-shadow: 0 4px 18px rgba(13,110,253,0.30);
        }
        .btn-about.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(13,110,253,0.40);
        }
        .btn-about.outline {
          background: transparent; color: #0D6EFD;
          border: 1.5px solid #0D6EFD;
        }
        .btn-about.outline:hover {
          background: rgba(13,110,253,0.06);
          transform: translateY(-2px);
        }

        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>

      <Container>
        <div className="about-grid">

          {/* ══ LEFT : Image ══ */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            style={{ position: 'relative' }}
          >
            <div className="about-img-wrap">
              <div className="dot-pattern" />
              <img src={aboutImg} alt="Salem Technology — équipe" />
            </div>

            {/* Badge "Disponible" */}
            <motion.div
              className="badge-available"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
                display: 'inline-block', animation: 'pulse-dot 2s infinite',
              }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0b0f2a' }}>
                Disponible pour vos projets
              </span>
            </motion.div>

            {/* Badge "10+ ans" */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
              style={{
                position: 'absolute', bottom: '-20px', right: '-20px',
                background: '#fff', borderRadius: '16px', padding: '14px 20px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.11)',
                display: 'flex', alignItems: 'center', gap: '12px', zIndex: 10,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '12px',
                background: 'linear-gradient(135deg,#7C3AED,#5b21b6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Award size={20} color="#fff" />
              </div>
              <div>
                <p style={{ fontWeight: 800, color: '#0b0f2a', fontSize: '1.1rem', margin: 0, lineHeight: 1 }}>10+</p>
                <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: 0, fontWeight: 600 }}>ans d'expérience</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ══ RIGHT : Texte ══ */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <SectionTitle
              subtitle="À propos de nous"
              title="Une Agence IT au cœur de l'Afrique digitale depuis 2015"
              description="SALEM TECHNOLOGY est spécialisée dans la conception et le développement d'applications Web, Mobile et Desktop, avec plusieurs solutions déjà déployées dans divers secteurs d'activité. La vidéosurveillance ainsi que l'installation de GPS trackers font également partie de notre champ d'action."
            />

            <motion.ul
              variants={staggerContainer}
              style={{
                listStyle: 'none', padding: 0, margin: '0 0 2rem',
                display: 'flex', flexDirection: 'column', gap: '0.9rem',
              }}
            >
              {highlights.map((item) => (
                <motion.li key={item} variants={fadeUp} className="highlight-item">
                  <CheckCircle2 size={18} style={{ color: '#0D6EFD', flexShrink: 0, marginTop: '2px' }} />
                  {item}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="btns-wrap">
              <button className="btn-about primary" onClick={() => navigate('/contact')}>
                Travaillons ensemble
              </button>
              <button className="btn-about outline" onClick={() => navigate('/portfolio')}>
                Nos réalisations
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* ══ Stats ══ */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="stats-grid"
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