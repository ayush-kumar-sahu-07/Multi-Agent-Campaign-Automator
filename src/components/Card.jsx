import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  variant = 'glass',
  animate = true,
  ...props 
}) => {
  const variants = {
    glass: 'glass',
    glassDark: 'glass-dark',
    solid: 'bg-dark-800 border border-dark-600',
    gradient: 'bg-gradient-to-br from-dark-800 to-dark-900 border border-white/10'
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const Component = animate ? motion.div : 'div'
  const animationProps = animate ? {
    initial: "hidden",
    animate: "visible",
    variants: cardVariants
  } : {}

  return (
    <Component
      className={`${variants[variant]} rounded-2xl p-6 ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
