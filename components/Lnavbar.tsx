import React from 'react'
import { Button } from "@/components/ui/button"


export default function Lnavbar() {
  return (
    <div>
        <nav className="w-full flex items-center justify-between px-6 md:px-10 py-4 shadow-sm bg-white dark:bg-zinc-900 sticky top-0 z-50">
        <div className="text-2xl font-bold text-primary tracking-tight">
          resume<span className="text-muted-foreground">.io</span>
        </div>
        <Button variant="default" size="sm">
          Build My Resume
        </Button>
      </nav>
      
    </div>
  )
}
