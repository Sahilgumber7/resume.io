'use client'

import React, { useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import Summary from './forms/Summary'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import ThemeColor from './ThemeColor'

export default function FormSection({ resumeInfo, setResumeInfo }) {
  const [activeFormIndex, setActiveFormIndex] = useState(1)
  const [enableNext, setEnableNext] = useState(true)

  const { resumeId } = useParams()
  const router = useRouter()

  const goToNext = () => {
    if (activeFormIndex === 5) {
      router.push(`/my-resume/${resumeId}/view`)
    } else {
      setActiveFormIndex(activeFormIndex + 1)
    }
  }

  return (
    <div>
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-5 items-center">
          <Link href="/dashboard">
            <Button variant="outline">
              <Home className="w-4 h-4 mr-2" /> Dashboard
            </Button>
          </Link>
          <ThemeColor />
        </div>

        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <Button
            size="sm"
            onClick={goToNext}
            disabled={!enableNext}
            className="flex gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Form Sections */}
      {activeFormIndex === 1 ? (
        <PersonalDetail enabledNext={v => setEnableNext(v)} resumeInfo={resumeInfo} setResumeInfo={setResumeInfo} />
      ) : activeFormIndex === 2 ? (
        <Summary enabledNext={v => setEnableNext(v)} resumeInfo={resumeInfo} setResumeInfo={setResumeInfo} />
      ) : activeFormIndex === 3 ? (
        <Experience resumeInfo={resumeInfo} setResumeInfo={setResumeInfo} />
      ) : activeFormIndex === 4 ? (
        <Education resumeInfo={resumeInfo} setResumeInfo={setResumeInfo} />
      ) : activeFormIndex === 5 ? (
        <Skills resumeInfo={resumeInfo} setResumeInfo={setResumeInfo} />
      ) : null}
    </div>
  )
}
