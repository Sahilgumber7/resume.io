'use client'

import { useMemo } from 'react'
import AddResume from '@/components/AddResume'
import ResumeCardItem from '@/components/ResumeCardItem'

export default function MyResumes({ resumes, refreshData }) {
  const uniqueResumes = useMemo(() => {
    const seen = new Set()
    return resumes.filter((resume) => {
      const id = String(resume?._id || '')
      if (!id) return true
      if (seen.has(id)) return false
      seen.add(id)
      return true
    })
  }, [resumes])

  return (
    <section className="mb-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold sm:text-3xl">My Resumes</h2>
        <span className="text-sm text-muted-foreground">{uniqueResumes.length} total</span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <AddResume />
        {uniqueResumes.map((resume, index) => (
          <div key={resume?._id || `resume-${index}`}>
            <ResumeCardItem resume={resume} refreshData={refreshData} />
          </div>
        ))}
      </div>

      {uniqueResumes.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
          No resumes yet. Use the add card to create your first resume.
        </div>
      )}
    </section>
  )
}
