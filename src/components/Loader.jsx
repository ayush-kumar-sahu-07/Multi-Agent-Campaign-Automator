import { motion } from 'framer-motion'

const Loader = ({ size = 'md', variant = 'spinner' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          className={`${sizes[size]} border-4 border-neon-blue/30 border-t-neon-blue rounded-full`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-neon-blue rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'pulse') {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          className={`${sizes[size]} bg-gradient-to-r from-neon-blue to-neon-purple rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    )
  }

  if (variant === 'bar') {
    return (
      <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
    )
  }

  return null
}

export default Loader
