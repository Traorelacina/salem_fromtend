import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '../animations/fadeAnimations'

const SectionTitle = ({
  subtitle,
  title,
  description,
  center = false,
  light = false,
}) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className={`mb-14 ${center ? 'text-center' : ''}`}
    >
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="section-subtitle"
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h2
        variants={fadeUp}
        className={`section-title ${light ? 'text-white' : ''}`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={fadeUp}
          className={`mt-4 text-base leading-relaxed max-w-xl ${
            center ? 'mx-auto' : ''
          } ${light ? 'text-blue-200' : 'text-gray-500'}`}
        >
          {description}
        </motion.p>
      )}
      <motion.div
        variants={fadeUp}
        className={`mt-5 h-1 w-14 rounded-full gradient-bg ${center ? 'mx-auto' : ''}`}
      />
    </motion.div>
  )
}

export default SectionTitle
