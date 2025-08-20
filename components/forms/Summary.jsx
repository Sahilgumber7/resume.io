'use client'

import { useEffect, useState, useContext } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)

  const { resumeId } = useParams()

  // ✅ Fetch from backend if context is empty
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return
      try {
        const res = await fetch(`/api/resumes/${resumeId}`)
        if (!res.ok) throw new Error('Failed to fetch resume data')
        const data = await res.json()
        setResumeInfo(data)
        setSummary(data.summary || '')
      } catch (error) {
        console.error('Failed to fetch resume summary:', error)
        toast.error('Could not load summary')
      }
    }

    if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
      fetchResume()
    } else {
      setSummary(resumeInfo.summary || '')
    }
  }, [resumeId, resumeInfo, setResumeInfo])

  const handleSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summary }),
      })

      if (!res.ok) throw new Error()

      toast.success('Summary updated successfully!')

      // Update context after successful save
      setResumeInfo((prev) => ({
        ...prev,
        summary,
      }))

      enabledNext?.(true)
    } catch (error) {
      toast.error('Failed to update summary.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateAI = async () => {
    if (!summary) {
      toast.error('Please write something first.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Rewrite this resume summary in a professional and concise tone:\n\n${summary}`,
        }),
      })

      if (!res.ok) throw new Error()
      const data = await res.json()

      setSummary(data.output) // update textarea
      setResumeInfo((prev) => ({
        ...prev,
        summary: data.output,
      }))
      toast.success('AI-generated summary applied!')
    } catch (err) {
      console.error('AI generation failed:', err)
      toast.error('Failed to generate summary.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Summary</h2>
      <p className="text-muted-foreground mb-4">
        Write a brief summary about yourself.
      </p>

      <Textarea
        rows={6}
        value={summary}
        onChange={(e) => {
          const newSummary = e.target.value
          setSummary(newSummary)
          setResumeInfo((prev) => ({
            ...prev,
            summary: newSummary,
          }))
          enabledNext?.(false)
        }}
        placeholder="E.g. Passionate software developer with 3+ years of experience..."
      />

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          disabled={loading}
          onClick={handleGenerateAI}
        >
          {loading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            '✨ Generate with AI'
          )}
        </Button>

        <Button disabled={loading} onClick={handleSave}>
          {loading ? (
            <LoaderCircle className="w-4 h-4 animate-spin" />
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </div>
  )
}

export default Summary
