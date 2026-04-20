import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button'

const MobileMenu = ({ isOpen, onClose, isActive, isAuthenticated, onLogout }) => {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/create', label: 'Create Campaign' },
    { to: '/workflow', label: 'Workflow' },
    { to: '/brief', label: 'Final Brief' },
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : [])
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close menu overlay"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-full w-72 glass border-l border-white/10 p-6"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Menu</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-gray-300" />
              </button>
            </div>

            <nav className="space-y-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-neon-blue/20 text-neon-blue'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 space-y-3">
              {isAuthenticated ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={async () => {
                    await onLogout()
                    onClose()
                  }}
                >
                  Logout
                </Button>
              ) : (
                <>
                  <Link to="/login" onClick={onClose} className="block">
                    <Button variant="secondary" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={onClose} className="block">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
