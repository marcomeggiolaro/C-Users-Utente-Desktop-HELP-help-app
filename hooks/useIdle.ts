'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// Attiva azioni idle casuali dopo inattività. Ogni azione dura 2s, poi pausa idleDelay.
// Principio 3: Pino vive anche quando l'utente non interagisce.
export function useIdle(sequence: string[], idleDelay = 8000): string | null {
  const [active, setActive] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)

  const clearAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (endTimerRef.current) clearTimeout(endTimerRef.current)
  }

  const scheduleNext = useCallback(() => {
    if (!sequence.length) return
    timerRef.current = setTimeout(() => {
      const code = sequence[indexRef.current % sequence.length]
      indexRef.current++
      setActive(code)
      endTimerRef.current = setTimeout(() => {
        setActive(null)
        scheduleNext()
      }, 2000)
    }, idleDelay)
  }, [sequence, idleDelay])

  const reset = useCallback(() => {
    clearAll()
    setActive(null)
    scheduleNext()
  }, [scheduleNext])

  useEffect(() => {
    const events = ['touchstart', 'click', 'keydown', 'scroll'] as const
    events.forEach(e => window.addEventListener(e, reset, { passive: true }))
    scheduleNext()
    return () => {
      clearAll()
      events.forEach(e => window.removeEventListener(e, reset))
    }
  }, [scheduleNext, reset])

  return active
}
