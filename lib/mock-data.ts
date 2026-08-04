import { Meal } from '@/types/pino'

// Piano alimentare di esempio per la demo.
// Usato quando l'utente "carica" la dieta durante l'onboarding simulato.

export const MOCK_DAILY_PLAN: Meal[] = [
  {
    id: 'meal-colazione',
    name: 'Colazione',
    time: '08:00',
    status: 'pending',
    items: [
      { name: 'Latte parzialmente scremato', quantity: '200', unit: 'ml' },
      { name: 'Fette biscottate integrali', quantity: '4', unit: 'pezzi' },
      { name: 'Marmellata senza zuccheri aggiunti', quantity: '20', unit: 'g' },
    ],
  },
  {
    id: 'meal-spuntino-mattina',
    name: 'Spuntino mattina',
    time: '10:30',
    status: 'pending',
    items: [
      { name: 'Frutto di stagione', quantity: '150', unit: 'g' },
    ],
  },
  {
    id: 'meal-pranzo',
    name: 'Pranzo',
    time: '13:00',
    status: 'pending',
    items: [
      { name: 'Pasta al pomodoro', quantity: '80', unit: 'g' },
      { name: 'Insalata mista', quantity: '100', unit: 'g' },
      { name: 'Olio extravergine di oliva', quantity: '10', unit: 'ml' },
    ],
  },
  {
    id: 'meal-merenda',
    name: 'Merenda',
    time: '16:30',
    status: 'pending',
    items: [
      { name: 'Yogurt bianco intero', quantity: '125', unit: 'g' },
    ],
  },
  {
    id: 'meal-cena',
    name: 'Cena',
    time: '20:00',
    status: 'pending',
    items: [
      { name: 'Petto di pollo alla griglia', quantity: '150', unit: 'g' },
      { name: 'Verdure miste al vapore', quantity: '200', unit: 'g' },
      { name: 'Pane integrale', quantity: '50', unit: 'g' },
    ],
  },
]

// Messaggio di Pino dopo aver "letto" la dieta demo.
export const MOCK_DIET_SUMMARY =
  'Ho visto tutto. Cinque pasti, ben distribuiti. Colazione solida, pranzo leggero, cena equilibrata. Il tuo dottore sa quello che fa — e io so come aiutarti a seguirlo.'
