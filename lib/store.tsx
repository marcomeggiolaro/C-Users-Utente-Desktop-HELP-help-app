'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react'
import { AppState, Meal, PinoMood, TimeOfDay } from '@/types/pino'
import { MOCK_DAILY_PLAN } from '@/lib/mock-data'

// ─── Stato iniziale ──────────────────────────────────────────────────────────

const initialState: AppState = {
  userName: null,
  breakfastTime: null,
  onboardingCompleted: false,
  dailyPlan: MOCK_DAILY_PLAN,
  pinoMood: 'neutral',
  timeOfDay: getTimeOfDay(),
  lastAction: null,
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'morning'
  if (h >= 12 && h < 17) return 'afternoon'
  if (h >= 17 && h < 22) return 'evening'
  return 'night'
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'SET_BREAKFAST_TIME'; payload: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'CONFIRM_MEAL'; payload: string }
  | { type: 'SET_PINO_MOOD'; payload: PinoMood }
  | { type: 'HYDRATE'; payload: Partial<AppState> }

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER_NAME':
      return { ...state, userName: action.payload }
    case 'SET_BREAKFAST_TIME':
      return { ...state, breakfastTime: action.payload }
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingCompleted: true }
    case 'CONFIRM_MEAL': {
      const updated = state.dailyPlan.map((m) =>
        m.id === action.payload ? { ...m, status: 'confirmed' as const } : m
      )
      return { ...state, dailyPlan: updated, lastAction: 'meal_confirmed', pinoMood: 'positive' }
    }
    case 'SET_PINO_MOOD':
      return { ...state, pinoMood: action.payload }
    case 'HYDRATE':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextValue | null>(null)

const STORAGE_KEY = 'help-app-state'

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Idrata dallo storage al mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AppState>
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {
      // storage non disponibile — ok
    }
  }, [])

  // Persiste ogni cambio di stato
  useEffect(() => {
    try {
      // Non persistere il piano completo — troppo verboso; persiste solo metadati
      const { dailyPlan: _, ...rest } = state
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rest))
    } catch {
      // storage non disponibile — ok
    }
  }, [state])

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve essere usato dentro AppProvider')
  return ctx
}

export function useAppState() {
  return useApp().state
}

export function useAppDispatch() {
  return useApp().dispatch
}
