'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
import { PDFViewer } from '@react-pdf/renderer'
import { toast } from 'sonner'

import Lnavbar from '@/components/Lnavbar'
import FloatingSidebar from '@/components/dashboard/FloatingSidebar'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import ResumePDF from '@/components/ResumePDF'
import DownloadPDFButton from '../../../../components/DownloadPDFButton'

export default function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const resumeId = params?.resumeId
  const { user, isSignedIn } = useUser()

  useEffect(() => {
    if (!resumeId) return

    setLoading(true)
    fetch(`/api/resumes/${resumeId}`)
      .then((res) => res.json())
      .then((data) => setResumeInfo(data))
      .catch((err) => {
        console.error('Failed to fetch resume:', err)
        toast.error('Failed to load resume')
      })
      .finally(() => setLoading(false))
  }, [resumeId])

  const linkResumeToUser = useCallback(async () => {
    if (!user?.id) {
      toast.error('Please sign in first')
      return
    }

    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userClerkId: user.id }),
      })

      if (!res.ok) throw new Error('Failed to link resume')
      const updated = await res.json()
      setResumeInfo(updated)
      toast.success('Resume saved to your account')
    } catch (err) {
      console.error(err)
      toast.error('Could not save resume. Please try again')
    }
  }, [resumeId, user?.id])

  useEffect(() => {
    if (isSignedIn && resumeId && resumeInfo && !resumeInfo.userClerkId) {
      linkResumeToUser()
    }
  }, [isSignedIn, resumeId, resumeInfo, linkResumeToUser])

  const handleShare = async () => {
    if (!navigator.share) {
      toast.error('Sharing is not supported on this device')
      return
    }

    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/my-resume/${resumeId}/view`
      : `/my-resume/${resumeId}/view`

    try {
      await navigator.share({
        title: `${resumeInfo?.fullName || 'Resume'} Resume`,
        text: 'Check out my resume!',
        url: shareUrl,
      })
    } catch (err) {
      if (err?.name !== 'AbortError') {
        toast.error('Unable to share right now')
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Lnavbar />
        <FloatingSidebar />
        <section className="px-4 py-6 md:pl-24 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
              Loading resume preview...
            </div>
          </div>
        </section>
      </main>
    )
  }

  if (!resumeInfo) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Lnavbar />
        <FloatingSidebar />
        <section className="px-4 py-6 md:pl-24 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="surface-panel p-8 text-center text-sm text-muted-foreground">
              Resume not found.
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <main id="no-print" className="min-h-screen bg-background text-foreground">
        <Lnavbar />
        <FloatingSidebar />

        <section className="px-4 py-6 md:pl-24 sm:px-6 sm:py-8 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <div className="surface-panel p-5 sm:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold sm:text-3xl">Resume Preview</h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Review your generated resume, then download, share, or save it to your account.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border px-3 py-1">{resumeInfo.fullName || 'Untitled Resume'}</span>
                  {resumeInfo.title && <span className="rounded-full border px-3 py-1">{resumeInfo.title}</span>}
                  <span className="rounded-full border px-3 py-1">ID: {resumeId}</span>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
                <section className="surface-card overflow-hidden p-2 sm:p-3">
                  <div className="overflow-hidden rounded-2xl border bg-background">
                    <PDFViewer tabIndex={-1} style={{ width: '100%', height: '78vh' }}>
                      <ResumePDF resumeInfo={resumeInfo} />
                    </PDFViewer>
                  </div>
                </section>

                <aside className="surface-card p-5">
                  <h2 className="text-lg font-semibold">Actions</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Export your resume and keep it linked to your account.
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <DownloadPDFButton />
                    <Button variant="outline" onClick={handleShare}>Share Resume</Button>
                    {isSignedIn ? (
                      <Button variant="outline" onClick={linkResumeToUser}>Save to Account</Button>
                    ) : (
                      <SignInButton mode="redirect" redirectUrl={`/my-resume/${resumeId}/view`}>
                        <Button>Log In to Save</Button>
                      </SignInButton>
                    )}
                  </div>

                  <div className="mt-6 rounded-xl border bg-muted/20 p-4">
                    <h3 className="text-sm font-semibold">Resume Details</h3>
                    <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                      <p><span className="font-medium text-foreground">Name:</span> {resumeInfo.fullName || '-'}</p>
                      <p><span className="font-medium text-foreground">Email:</span> {resumeInfo.email || '-'}</p>
                      <p><span className="font-medium text-foreground">Phone:</span> {resumeInfo.phone || '-'}</p>
                      <p><span className="font-medium text-foreground">Title:</span> {resumeInfo.title || '-'}</p>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </section>
      </main>
    </ResumeInfoContext.Provider>
  )
}
