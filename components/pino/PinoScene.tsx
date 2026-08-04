'use client'

// PinoScene — Pino nel suo mondo.
// Compone ambiente + personaggio + eventuale testo in un'unica scena narrativa.

import { motion, AnimatePresence } from 'framer-motion'
import { PinoAsset } from './AssetPlaceholder'
import { PinoCharacter } from './PinoCharacter'
import type { PinoSceneConfig } from '@/types/pino'

export interface PinoSceneProps {
  config: PinoSceneConfig
  message?: string
  className?: string
  height?: number | string
}

export function PinoScene({
  config,
  message,
  className = '',
  height = 'var(--pino-scene-height)',
}: PinoSceneProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-b-3xl ${className}`}
      style={{ height }}
    >
      {/* Sfondo ambiente */}
      {config.environment ? (
        <PinoAsset
          code={config.environment}
          width="100%"
          height="100%"
          objectFit="cover"
          className="absolute inset-0"
        />
      ) : (
        /* Sfondo di fallback quando non c'è ambiente */
        <div className="absolute inset-0 bg-gradient-to-b from-primary-ultralight to-bg-surface" />
      )}

      {/* Pino posizionato al centro-basso della scena */}
      <div className="absolute inset-0 flex items-end justify-center pb-2">
        <PinoCharacter
          expression={config.expression}
          pose={config.pose}
          gesture={config.gesture}
          outfit={config.outfit}
          size="lg"
          animated
        />
      </div>

      {/* Bubble messaggio opzionale */}
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div
              className="rounded-2xl px-4 py-3 text-sm leading-relaxed text-text shadow-md"
              style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
