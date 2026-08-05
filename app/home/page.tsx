'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppState, useAppDispatch } from '@/lib/store'
import { runContextEngine } from '@/lib/context-engine'
import { useIdle } from '@/hooks/useIdle'
import { PinoAsset } from '@/components/pino/AssetPlaceholder'
import type { Meal } from '@/types/pino'

// ─── Z5a: Card Piano del giorno ──────────────────────────────────────────────

function PlanCard({ plan }: { plan: Meal[] }) {
  const router = useRouter()
  const confirmed = plan.filter(m => m.status === 'confirmed').length
  const next = plan.find(m => m.status === 'pending')

  return (
    <button
      onClick={() => router.push('/piano')}
      className="w-full rounded-2xl p-4 bg-bg-card text-left"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-text">Piano del giorno</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-surface)' }}
        >
          {confirmed}/{plan.length}
        </span>
      </div>

      {/* Timeline pasti */}
      <div className="flex items-center gap-1.5 mb-3">
        {plan.map((meal, i) => (
          <div key={meal.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full transition-colors duration-500"
              style={{
                backgroundColor:
                  meal.status === 'confirmed' ? 'var(--color-primary)' : 'var(--color-border)',
              }}
            />
            {i < plan.length - 1 && (
              <div className="h-px w-3" style={{ backgroundColor: 'var(--color-border)' }} />
            )}
          </div>
        ))}
      </div>

      {next ? (
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          Prossimo:{' '}
          <span className="font-medium text-text">{next.name}</span>
          {' · '}{next.time}
        </p>
      ) : (
        <p className="text-xs font-medium" style={{ color: 'var(--color-success)' }}>
          ✓ Giornata completata
        </p>
      )}
    </button>
  )
}

// ─── Z5b: Card Acqua ─────────────────────────────────────────────────────────

function WaterCard() {
  const router = useRouter()
  const glasses = 0
  const target = 8

  return (
    <button
      onClick={() => router.push('/acqua')}
      className="w-full rounded-2xl p-4 bg-bg-card text-left"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl">💧</span>
          <div>
            <p className="text-sm font-semibold text-text">Acqua</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {glasses}/{target} bicchieri
            </p>
          </div>
        </div>
        <div className="flex gap-1 items-end">
          {Array.from({ length: target }).map((_, i) => (
            <div
              key={i}
              className="w-2 rounded-full transition-colors"
              style={{
                height: 16 - (i % 3) * 2,
                backgroundColor: i < glasses ? '#60A5FA' : 'var(--color-border)',
              }}
            />
          ))}
        </div>
      </div>
    </button>
  )
}

// ─── Home principale ─────────────────────────────────────────────────────────

export default function HomePage() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const ctx = runContextEngine(state)
  const activeIdle = useIdle(ctx.idleSequence, 8000)

  const [showBubble, setShowBubble] = useState(false)
  const [showAction, setShowAction] = useState(false)

  // Principio 1: bubble appare dopo Pino, persiste — non scompare da sola
  useEffect(() => {
    const t1 = setTimeout(() => setShowBubble(true), 700)
    const t2 = setTimeout(() => setShowAction(true), 1100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Principio 2: azione narrativa, non tecnica
  const handlePrimaryAction = useCallback(() => {
    const a = ctx.primaryAction
    if (!a) return
    // La bubble sparisce solo alla prima azione significativa
    setShowBubble(false)
    setShowAction(false)
    switch (a.type) {
      case 'meal-confirm':
        if (a.mealId) dispatch({ type: 'CONFIRM_MEAL', payload: a.mealId })
        break
      case 'chat':
      case 'start-day':
        router.push('/chat')
        break
      case 'piano':
        router.push('/piano')
        break
      case 'water':
        router.push('/acqua')
        break
    }
  }, [ctx.primaryAction, dispatch, router])

  // Solo i codici GES-* hanno un asset visivo; gli idle interni non mostrano overlay
  const idleGestureCode = activeIdle?.startsWith('GES-') ? activeIdle : null

  return (
    <div
      className="flex flex-col bg-bg"
      style={{ height: 'calc(100dvh - var(--nav-height))', overflow: 'hidden' }}
    >
      {/* ── Z1+Z2: Scena e Pino ──────────────────────────────────────── */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: 340 }}>

        {/* Z1: Ambiente — full-bleed, nessun bordo (Principio 4) */}
        <div className="absolute inset-0">
          <PinoAsset
            code={ctx.environment}
            width="100%"
            height="100%"
            objectFit="cover"
          />
        </div>

        {/* Gradient di raccordo verso il body */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg))' }}
        />

        {/* Logo HELP — angolo in alto a sinistra */}
        <div className="absolute top-4 left-4 z-10">
          <Image src="/logo-HELP.jpeg" alt="HELP" width={90} height={36} className="object-contain rounded-lg" style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.18))' }} />
        </div>

        {/* Z2: Pino — presente, non entra in scena (Principio 5) */}
        <div className="absolute inset-0 flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Principio 3: respiro idle permanente */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
              style={{ width: 200, height: 260 }}
            >
              <PinoAsset
                code={ctx.pose}
                width={200}
                height={260}
                objectFit="contain"
                className="absolute inset-0"
              />
              <div className="absolute top-0 left-0 w-full" style={{ height: '45%' }}>
                <PinoAsset
                  code={ctx.expression}
                  width="100%"
                  height="100%"
                  objectFit="contain"
                />
              </div>
              {/* Principio 3: overlay azione idle spontanea */}
              <AnimatePresence>
                {idleGestureCode && (
                  <motion.div
                    key={idleGestureCode}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PinoAsset
                      code={idleGestureCode}
                      width={200}
                      height={260}
                      objectFit="contain"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Z3+Z4: Bubble e azione ───────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pt-2 pb-3 space-y-2.5">

        {/* Z3: Bubble — Principio 1: persiste fino ad azione o cambio schermata */}
        <AnimatePresence>
          {showBubble && (
            <motion.button
              key="bubble"
              onClick={() => router.push('/chat')}
              className="w-full text-left rounded-2xl px-4 py-3.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.97)', boxShadow: 'var(--shadow-card)' }}
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileTap={{ scale: 0.98 }}
            >
              <p className="text-sm leading-relaxed text-text">{ctx.welcomeMessage}</p>
              <p className="text-[11px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Tocca per parlare con Pino
              </p>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Z4: Azione primaria — Principio 2: narrativa, non tecnica */}
        <AnimatePresence>
          {showAction && ctx.primaryAction && (
            <motion.button
              key="primary"
              onClick={handlePrimaryAction}
              className="w-full rounded-2xl px-5 py-4 font-semibold text-white flex items-center justify-between"
              style={{ backgroundColor: 'var(--color-primary)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              whileTap={{ scale: 0.97, backgroundColor: 'var(--color-primary-hover)' }}
            >
              <span className="text-sm">{ctx.primaryAction.label}</span>
              <span className="text-base" style={{ opacity: 0.8 }}>›</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Raccordo sfumato verso le card */}
      <div
        className="flex-shrink-0 h-2 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--color-bg-card), var(--color-bg))' }}
      />

      {/* ── Z5: Card operative — scrollabili sotto la scena fissa ─────── */}
      <div
        className="flex-1 overflow-y-auto px-4 pb-4 space-y-3"
        style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <PlanCard plan={state.dailyPlan} />
        <WaterCard />
      </div>
    </div>
  )
}
