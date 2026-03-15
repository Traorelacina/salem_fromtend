import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  icon,
  ...props
}) => {
  const baseClass =
    variant === 'primary' ? 'btn-primary' : 'btn-outline'

  const Comp = href ? 'a' : 'button'

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-block"
    >
      <Comp
        href={href}
        onClick={onClick}
        className={`${baseClass} ${className}`}
        {...props}
      >
        {children}
        {icon && <span className="ml-1">{icon}</span>}
      </Comp>
    </motion.div>
  )
}

export default Button
