'use client'

import { useParams } from 'next/navigation'
import ResumeBuilderShell from '@/components/builder/ResumeBuilderShell'

export default function EditResumePage() {
  const { resumeId } = useParams()
  return <ResumeBuilderShell resumeId={resumeId} />
}
