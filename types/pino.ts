// Tutti i tipi relativi al personaggio Pino e alla libreria grafica.

export type ExpressionCode =
  | 'ESP-NEU-BASE-3'
  | 'ESP-POS-BASE-3'
  | 'ESP-EMP-BASE-3'
  | 'ESP-INC-BASE-3'
  | 'ESP-PEN-BASE-3'
  | 'ESP-SCH-BASE-3'
  | 'ESP-DEL-BASE-3'
  | string // permette futuri codici senza rompe i tipi esistenti

export type PoseCode =
  | 'POS-BEN-BASE-34'
  | 'POS-BEN-BASE-F'
  | 'POS-DIA-BASE-F'
  | 'POS-DIA-BASE-34'
  | 'POS-ATT-BASE-F'
  | 'POS-REA-BASE-F'
  | 'POS-CON-BASE-F'
  | string

export type GestureCode =
  | 'GES-STR-SALUTO'
  | 'GES-STR-CONFERMA'
  | 'GES-STR-OCCHIALI'
  | 'GES-STR-FORCHETTA'
  | 'GES-STR-INCORAGGIAMENTO'
  | string

export type EnvironmentCode =
  | 'AMB-DOM-CALDO-M'
  | 'AMB-DOM-CALDO-S'
  | 'AMB-NEU-BASE-M'
  | 'AMB-APE-BASE-M'
  | string

export type OutfitCode = 'ABB-BASE-STANDARD' | string

export type ObjectCode = 'OGG-IDE-FORCHETTA-BASE' | string

export type PinoMood = 'neutral' | 'positive' | 'empathetic' | 'encouraging' | 'thoughtful'

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night'

export interface PinoSceneConfig {
  expression: ExpressionCode
  pose: PoseCode
  environment?: EnvironmentCode
  outfit?: OutfitCode
  gesture?: GestureCode
}

// ─── Piano alimentare ───────────────────────────────────────────────────────

export type MealStatus = 'pending' | 'confirmed' | 'skipped'

export interface MealItem {
  name: string
  quantity: string
  unit: string
}

export interface Meal {
  id: string
  name: string
  time: string
  items: MealItem[]
  status: MealStatus
}

// ─── Stato app ──────────────────────────────────────────────────────────────

export interface AppState {
  userName: string | null
  breakfastTime: string | null
  onboardingCompleted: boolean
  dailyPlan: Meal[]
  pinoMood: PinoMood
  timeOfDay: TimeOfDay
  lastAction: string | null
}
