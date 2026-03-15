import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Linkedin, Instagram, Twitter, ArrowRight } from 'lucide-react'
import Container from './Container'

const Footer = () => {
  const year = new Date().getFullYear()

  const quickLinks = [
    { label: 'Accueil',          to: '/' },
    { label: 'Qui sommes-nous',  to: '/about' },
    { label: 'Nos services',     to: '/services' },
    { label: 'Nos solutions',    to: '/solutions' },
    { label: 'Nos réalisations', to: '/portfolio' },
    { label: 'News',             to: '/news' },
    { label: 'Contact',          to: '/contact' },
  ]

  const services = [
    'Logiciels de gestion',
    'Conception de sites web',
    'Applications mobiles',
    'Réseaux informatiques',
    'Marketing digital',
    'Conseil IT',
  ]

  const socials = [
    { icon: <Facebook size={18} />, href: '#', label: 'Facebook' },
    { icon: <Linkedin size={18} />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram size={18} />, href: '#', label: 'Instagram' },
    { icon: <Twitter size={18} />, href: '#', label: 'Twitter' },
  ]

  return (
    <footer className="bg-dark text-white">
      {/* Top gradient bar */}
      <div className="h-1 gradient-bg" />

      <div className="pt-16 pb-8">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div>
              <h3 className="text-xl font-extrabold mb-4">
                SALEM<span className="gradient-text"> TECHNOLOGY</span>
              </h3>
              <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
                Start-up spécialisée dans la conception et le développement d'applications Web, Mobile et PC. Votre partenaire digital de confiance en Côte d'Ivoire.
              </p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    whileHover={{ y: -3, scale: 1.1 }}
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center text-white/70 hover:text-white transition-all duration-300"
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
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

            {/* Services */}
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

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-widest">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-blue-200/70 text-sm">
                  <MapPin size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                  Abidjan, Côte d'Ivoire
                </li>
                <li className="flex items-start gap-3 text-blue-200/70 text-sm">
                  <Phone size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+2250708425501" className="hover:text-white transition-colors">+225 07 08 42 55 01</a>
                    <a href="tel:+2250708221901" className="hover:text-white transition-colors">+225 07 08 22 19 01</a>
                    <a href="tel:+2250504594769" className="hover:text-white transition-colors">+225 05 04 59 47 69</a>
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

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-200/50 text-sm">
              © {year} Salem Technology. Tous droits réservés.
            </p>
            
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default Footer