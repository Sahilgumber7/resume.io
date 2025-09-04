'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import FormSection from '@/components/FormSection'
import ResumePreview from '@/components/ResumePreview'
import Lnavbar from '@/components/Lnavbar'
import { ResumeInfoContext } from '../../../components/ResumeInfoContext'










export default function Builder() {
  const { resumeId } = useParams()
  const [resumeInfo, setResumeInfo] = useState(null)

  useEffect(() => {
    if (resumeId) {
      fetch(`/api/resumes/${resumeId}`)
        .then(res => res.json())
        .then(data => {
          setResumeInfo(data)
        })
        .catch(err => {
          console.error('Failed to fetch resume info:', err)
        })
    }
  }, [resumeId])

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div>
        <Lnavbar />
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        {/* Form Section */}
        <FormSection />

        {/* Resume Preview */}
        <ResumePreview />
      </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}