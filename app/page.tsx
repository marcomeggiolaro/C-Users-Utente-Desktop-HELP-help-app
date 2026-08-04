import { redirect } from 'next/navigation'

// Redirect automatico - per Sprint 0 va sempre a /home.
export default function RootPage() {
  redirect('/home')
}
