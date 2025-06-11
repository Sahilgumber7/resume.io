import React from 'react'
import { Button } from "@/components/ui/button"
import { Link } from 'lucide-react'


export default function Lnavbar() {
  return (
    <div>
        <nav className="w-full flex items-center justify-between px-6 md:px-10 py-4 shadow-sm bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="text-2xl font-bold text-primary tracking-tight">
          resume<span className="text-muted-foreground">.io</span>
        </div>
        <Link href="/builder" className="flex items-center space-x-2">
        Builder
        </Link>
        
      </nav>
      
    </div>
  )
}
