import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AppProvider } from '@/lib/store'
import { NavBar } from '@/components/layout/NavBar'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'HELP!',
  description: 'Il tuo assistente alimentare personale.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo-HELP.jpeg',
    apple: '/logo-HELP.jpeg',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFFBF5',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${geist.variable} h-full`}>
      <body className="h-full bg-bg antialiased">
        <AppProvider>
          <div id="app-root">
            {children}
          </div>
          <NavBar />
        </AppProvider>
      </body>
    </html>
  )
}
