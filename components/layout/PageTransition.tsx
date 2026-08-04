'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Transizione tra pagine — slide orizzontale leggera.
// Avvolta intorno al contenuto principale nel layout.

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
