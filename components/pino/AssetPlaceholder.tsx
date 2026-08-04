'use client'

// Mostra un placeholder stilizzato per gli asset grafici non ancora prodotti.
// Quando il PNG reale è disponibile in /public/pino/[folder]/[code].png,
// il componente lo carica automaticamente senza modifiche al codice.

import { useState } from 'react'

// Mappa i prefissi dei codici alle sottocartelle in /public/pino/
const CATEGORY_FOLDERS: Record<string, string> = {
  ESP: 'expressions',
  POS: 'poses',
  GES: 'gestures',
  OGG: 'objects',
  SCN: 'scenes',
  AMB: 'environments',
  ABB: 'outfits',
}

// Colori identificativi per categoria — aiutano a distinguere i placeholder visivamente
const CATEGORY_COLORS: Record<string, string> = {
  ESP: '#FEF3C7',  // amber chiaro — volto / emozione
  POS: '#EDE9FE',  // viola chiaro — corpo / posa
  GES: '#FCE7F3',  // rosa chiaro — gesto
  OGG: '#ECFDF5',  // verde chiaro — oggetto
  SCN: '#EFF6FF',  // blu chiaro — scena
  AMB: '#F0FDF4',  // verde tenue — ambiente
  ABB: '#FFF7ED',  // arancio tenue — abbigliamento
}

const CATEGORY_BORDER: Record<string, string> = {
  ESP: '#FCD34D',
  POS: '#C4B5FD',
  GES: '#F9A8D4',
  OGG: '#6EE7B7',
  SCN: '#93C5FD',
  AMB: '#86EFAC',
  ABB: '#FED7AA',
}

export interface AssetPlaceholderProps {
  code: string
  width?: number | string
  height?: number | string
  className?: string
  label?: string // testo aggiuntivo opzionale sotto il codice
}

export function AssetPlaceholder({
  code,
  width = '100%',
  height = '100%',
  className = '',
  label,
}: AssetPlaceholderProps) {
  const category = code.split('-')[0].toUpperCase()
  const bg = CATEGORY_COLORS[category] ?? '#F5F5F5'
  const border = CATEGORY_BORDER[category] ?? '#D4D4D4'

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl select-none ${className}`}
      style={{
        width,
        height,
        backgroundColor: bg,
        border: `2px dashed ${border}`,
      }}
    >
      <span
        className="font-mono text-xs font-semibold tracking-wide px-2 text-center leading-snug"
        style={{ color: border, maxWidth: '90%' }}
      >
        {code}
      </span>
      {label && (
        <span className="text-xs mt-1 text-text-muted text-center px-2">{label}</span>
      )}
    </div>
  )
}

// ─── PinoAsset ───────────────────────────────────────────────────────────────
// Componente intelligente: prova a caricare il PNG reale, fallback al placeholder.

export interface PinoAssetProps {
  code: string
  alt?: string
  width?: number | string
  height?: number | string
  className?: string
  objectFit?: 'contain' | 'cover' | 'fill'
}

export function PinoAsset({
  code,
  alt,
  width = '100%',
  height = '100%',
  className = '',
  objectFit = 'contain',
}: PinoAssetProps) {
  const [failed, setFailed] = useState(false)

  const category = code.split('-')[0].toUpperCase()
  const folder = CATEGORY_FOLDERS[category] ?? 'misc'
  const src = `/pino/${folder}/${code}.png`

  if (failed) {
    return (
      <AssetPlaceholder
        code={code}
        width={width}
        height={height}
        className={className}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? code}
      onError={() => setFailed(true)}
      className={className}
      style={{
        width,
        height,
        objectFit,
        display: 'block',
      }}
    />
  )
}
