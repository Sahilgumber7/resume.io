'use client'

import React, { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { useResumeInfo } from '@/components/ResumeInfoContext'

function Summary({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useResumeInfo()
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const resumeId = params?.resumeId

  useEffect(() => {
    if (resumeInfo?.summary) {
      setSummary(resumeInfo.summary)
    }
  }, [resumeInfo])

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      summary: summary,
    })
  }, [summary])

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ summary }),
      })

      if (!res.ok) throw new Error()

      toast('Summary updated successfully!')
      enabledNext(true)
    } catch (error) {
      toast('Failed to update summary.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Summary</h2>
      <p className="text-muted-foreground mb-4">Write a brief summary about yourself.</p>

      <Textarea
        rows={6}
        value={summary}
        onChange={(e) => {
          setSummary(e.target.value)
          enabledNext(false)
        }}
        placeholder="E.g. Passionate software developer with 3+ years of experience..."
      />

      <div className="flex justify-end mt-4">
        <Button disabled={loading} onClick={handleSave}>
          {loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Summary
