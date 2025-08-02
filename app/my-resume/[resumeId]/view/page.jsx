'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Lnavbar from '@/components/Lnavbar'
import { Button } from '@/components/ui/button'
import ResumePreview from '@/components/ResumePreview'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'

export default function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null)
  const params = useParams()
  const resumeId = params?.resumeId

  useEffect(() => {
    if (resumeId) {
      fetch(`/api/resumes/${resumeId}`)
        .then(res => res.json())
        .then(data => setResumeInfo(data))
        .catch(err => console.error('Failed to fetch resume:', err))
    }
  }, [resumeId])

  const handleDownload = () => {
    window.print()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${resumeInfo?.firstName ?? ''} ${resumeInfo?.lastName ?? ''} Resume`,
          text: 'Hello Everyone, This is my resume. Please open the URL to see it.',
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/my-resume/${resumeId}/view`,
        })
        console.log('Shared successfully!')
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      alert('Web Share is not supported on this device/browser.')
    }
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Lnavbar />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate AI-generated Resume is ready!
          </h2>
          <p className="text-center text-gray-400">
            Now you are ready to download your resume and share the unique
            resume URL with your friends and family.
          </p>

          <div className="flex justify-between px-6 sm:px-12 md:px-20 my-10">
            <Button onClick={handleDownload}>Download</Button>
            <Button onClick={handleShare}>Share</Button>
          </div>
        </div>
      </div>

      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}
