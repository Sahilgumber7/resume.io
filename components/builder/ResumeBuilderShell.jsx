'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, LoaderCircle } from 'lucide-react'

import FormSection from '@/components/FormSection'
import Lnavbar from '@/components/Lnavbar'
import ResumePreview from '@/components/ResumePreview'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import TemplateSelector from '@/components/TemplateSelector'
import { Button } from '@/components/ui/button'
import { DEFAULT_TEMPLATE_ID } from '@/components/template'
import SectionVisibilityDropdown from '@/components/builder/SectionVisibilityDropdown'

const DEFAULT_VISIBILITY = {
  education: true,
  experience: true,
  projects: true,
}

export default function ResumeBuilderShell({ resumeId }) {
  const [resumeInfo, setResumeInfo] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(DEFAULT_TEMPLATE_ID)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadResume = useCallback(async () => {
    if (!resumeId) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load resume')
      const data = await res.json()
      setResumeInfo({
        ...data,
        sectionVisibility: {
          ...DEFAULT_VISIBILITY,
          ...(data?.sectionVisibility || {}),
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resume')
    } finally {
      setLoading(false)
    }
  }, [resumeId])

  useEffect(() => {
    void loadResume()
  }, [loadResume])

  const contextValue = useMemo(
    () => ({ resumeInfo, setResumeInfo }),
    [resumeInfo]
  )

  return (
    <ResumeInfoContext.Provider value={contextValue}>
      <main className="min-h-screen bg-background text-foreground">
        <Lnavbar />

        <div className="w-full space-y-4 px-1 py-4 sm:space-y-6 sm:px-2 md:px-3 lg:px-4">
          <section className="surface-panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Resume Builder</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Edit content on the left and preview in real-time on the right.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border bg-card">
              <LoaderCircle className="h-6 w-6 animate-spin" />
            </div>
          ) : error ? (
            <div className="rounded-xl border bg-card p-6">
              <p className="text-sm text-destructive">{error}</p>
              <Button className="mt-4" onClick={loadResume}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 lg:gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] 2xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
              <section className="surface-panel p-5">
                <FormSection resumeId={resumeId} />
              </section>

              <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
                <div className="surface-panel p-4">
                  <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                  />
                  <div className="mt-3">
                    <SectionVisibilityDropdown resumeId={resumeId} />
                  </div>
                </div>
                <div className="surface-panel overflow-x-auto p-0 sm:p-1">
                  <ResumePreview selectedTemplate={selectedTemplate} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
    </ResumeInfoContext.Provider>
  )
}
