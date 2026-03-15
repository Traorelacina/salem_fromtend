// Hover animation variants and utilities

export const hoverLift = {
  whileHover: {
    y: -8,
    boxShadow: '0 20px 60px rgba(13,110,253,0.2)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

export const hoverGlow = {
  whileHover: {
    boxShadow: '0 0 30px rgba(13,110,253,0.5)',
    transition: { duration: 0.3 },
  },
}

export const hoverScale = {
  whileHover: { scale: 1.05, transition: { duration: 0.3 } },
  whileTap: { scale: 0.97 },
}

export const hoverIconRotate = {
  whileHover: { rotate: 15, scale: 1.15, transition: { duration: 0.3 } },
}

export const floatingAnimation = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const floatingDelayed = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 5,
      delay: 1,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
