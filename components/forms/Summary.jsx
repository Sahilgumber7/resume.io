'use client'

import { useContext, useEffect, useState } from 'react'
import { LoaderCircle, WandSparkles } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import FormCard from './FormCard'

export default function Summary() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const { resumeId } = useParams()
  const [summary, setSummary] = useState('')
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    setSummary(resumeInfo?.summary || '')
  }, [resumeInfo?.summary])

  const handleSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary }),
      })
      if (!res.ok) throw new Error('Failed to save summary')
      setResumeInfo((prev) => ({ ...(prev || {}), summary }))
      toast.success('Summary saved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save summary')
    } finally {
      setSaving(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!summary.trim()) {
      toast.error('Write a draft summary first')
      return
    }
    setGenerating(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Rewrite this resume summary in a professional and concise tone:\n\n${summary}`,
        }),
      })
      if (!res.ok) throw new Error('AI generation failed')
      const data = await res.json()
      const generated = data?.output || ''
      setSummary(generated)
      setResumeInfo((prev) => ({ ...(prev || {}), summary: generated }))
      toast.success('AI summary generated')
    } catch (error) {
      console.error(error)
      toast.error('Failed to generate summary')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <FormCard
      title="Professional Summary"
      description="Write a short overview of your strengths and career goals."
    >
      <Textarea
        rows={8}
        value={summary}
        onChange={(e) => {
          const value = e.target.value
          setSummary(value)
          setResumeInfo((prev) => ({ ...(prev || {}), summary: value }))
        }}
        placeholder="Example: Product-focused software engineer with 4+ years of experience building scalable web apps..."
      />
      <div className="mt-4 flex flex-wrap justify-between gap-2">
        <Button variant="outline" onClick={handleGenerateAI} disabled={generating || saving}>
          {generating ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" />
              Improve with AI
            </>
          )}
        </Button>
        <Button onClick={handleSave} disabled={saving || generating}>
          {saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Save Summary'}
        </Button>
      </div>
    </FormCard>
  )
}
