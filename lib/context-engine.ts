import type { AppState, ExpressionCode, PoseCode, EnvironmentCode, TimeOfDay } from '@/types/pino'

export type PrimaryActionType = 'meal-confirm' | 'chat' | 'piano' | 'water' | 'start-day'

export interface PrimaryAction {
  label: string
  type: PrimaryActionType
  mealId?: string
}

export interface ContextEngineOutput {
  expression: ExpressionCode
  pose: PoseCode
  environment: EnvironmentCode
  outfit: string
  welcomeMessage: string
  primaryAction: PrimaryAction | null
  // idle sequence rotates daily (Principio 5 — mai identica due giorni consecutivi)
  idleSequence: string[]
  todayVariant: number
}

// Sempre fresco — non viene dal store per evitare staleness
export function getCurrentTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 22) return 'evening'
  return 'night'
}

function getEnvironment(t: TimeOfDay): EnvironmentCode {
  // Ambienti P/S/N da produrre — fallback su M finché non esistono
  if (t === 'night') return 'AMB-NEU-BASE-M'
  return 'AMB-DOM-CALDO-M'
}

function getExpression(state: AppState): ExpressionCode {
  switch (state.pinoMood) {
    case 'positive':    return 'ESP-POS-BASE-3'
    case 'empathetic':  return 'ESP-EMP-BASE-3'
    case 'encouraging': return 'ESP-INC-BASE-3'
    case 'thoughtful':  return 'ESP-PEN-BASE-3'
    default:            return 'ESP-NEU-BASE-3'
  }
}

// Seme deterministico giornaliero — guida il Principio 5
function getDailySeed(userName: string | null): number {
  const d = new Date()
  const nameHash = [...(userName ?? 'pino')].reduce((n, c) => n + c.charCodeAt(0), 0)
  return (d.getDate() + d.getMonth() * 31 + nameHash) % 7
}

// Pool di messaggi per contesto — mai testi tecnici, sempre voce di Pino
const MSG: Record<string, string[]> = {
  morning_fresh: [
    'Buongiorno! Tutto pronto per oggi.',
    'Eccoti! Ti stavo aspettando.',
    'Buongiorno. Ho già visto il piano di oggi.',
    'Pronti? La giornata inizia bene.',
    'Buongiorno! Colazione in arrivo.',
    'Sei già qui. Bene.',
    'Buongiorno. È una bella giornata.',
  ],
  morning_ongoing: [
    'Buona mattinata! Stai andando bene.',
    'Già in movimento. Ottimo.',
    'Mattina produttiva. Continua così.',
    "Va' avanti, stai seguendo il piano.",
  ],
  afternoon_fresh: [
    'Pomeriggio! Come sta andando?',
    'Eccoti nel pomeriggio.',
    'Ciao! Come è andata stamattina?',
    'Pomeriggio. Tutto bene finora?',
  ],
  afternoon_ongoing: [
    'Buon pomeriggio. Stai seguendo il piano.',
    'Bene, sei a metà giornata.',
    'Pomeriggio. Procede.',
  ],
  evening: [
    'Buona sera! Come è andata?',
    'Eccoti la sera. Quasi fatta.',
    'Sera! Resta poco.',
    'Buona serata. Come ti senti?',
    'Quasi finita. Come è andata?',
    'Sera! Bene così.',
    'Eccoti. Giornata lunga?',
  ],
  night: [
    'Ancora sveglio?',
    'Notte tarda. Tutto okay?',
    'Tardi stasera.',
    'Ci sei ancora. Bene.',
  ],
}

// Sequence idle giornaliera — rotazione deterministica (Principio 5)
const ALL_IDLE = [
  'GES-STR-OCCHIALI', // → ha un asset code, mostra il placeholder del gesto
  'IDLE-GUARDA',      // → comportamento interno, nessun overlay visivo
  'IDLE-RESPIRO',
  'IDLE-PENSA',
]

export function runContextEngine(state: AppState): ContextEngineOutput {
  const timeOfDay = getCurrentTimeOfDay()
  const { dailyPlan, userName } = state
  const confirmed = dailyPlan.filter(m => m.status === 'confirmed').length
  const seed = getDailySeed(userName)

  // Messaggio contestuale
  let poolKey: string
  if (timeOfDay === 'morning')        poolKey = confirmed > 0 ? 'morning_ongoing' : 'morning_fresh'
  else if (timeOfDay === 'afternoon') poolKey = confirmed > 1 ? 'afternoon_ongoing' : 'afternoon_fresh'
  else if (timeOfDay === 'evening')   poolKey = 'evening'
  else                                poolKey = 'night'

  const pool = MSG[poolKey]
  const welcomeMessage = pool[seed % pool.length]

  // Azione primaria — conseguenza naturale del messaggio, non navigazione tecnica
  const nextPending = dailyPlan.find(m => m.status === 'pending')
  let primaryAction: PrimaryAction | null = null

  if (nextPending && timeOfDay !== 'night') {
    primaryAction = {
      label: `Conferma ${nextPending.name.toLowerCase()}`,
      type: 'meal-confirm',
      mealId: nextPending.id,
    }
  } else if (confirmed === 0 && timeOfDay === 'morning') {
    primaryAction = { label: 'Inizia la giornata', type: 'start-day' }
  } else if (state.lastAction === 'meal_confirmed') {
    primaryAction = { label: 'Vedi come sta andando', type: 'piano' }
  }

  // Rotazione della sequenza idle in base al seme giornaliero
  const idleSequence = [
    ...ALL_IDLE.slice(seed % ALL_IDLE.length),
    ...ALL_IDLE.slice(0, seed % ALL_IDLE.length),
  ]

  return {
    expression: getExpression(state),
    pose: 'POS-BEN-BASE-34',
    environment: getEnvironment(timeOfDay),
    outfit: 'ABB-BASE-STANDARD',
    welcomeMessage,
    primaryAction,
    idleSequence,
    todayVariant: seed,
  }
}
