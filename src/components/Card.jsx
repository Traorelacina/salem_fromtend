import { motion } from 'framer-motion'
import { fadeUp } from '../animations/fadeAnimations'

const Card = ({ children, className = '', hover = true }) => {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={
        hover
          ? {
              y: -8,
              boxShadow: '0 20px 60px rgba(13,110,253,0.15)',
              transition: { duration: 0.3 },
            }
          : {}
      }
      className={`card ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card
