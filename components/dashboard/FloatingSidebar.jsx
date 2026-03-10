'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileSearch, LayoutDashboard, ScanSearch, UserCircle2, Linkedin, FilePenLine } from 'lucide-react'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/profile',
    label: 'Profile',
    icon: UserCircle2,
  },
  {
    href: '/parser',
    label: 'Parser',
    icon: FileSearch,
  },
  {
    href: '/ats-tester',
    label: 'ATS Matcher',
    icon: ScanSearch,
  },
  {
    href: '/linkedin-analyzer',
    label: 'LinkedIn',
    icon: Linkedin,
  },
  {
    href: '/cover-letter',
    label: 'Cover Letter',
    icon: FilePenLine,
  },
]

export default function FloatingSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 md:block">
      <div className="group w-20 overflow-hidden rounded-[2rem] border bg-background/88 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:w-64">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
