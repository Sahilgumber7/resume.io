'use client'

import { useParams } from 'next/navigation'
import ResumeBuilderShell from '@/components/builder/ResumeBuilderShell'

export default function Builder() {
  const { resumeId } = useParams()
  return <ResumeBuilderShell resumeId={resumeId} />
}
