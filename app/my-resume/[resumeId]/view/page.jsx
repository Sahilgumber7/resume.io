'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useUser, SignInButton } from '@clerk/nextjs'
import Lnavbar from '@/components/Lnavbar'
import { Button } from '@/components/ui/button'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { toast } from 'sonner'
import { PDFViewer } from '@react-pdf/renderer'
import ResumePDF from '@/components/ResumePDF'
import DownloadPDFButton from '../../../../components/DownloadPDFButton'

export default function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null)
  const params = useParams()
  const resumeId = params?.resumeId
  const { user, isSignedIn } = useUser()

  // Fetch resume data
  useEffect(() => {
    if (resumeId) {
      fetch(`/api/resumes/${resumeId}`)
        .then(res => res.json())
        .then(data => setResumeInfo(data))
        .catch(err => console.error('Failed to fetch resume:', err))
    }
  }, [resumeId])

  // Save resume to user account
  const linkResumeToUser = async () => {
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userClerkId: user.id }),
      })

      if (!res.ok) throw new Error('Failed to link resume')
      const updated = await res.json()
      setResumeInfo(updated)
      toast.success('Resume saved to your account for future access!')
    } catch (err) {
      console.error(err)
      toast.error('Could not save resume. Please try again!')
    }
  }

  // Auto-link after login
  useEffect(() => {
    if (isSignedIn && resumeId && resumeInfo && !resumeInfo.userClerkId) {
      linkResumeToUser()
    }
  }, [isSignedIn, resumeId, resumeInfo])

  if (!resumeInfo) {
    return <p className="text-center my-20">Loading resume...</p>
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Lnavbar />

        {/* 🔥 Main Container with Side-by-Side Layout */}
        <div className="my-10 mx-6 md:mx-20 lg:mx-36 flex flex-col lg:flex-row gap-10">
          
          {/* LEFT: Small PDF Preview */}
          <div className="flex-1 border shadow-lg overflow-hidden">
            <PDFViewer tabIndex={-1} style={{ width: '100%', height: '80vh' }}>
              <ResumePDF resumeInfo={resumeInfo} />
            </PDFViewer >
          </div>

          {/* RIGHT: Text + Buttons */}
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl font-semibold mb-3">
              Congrats! Your AI-Generated Resume is Ready 🎉
            </h2>
            <p className="text-gray-500 mb-6">
              You can download, share, or save your resume for future access. 
              Preview is on the left.
            </p>

            <div className="flex flex-wrap gap-4 mb-6">
              <DownloadPDFButton resumeInfo={resumeInfo} />
              <Button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${resumeInfo.fullName} Resume`,
                      text: 'Check out my resume!',
                      url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-resume/${resumeId}/view`,
                    })
                  } else {
                    toast.error('Sharing not supported on this device')
                  }
                }}
              >
                Share
              </Button>
              <Button onClick={linkResumeToUser}>Save</Button>
            </div>

            {!isSignedIn && (
              <div className="mt-4">
                <p className="text-gray-500 text-sm mb-2">
                  Log in to save your resume for future access.
                </p>
                <SignInButton
                  mode="redirect"
                  redirectUrl={`/my-resume/${resumeId}/view`}
                >
                  <Button>Log in to Save</Button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}
