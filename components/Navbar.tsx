import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'lucide-react'
import ThemeToggle from "@/components/ThemeToggle"


export default function Lnavbar() {
  return (
    <div>
        <nav className="w-full flex items-center justify-between px-6 md:px-10 py-4 shadow-sm bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="text-2xl font-bold text-primary tracking-tight">
          <a href='/'>
          resume<span className="text-muted-foreground">.io</span>
          </a>
        </div>
        <div className='flex  flex-row items-center gap-4'>
        <Link href="/builder" className="flex items-center space-x-2">
        Builder
        </Link>
        <ThemeToggle />
        </div>
        
      </nav>
      
    </div>
  )
}
