'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  activeColor?: string
}

// Icone inline SVG leggere — sostituite con libreria icone in futuro se necessario
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
)

const PlanIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
)

const ChatIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const WaterIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C12 2 5 10 5 14a7 7 0 0014 0c0-4-7-12-7-12z" />
  </svg>
)

const MoreIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" />
  </svg>
)

const NAV_ITEMS = [
  { href: '/home', label: 'Home', Icon: HomeIcon },
  { href: '/piano', label: 'Piano', Icon: PlanIcon },
  { href: '/chat', label: 'Chat', Icon: ChatIcon },
  { href: '/acqua', label: 'Acqua', Icon: WaterIcon },
  { href: '/altro', label: 'Altro', Icon: MoreIcon },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-bg-card border-t border-border"
      style={{
        height: 'calc(var(--nav-height) + var(--safe-bottom))',
        paddingBottom: 'var(--safe-bottom)',
        boxShadow: '0 -1px 0 rgba(0,0,0,0.06)',
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors"
            style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
          >
            <Icon active={active} />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
