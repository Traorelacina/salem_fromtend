// Shared scroll animation config for useInView + motion

export const scrollRevealConfig = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.2 },
}

export const scrollRevealConfigEarly = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.1 },
}

// AOS default config
export const aosConfig = {
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 80,
}
