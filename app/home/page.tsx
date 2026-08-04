'use client'

// HO-01 — Home con Daily Welcome Scene (versione tecnica Sprint 0).
// Mostra il tema definitivo, i placeholder dei primi asset, la NavBar funzionante.
// Verrà sostituita con la versione completa durante Sprint 3.

import { motion } from 'framer-motion'
import { PinoScene } from '@/components/pino/PinoScene'
import { useAppState } from '@/lib/store'

const SPRINT0_MESSAGE =
  '🍴 Sono Pino. Per ora sono solo un placeholder — ma presto sarò qui per te ogni giorno.'

export default function HomePage() {
  const { userName, dailyPlan } = useAppState()

  const confirmedCount = dailyPlan.filter((m) => m.status === 'confirmed').length
  const totalCount = dailyPlan.length

  return (
    <div className="flex flex-col min-h-screen bg-bg">

      {/* ─── Scena Pino ─── */}
      <PinoScene
        config={{
          expression: 'ESP-NEU-BASE-3',
          pose: 'POS-BEN-BASE-34',
          environment: 'AMB-DOM-CALDO-M',
          outfit: 'ABB-BASE-STANDARD',
        }}
        message={SPRINT0_MESSAGE}
        height={260}
      />

      {/* ─── Corpo pagina ─── */}
      <div className="flex-1 px-4 pt-5 pb-4 space-y-4">

        {/* Saluto */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-2xl font-bold text-text">
            {userName ? `Ciao, ${userName}!` : 'Ciao!'}
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Oggi hai {totalCount} pasti nel piano.
          </p>
        </motion.div>

        {/* Card piano del giorno */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 bg-bg-card"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-text">Piano del giorno</h2>
            <span className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded-full">
              {confirmedCount}/{totalCount} confermati
            </span>
          </div>

          <div className="space-y-2">
            {dailyPlan.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between py-2 border-b border-border-light last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-text">{meal.name}</p>
                  <p className="text-xs text-text-muted">{meal.time}</p>
                </div>
                <StatusBadge status={meal.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Badge Sprint 0 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="rounded-xl px-4 py-3 flex items-center gap-3"
          style={{
            backgroundColor: 'var(--color-accent-light)',
            border: '1px solid var(--color-accent)',
          }}
        >
          <span className="text-lg">✓</span>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-accent)' }}>
              Sprint 0 completato
            </p>
            <p className="text-xs text-text-secondary">
              Progetto su Vercel · Asset placeholder attivi · Tema definitivo
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    pending: { label: 'Da fare', color: 'var(--color-text-muted)', bg: 'var(--color-border-light)' },
    confirmed: { label: 'Confermato', color: 'var(--color-success)', bg: 'var(--color-accent-light)' },
    skipped: { label: 'Saltato', color: 'var(--color-error)', bg: '#FEE2E2' },
  }[status] ?? { label: status, color: 'var(--color-text-muted)', bg: 'var(--color-border-light)' }

  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  )
}
