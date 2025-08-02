'use client'

import React, { useEffect, useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import Summary from './forms/Summary'
import Experience from './forms/Experience'
import Education from './forms/Education'
import Skills from './forms/Skills'
import ThemeColor from './ThemeColor'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Home } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Projects from './forms/Project'

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1)
  const [enableNext, setEnableNext] = useState(true)

  const params = useParams()
  const router = useRouter()
  const resumeId = params?.resumeId

  useEffect(() => {
    if (activeFormIndex === 6) {
      router.push(`/my-resume/${resumeId}/view`)
    }
  }, [activeFormIndex, resumeId, router])

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-5">
          <Link href="/dashboard">
            <Button><Home /></Button>
          </Link>
          <ThemeColor />
        </div>
        <div className="flex gap-2">
          {activeFormIndex > 1 && (
            <Button size="sm" onClick={() => setActiveFormIndex((i) => i - 1)}>
              <ArrowLeft />
            </Button>
          )}
          <Button
            disabled={!enableNext}
            className="flex gap-2"
            size="sm"
            onClick={() => setActiveFormIndex((i) => i + 1)}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Form Steps */}
      {activeFormIndex === 1 ? (
        <PersonalDetail enabledNext={setEnableNext} />
      ) : activeFormIndex === 2 ? (
        <Summary enabledNext={setEnableNext} />
      ) : activeFormIndex === 3 ? (
        <Experience />
      ) : activeFormIndex === 4 ? (
        <Education />
      ) : activeFormIndex === 5 ? (
        <Skills />
      ) : activeFormIndex === 6 ? (
        <Projects />
      ) : null}
    </div>
  )
}

export default FormSection
