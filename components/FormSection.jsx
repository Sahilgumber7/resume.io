'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Eye } from 'lucide-react'

import Education from './forms/Education'
import Experience from './forms/Experience'
import PersonalDetail from './forms/PersonalDetail'
import Projects from './forms/Project'
import Skills from './forms/Skills'
import Summary from './forms/Summary'
import ThemeColor from './ThemeColor'
import { Button } from '@/components/ui/button'

const STEP_COMPONENTS = [
  { id: 'personal', label: 'Personal', component: PersonalDetail },
  { id: 'summary', label: 'Summary', component: Summary },
  { id: 'experience', label: 'Experience', component: Experience },
  { id: 'education', label: 'Education', component: Education },
  { id: 'skills', label: 'Skills', component: Skills },
  { id: 'projects', label: 'Projects', component: Projects },
]

export default function FormSection({ resumeId }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const router = useRouter()

  const totalSteps = STEP_COMPONENTS.length
  const activeStep = STEP_COMPONENTS[activeStepIndex]
  const ActiveStepComponent = activeStep.component
  const progressPercent = useMemo(
    () => Math.round(((activeStepIndex + 1) / totalSteps) * 100),
    [activeStepIndex, totalSteps]
  )

  const onNext = () => {
    if (activeStepIndex === totalSteps - 1) {
      router.push(`/my-resume/${resumeId}/view`)
      return
    }
    setActiveStepIndex((prev) => prev + 1)
  }

  const onPrevious = () => {
    setActiveStepIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <div className="space-y-4">
      <div className="surface-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Builder Flow</p>
            <h2 className="text-lg font-semibold">
              Step {activeStepIndex + 1} of {totalSteps}: {activeStep.label}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <ThemeColor />
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/my-resume/${resumeId}/view`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>

        <div className="mt-4 h-2 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {STEP_COMPONENTS.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStepIndex(index)}
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs ${
                index === activeStepIndex
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted'
              }`}
            >
              {index < activeStepIndex ? (
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              ) : null}
              {step.label}
            </button>
          ))}
        </div>
      </div>

      <ActiveStepComponent />

      <div className="flex items-center justify-between gap-2 pt-1">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={activeStepIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={onNext}>
          {activeStepIndex === totalSteps - 1 ? 'Finish & View Resume' : 'Next Step'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
