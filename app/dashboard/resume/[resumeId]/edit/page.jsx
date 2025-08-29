'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import FormSection from '@/components/FormSection'
import ResumePreview from '@/components/ResumePreview'
import { ResumeInfoContext } from '../../../../../components/ResumeInfoContext'
import Lnavbar from '@/components/Lnavbar'
import TemplateSelector from '@/components/TemplateSelector'

export default function EditResumePage() {
  const { resumeId } = useParams()
  const [resumeInfo, setResumeInfo] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState("template1")

  // Fetch resume info
  useEffect(() => {
    if (resumeId) {
      fetch(`/api/resumes/${resumeId}`)
        .then(res => res.json())
        .then(data => setResumeInfo(data))
        .catch(err => console.error('Failed to fetch resume info:', err))
    }
  }, [resumeId])

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div>
        <Lnavbar />
        <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
          {/* Form Section */}
          <FormSection />

          {/* Right Side: Template Selector + Resume Preview */}
          <div>
            <TemplateSelector 
              selectedTemplate={selectedTemplate} 
              setSelectedTemplate={setSelectedTemplate} 
            />
            <div className="border rounded shadow p-4">
              <ResumePreview selectedTemplate={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}
