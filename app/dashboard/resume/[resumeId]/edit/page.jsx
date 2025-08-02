'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import FormSection from '@/components/FormSection'
import ResumePreview from '@/components/ResumePreview'
import { Loader2 } from 'lucide-react'
import { useResumeInfo } from '@/components/ResumeInfoContext'

export default function EditResumePage() {
  const params = useParams()
  const resumeId = params?.resumeId
  const { resumeInfo, setResumeInfo } = useResumeInfo()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (resumeId) {
      fetch(`/api/resumes/${resumeId}`)
        .then(res => res.json())
        .then(data => {
          setResumeInfo(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to fetch resume info:', err)
          setLoading(false)
        })
    }
  }, [resumeId, setResumeInfo])

  if (loading || !resumeInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 p-6 md:p-10 gap-6 md:gap-10">
      <FormSection />
      <ResumePreview />
    </div>
  )
}
