import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react'
import Container from './Container'

const API = import.meta.env.VITE_API_URL ?? '/api'

const Footer = () => {
  const year = new Date().getFullYear()
  const [socials, setSocials] = useState([])

  useEffect(() => {
    fetch(`${API}/v1/socials`, { headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(d => setSocials(d.data ?? []))
      .catch(() => {})
  }, [])

  const quickLinks = [
    { label: 'Accueil',                       to: '/'          },
    { label: 'Qui sommes-nous',               to: '/about'     },
    { label: 'Nos services',                  to: '/services'  },
    { label: 'Nos solutions & réalisations',  to: '/portfolio' },
    { label: 'Contact',                       to: '/contact'   },
  ]

  const services = [
    'Logiciels de gestion',
    'Conception de sites web',
    'Applications mobiles',
    'Réseaux informatiques',
    'Vidéosurveillance',
    'GPS Trackers',
  ]

  const phoneNumbers = [
    { display: '+225 07 08 42 55 01', href: 'tel:+2250708425501' },
    { display: '+225 05 04 59 47 69', href: 'tel:+2250504594769' },
    { display: '+225 07 47 11 15 70', href: 'tel:+2250747111570' },
  ]

  return (
    <footer className="bg-dark text-white">
      <div className="h-1 gradient-bg" />

      <div className="pt-16 pb-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* ── Brand ── */}
            <div>
              <h3 className="text-xl font-extrabold mb-4">
                SALEM<span className="gradient-text"> TECHNOLOGY</span>
              </h3>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
                Agence IT spécialisée dans le développement web, mobile, vidéosurveillance et GPS trackers. Votre partenaire digital de confiance en Côte d'Ivoire depuis 2015.
              </p>

              {/* ── Réseaux sociaux dynamiques avec icônes uploadées ── */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {socials.length > 0 ? (
                  socials.map(social => (
                    <motion.a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      whileHover={{ y: -3, scale: 1.1 }}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `${social.color ?? '#ffffff'}18`,
                        border: `1px solid ${social.color ?? '#ffffff'}28`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        transition: 'background 0.2s, border-color 0.2s',
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = `${social.color ?? '#ffffff'}32`
                        e.currentTarget.style.borderColor = `${social.color ?? '#ffffff'}55`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = `${social.color ?? '#ffffff'}18`
                        e.currentTarget.style.borderColor = `${social.color ?? '#ffffff'}28`
                      }}
                    >
                      {social.icon_url && (
                        <img
                          src={social.icon_url}
                          alt={social.name}
                          style={{ width: '22px', height: '22px', objectFit: 'contain' }}
                        />
                      )}
                    </motion.a>
                  ))
                ) : (
                  <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontStyle: 'italic' }}>
                    Aucun réseau configuré
                  </p>
                )}
              </div>
            </div>

            {/* ── Liens rapides ── */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
                Liens rapides
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-blue-200/70 hover:text-secondary text-sm flex items-center gap-2 group transition-colors duration-200"
                    >
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Services ── */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
                Nos services
              </h4>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s}>
                    <span className="text-blue-200/70 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full gradient-bg flex-shrink-0" />
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Contact ── */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
                Contact
              </h4>
              <ul className="space-y-4">

                <li className="flex items-start gap-3 text-blue-200/70 text-sm">
                  <MapPin size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white/85 font-medium">Plateau Dokui</p>
                    <p>En face de la SODECI</p>
                    <p>Abidjan, Côte d'Ivoire</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 text-blue-200/70 text-sm">
                  <Phone size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {phoneNumbers.map((p) => (
                      <a
                        key={p.href}
                        href={p.href}
                        style={{
                          fontFamily: "'DM Mono', 'Roboto Mono', 'Courier New', monospace",
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          letterSpacing: '0.03em',
                          whiteSpace: 'nowrap',
                          transition: 'color 0.2s',
                        }}
                        className="hover:text-white transition-colors"
                      >
                        {p.display}
                      </a>
                    ))}
                  </div>
                </li>

                <li className="flex items-center gap-3 text-blue-200/70 text-sm">
                  <Mail size={16} className="text-secondary flex-shrink-0" />
                  <a href="mailto:salemtechnology2000@gmail.com" className="hover:text-white transition-colors break-all">
                    salemtechnology2000@gmail.com
                  </a>
                </li>
              </ul>

              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-blue-200/60 mb-2">Horaires d'ouverture</p>
                <p className="text-sm text-white/80">Lun – Ven : 8h00 – 18h00</p>
                <p className="text-sm text-white/80">Sam : 9h00 – 13h00</p>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-200/50 text-sm">
              © {year} Salem Technology. Tous droits réservés.
            </p>
            <p className="text-blue-200/30 text-xs">
              Abidjan, Côte d'Ivoire
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default Footer