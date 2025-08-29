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
        <div className="flex flex-col md:flex-row p-10">
          
          {/* Left Section */}
          <div className="flex-1 pr-0 md:pr-6">
            <FormSection />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-300"></div>

          {/* Right Section */}
          <div className="flex-1 pl-0 md:pl-6 mt-10 md:mt-0">
            <TemplateSelector 
              selectedTemplate={selectedTemplate} 
              setSelectedTemplate={setSelectedTemplate} 
            />
            <div className="border rounded shadow">
              <ResumePreview selectedTemplate={selectedTemplate} />
            </div>
          </div>

        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}
