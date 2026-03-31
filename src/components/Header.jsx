import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import logoImg from '../assets/images/salem_logo.jpeg'

const navLinks = [
  { label: 'Accueil',                      href: '/',         hidden: false },
  { label: 'Qui sommes-nous',              href: '/about',    hidden: false },
  { label: 'Nos services',                 href: '/services', hidden: false },
  { label: 'Nos solutions et réalisations', href: '/portfolio',hidden: false },
  { label: 'News',                         href: '/news',     hidden: true  },
  { label: 'Nos Contacts',                      href: '/contact',  hidden: false },
]

/* ── Hamburger / Close animated ── */
const HamburgerIcon = ({ open }) => (
  <div style={{ width: 24, height: 24, position: 'relative', cursor: 'pointer' }}>
    {[0, 1, 2].map((i) => {
      const styles = open
        ? [
            { transform: 'translateY(8px) rotate(45deg)', width: '100%' },
            { opacity: 0, transform: 'scaleX(0)' },
            { transform: 'translateY(-8px) rotate(-45deg)', width: '100%' },
          ]
        : [
            { transform: 'none', width: '100%' },
            { opacity: 1, transform: 'none', width: '70%' },
            { transform: 'none', width: '85%' },
          ]
      return (
        <span key={i} style={{
          display: 'block', height: '2px', borderRadius: '2px',
          background: 'currentColor',
          position: 'absolute', left: 0,
          top: i === 0 ? 4 : i === 1 ? 11 : 18,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transformOrigin: 'center',
          ...styles[i],
        }} />
      )
    })}
  </div>
)

const Header = () => {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()

  /* ── Shared tokens ── */
  const CYAN  = '#4fc3f7'
  const NAVY  = '#0b0f2a'
  const BLUE  = '#60a5fa'
  const PURE_BLUE = '#0047FF'  // Bleu pur électrique pour les textes du menu

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    setScrolled(false)
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleNav = (href) => { setMobileOpen(false); navigate(href) }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .st-header {
          font-family: 'DM Sans', sans-serif;
        }

        /* Nav link base - texte en gras et bleu pur électrique */
        .st-nav-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 1rem;        /* ↑ agrandi depuis 0.88rem */
          font-weight: 700;
          letter-spacing: 0.01em;
          white-space: nowrap;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.25s, background 0.25s;
          font-family: 'DM Sans', sans-serif;
          color: #0047FF;         /* Bleu pur électrique */
        }
        .st-nav-btn::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          height: 2px;
          width: 0;
          border-radius: 2px;
          background: ${CYAN};
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .st-nav-btn:hover::after,
        .st-nav-btn.active::after {
          width: 20px;
        }

        /* Light mode nav */
        .st-nav-btn:hover { color: #0047FF; background: rgba(79,195,247,0.07); }
        .st-nav-btn.active { color: #0047FF; background: rgba(79,195,247,0.10); font-weight: 800; }

        /* CTA button */
        .st-cta {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 10px 22px; border-radius: 10px;
          font-size: 0.86rem; font-weight: 700;
          background: linear-gradient(135deg, ${CYAN}, ${BLUE});
          color: ${NAVY}; border: none; cursor: pointer;
          box-shadow: 0 4px 18px rgba(79,195,247,0.28);
          transition: transform 0.2s, box-shadow 0.2s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .st-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 26px rgba(79,195,247,0.42);
        }

        /* Mobile item - texte en gras et bleu pur électrique */
        .st-mob-btn {
          display: block; width: 100%; text-align: left;
          padding: 13px 16px;
          border-radius: 12px;
          font-size: 1.05rem;     /* ↑ agrandi depuis 0.95rem */
          font-weight: 700;
          background: transparent; border: none; cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-family: 'DM Sans', sans-serif;
          color: #0047FF;         /* Bleu pur électrique */
        }
        .st-mob-btn:hover  { background: rgba(79,195,247,0.08); color: #0047FF; }
        .st-mob-btn.active { background: rgba(79,195,247,0.12); color: #0047FF; font-weight: 800; }

        /* Thin top accent line */
        .st-accent-line {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent 0%, ${CYAN} 40%, ${BLUE} 60%, transparent 100%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .st-accent-line.show { opacity: 1; }
      `}</style>

      <motion.header
        className="st-header"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'padding 0.4s ease, box-shadow 0.4s ease',
          /* ── Fond blanc permanent ── */
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Thin top glow line — visible quand scrolled */}
        <div className={`st-accent-line ${scrolled ? 'show' : ''}`} />

        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: scrolled ? '7px 2rem' : '13px 2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1.5rem',
          transition: 'padding 0.4s ease',
        }}>

          {/* ══ LOGO ══ */}
          <button
            onClick={() => handleNav('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
              flexShrink: 0,
            }}
          >
            {/* Logo image */}
            <img
              src={logoImg}
              alt="Salem Technology"
              style={{
                height: '56px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </button>

          {/* ══ DESKTOP NAV ══ */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}
               className="desktop-nav">
            <style>{`@media(max-width:1024px){ .desktop-nav{ display:none !important; } }`}</style>
            {navLinks.filter(l => !l.hidden).map((link) => {
              const isActive = location.pathname === link.href
              return (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={`st-nav-btn ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      style={{
                        position: 'absolute', bottom: 4, left: '50%',
                        transform: 'translateX(-50%)',
                        height: 2, width: 20, borderRadius: 2,
                        background: CYAN, display: 'block',
                      }}
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* ══ HAMBURGER ══ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Menu"
              className="hamburger-btn"
              style={{
                display: 'none',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '8px', borderRadius: '10px',
                color: NAVY,
                transition: 'background 0.2s',
              }}
            >
              <style>{`
                .hamburger-btn { display: flex !important; }
                @media(min-width:1025px){ .hamburger-btn{ display:none !important; } }
                .hamburger-btn:hover { background: rgba(0,0,0,0.06) !important; }
              `}</style>
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>

        {/* ══ MOBILE MENU ══ */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              style={{
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '12px 20px 20px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {navLinks.filter(l => !l.hidden).map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    onClick={() => handleNav(link.href)}
                    className={`st-mob-btn ${location.pathname === link.href ? 'active' : ''}`}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}

export default Header