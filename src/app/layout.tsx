import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Andre Philippe AI Team - Dashboard',
  description: 'Mission Control + Dev Studio Dashboards',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}
