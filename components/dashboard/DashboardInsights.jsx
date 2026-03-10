'use client'

import Link from 'next/link'
import { BarChart3, Plus, ScanText } from 'lucide-react'

export default function DashboardInsights({ resumes }) {
  const totalResumes = resumes.length
  const latestResume = resumes[0]
  const latestUpdated = latestResume?.updatedAt
    ? new Date(latestResume.updatedAt).toLocaleDateString()
    : 'No recent updates'

  return (
    <section className="mb-8 grid gap-4 md:grid-cols-2">
      <div className="surface-card p-5">
        <p className="text-sm font-medium text-muted-foreground">Overview</p>
        <p className="mt-2 text-3xl font-bold">{totalResumes}</p>
        <p className="mt-1 text-sm text-muted-foreground">Total resumes</p>
        <p className="mt-4 text-sm">
          Latest: <span className="font-medium">{latestResume?.title || 'No resumes yet'}</span>
        </p>
        <p className="text-xs text-muted-foreground">Updated {latestUpdated}</p>
      </div>

      <div className="surface-card p-5">
        <p className="text-sm font-medium text-muted-foreground">Actions</p>
        <div className="mt-4 flex flex-col gap-2">
          <Link href="/dashboard" className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-muted">
            <Plus className="mr-2 h-4 w-4" />
            Create Resume
          </Link>
          <Link href="/parser" className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-muted">
            <ScanText className="mr-2 h-4 w-4" />
            Parse Resume
          </Link>
          <Link href="/ats-tester" className="inline-flex items-center rounded-lg border px-3 py-2 text-sm hover:bg-muted">
            <BarChart3 className="mr-2 h-4 w-4" />
            Run ATS Test
          </Link>
        </div>
      </div>
    </section>
  )
}
