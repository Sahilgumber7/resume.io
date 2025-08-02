import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'
import SyncUser from '@/components/SyncUser'
import { ResumeInfoProvider } from '@/components/ResumeInfoContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Resume.io',
  description: 'Build job winning resume',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SyncUser />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <ResumeInfoProvider>
              {children}
              <Toaster richColors position="top-right" />
            </ResumeInfoProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
