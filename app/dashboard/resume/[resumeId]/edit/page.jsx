'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import FormSection from '@/components/FormSection'
import ResumePreview from '@/components/ResumePreview'
import { ResumeInfoContext } from '../../../../../components/ResumeInfoContext'
import Lnavbar from '@/components/Lnavbar'

export default function EditResumePage() {
  const { resumeId } = useParams()
  const [resumeInfo, setResumeInfo] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState("template1")

  // Fetch resume info
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

          {/* Right Side: Template Switcher + Resume Preview */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Choose Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="template1">Template 1</option>
                <option value="template2">Template 2</option>
                <option value="template3">Template 3</option>
              </select>
            </div>

            {/* Resume Preview */}
            <div className="border rounded shadow p-4">
              <ResumePreview selectedTemplate={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}
