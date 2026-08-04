'use client'

import { motion } from 'framer-motion'
import { PinoAsset } from './AssetPlaceholder'
import type { ExpressionCode, PoseCode, GestureCode, OutfitCode } from '@/types/pino'

export interface PinoCharacterProps {
  expression: ExpressionCode
  pose: PoseCode
  gesture?: GestureCode
  outfit?: OutfitCode
  size?: 'sm' | 'md' | 'lg' | 'full'
  animated?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { width: 80, height: 100 },
  md: { width: 140, height: 175 },
  lg: { width: 200, height: 250 },
  full: { width: '100%', height: '100%' },
}

export function PinoCharacter({
  expression,
  pose,
  gesture,
  outfit: _outfit = 'ABB-BASE-STANDARD',
  size = 'md',
  animated = true,
  className = '',
}: PinoCharacterProps) {
  const { width, height } = SIZE_MAP[size]

  const layers = (
    <>
      <PinoAsset code={pose} width={width} height={height} objectFit="contain" className="absolute inset-0" />
      <div className="absolute top-0 left-0 w-full" style={{ height: '45%' }}>
        <PinoAsset code={expression} width="100%" height="100%" objectFit="contain" />
      </div>
      {gesture && (
        <div className="absolute inset-0">
          <PinoAsset code={gesture} width={width} height={height} objectFit="contain" />
        </div>
      )}
    </>
  )

  if (!animated) {
    return (
      <div className={`relative inline-flex ${className}`} style={{ width, height }}>
        {layers}
      </div>
    )
  }

  return (
    <motion.div
      className={`relative inline-flex ${className}`}
      style={{ width, height }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        {layers}
      </motion.div>
    </motion.div>
  )
}
