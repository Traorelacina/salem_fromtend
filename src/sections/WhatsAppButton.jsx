import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────────
   Remplacez ce numéro par votre numéro WhatsApp
   Format international SANS le + ni les espaces
───────────────────────────────────────────── */
const WHATSAPP_NUMBER = '2250708425501'
const WHATSAPP_MESSAGE = encodeURIComponent(
  'Bonjour Salem Technology, je souhaite obtenir des informations sur vos services.'
)
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

const WhatsAppButton = () => {
  const [visible, setVisible]   = useState(false)
  const [tooltip, setTooltip]   = useState(false)
  const [pulse, setPulse]       = useState(true)

  /* Apparaît après 1.5s */
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  /* Arrête le pulse après 6s pour ne pas agacer */
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 8000)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <style>{`
        @keyframes wa-pulse {
          0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.55); }
          70%  { box-shadow: 0 0 0 16px rgba(37,211,102,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
        }
        @keyframes wa-bounce {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .wa-btn {
          animation:
            ${pulse ? 'wa-pulse 2s ease-out infinite, wa-bounce 3s ease-in-out infinite' : 'wa-bounce 3s ease-in-out infinite'};
        }
        .wa-btn:hover {
          animation: none;
          transform: scale(1.12) translateY(-3px);
        }
      `}</style>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '1.6rem',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '10px',
            }}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {tooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 12, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 12, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    background: '#fff',
                    color: '#0b0f2a',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '8px 14px',
                    borderRadius: '12px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
                    border: '1px solid rgba(37,211,102,0.25)',
                    fontFamily: "'DM Sans', sans-serif",
                    pointerEvents: 'none',
                  }}
                >
                  💬 Discutons sur WhatsApp !
                  {/* Petite flèche */}
                  <span style={{
                    position: 'absolute',
                    right: '-7px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0, height: 0,
                    borderTop: '6px solid transparent',
                    borderBottom: '6px solid transparent',
                    borderLeft: '7px solid #fff',
                  }} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bouton principal */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contactez-nous sur WhatsApp"
              className="wa-btn"
              onMouseEnter={() => setTooltip(true)}
              onMouseLeave={() => setTooltip(false)}
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none',
                boxShadow: '0 6px 24px rgba(37,211,102,0.45)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {/* Logo WhatsApp SVG officiel */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="32"
                height="32"
                fill="#fff"
              >
                <path d="M24 4C12.95 4 4 12.95 4 24c0 3.6.97 7.01 2.66 9.96L4 44l10.3-2.62A19.9 19.9 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm0 36a15.9 15.9 0 0 1-8.16-2.25l-.58-.35-6.1 1.55 1.6-5.93-.38-.6A15.92 15.92 0 0 1 8 24c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16zm8.77-11.87c-.48-.24-2.84-1.4-3.28-1.56-.44-.16-.76-.24-1.08.24-.32.48-1.24 1.56-1.52 1.88-.28.32-.56.36-1.04.12-.48-.24-2.03-.75-3.87-2.38-1.43-1.27-2.4-2.84-2.68-3.32-.28-.48-.03-.74.21-.98.22-.21.48-.56.72-.84.24-.28.32-.48.48-.8.16-.32.08-.6-.04-.84-.12-.24-1.08-2.6-1.48-3.56-.39-.93-.78-.8-1.08-.82l-.92-.02c-.32 0-.84.12-1.28.6s-1.68 1.64-1.68 4 1.72 4.64 1.96 4.96c.24.32 3.38 5.16 8.2 7.24 1.15.5 2.04.8 2.74 1.02 1.15.36 2.2.31 3.02.19.92-.14 2.84-1.16 3.24-2.28.4-1.12.4-2.08.28-2.28-.12-.2-.44-.32-.92-.56z" />
              </svg>
            </a>

            {/* Badge notification */}
            {pulse && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  top: tooltip ? 'auto' : 0,
                  right: 0,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.55rem',
                  color: '#fff',
                  fontWeight: 800,
                  pointerEvents: 'none',
                }}
              >
                1
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default WhatsAppButton