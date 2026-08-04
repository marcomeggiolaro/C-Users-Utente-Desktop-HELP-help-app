// Risposte pre-scriptate di Pino per la chat del Gate Demo 1.
// Le risposte rispettano il tono del Character Bible:
// amicale, mai tecnico, mai giudicante, leggero.

export interface PinoResponse {
  keywords: string[]
  response: string
}

export const PINO_RESPONSES: PinoResponse[] = [
  // Saluti
  {
    keywords: ['ciao', 'salve', 'buongiorno', 'buonasera', 'hey'],
    response: 'Eccoti! Stavo pensando a te. Come stai andando oggi?',
  },
  // Dieta
  {
    keywords: ['dieta', 'piano', 'mangiare', 'cibo', 'alimentazione'],
    response: 'Il tuo piano è lì, pronto. Un passo alla volta — non serve essere perfetti, serve essere costanti.',
  },
  // Difficoltà / fatica
  {
    keywords: ['difficile', 'fatica', 'stanco', 'stanca', 'non ce la faccio', 'mollare'],
    response: 'Lo so che costa. Ma sai una cosa? Il fatto che tu sia qui a dirmelo vuol dire che non hai mollato. E questo conta tantissimo.',
  },
  // Sgarro / errore
  {
    keywords: ['sgarrato', 'sbagliato', 'colpa', 'errore', 'mangiato male', 'pizza', 'dolce'],
    response: 'Succede. Davvero. Un pasto fuori piano non cancella tutto quello che hai fatto. Si ricomincia dal prossimo pasto, senza drammi.',
  },
  // Peso / risultati
  {
    keywords: ['peso', 'bilancia', 'chili', 'risultati', 'dimagrire'],
    response: 'Questi discorsi li fai con il tuo dottore — lui ha tutti i dati giusti. Io ti aiuto a seguire quello che ti ha detto.',
  },
  // Motivazione
  {
    keywords: ['motivazione', 'aiuto', 'forza', 'spronami', 'incoraggiami'],
    response: 'Sai qual è la cosa bella? Non devi sentirti motivato ogni giorno. Devi solo farlo. La motivazione arriva dopo, non prima.',
  },
  // Ricette / alternative
  {
    keywords: ['ricetta', 'alternativa', 'sostituire', 'invece di', 'posso mangiare'],
    response: 'Quella la sa solo il tuo dottore. Se hai dubbi su qualche sostituzione, è lui la persona giusta da sentire.',
  },
  // Acqua
  {
    keywords: ['acqua', 'bere', 'idratazione'],
    response: 'Ah sì, l\'acqua. Sempre quella che si dimentica per prima. Quanto ne hai bevuta oggi?',
  },
  // Come stai
  {
    keywords: ['come stai', 'stai bene', 'tutto ok'],
    response: 'Io sto bene! Stavo qui, a tenermi il posto. E tu — com\'è andata oggi?',
  },
  // Grazie
  {
    keywords: ['grazie', 'sei gentile', 'bravo'],
    response: 'Ci sono. Sempre. È il mio lavoro preferito.',
  },
]

// Risposta di default quando nessun keyword corrisponde.
export const DEFAULT_RESPONSE =
  'Capito. Non so se posso aiutarti su questo, ma sono qui se vuoi parlare di come sta andando la giornata.'

export function getPinoResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase()
  const match = PINO_RESPONSES.find((r) =>
    r.keywords.some((kw) => lower.includes(kw))
  )
  return match ? match.response : DEFAULT_RESPONSE
}
