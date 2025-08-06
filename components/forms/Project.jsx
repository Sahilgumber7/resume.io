'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { toast } from 'sonner'

function Projects() {
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')

  const [projects, setProjects] = useState([{ title: '', description: '' }])

  // ✅ Fetch resume from backend if context is empty
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return
      try {
        const res = await fetch(`/api/resumes/${resumeId}`)
        if (!res.ok) throw new Error('Failed to fetch resume data')
        const data = await res.json()
        setResumeInfo(data)
        setProjects(data.projects || [{ title: '', description: '' }])
      } catch (error) {
        console.error('Failed to fetch resume info:', error)
        toast.error('Could not load resume projects')
      }
    }

    if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
      fetchResume()
    } else if (resumeInfo.projects) {
      setProjects(resumeInfo.projects)
    }
  }, [resumeId, resumeInfo, setResumeInfo])

  // ✅ Real-time sync with context for live preview
  const handleChange = (e, index) => {
    const { name, value } = e.target
    const updated = [...projects]
    updated[index] = { ...updated[index], [name]: value }
    setProjects(updated)

    setResumeInfo((prev) => ({
      ...prev,
      projects: updated,
    }))
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found')
      return
    }

    setLoading(true)

    try {
      const cleanProjects = projects.map(({ _id, ...rest }) => rest)

      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: cleanProjects }),
      })

      if (!res.ok) throw new Error()

      setResumeInfo((prev) => ({ ...prev, projects: cleanProjects }))
      toast.success('Projects updated!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update projects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Projects</h2>
      <p>Add your projects and descriptions</p>

      {projects.map((item, index) => (
        <div key={index} className="grid gap-3 border p-3 my-5 rounded-lg">
          <div>
            <label>Project Title</label>
            <Input
              name="title"
              value={item.title}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>Description</label>
            <Textarea
              name="description"
              value={item.description}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setProjects((prev) => {
                const updated = [...prev, { title: '', description: '' }]
                setResumeInfo((ctx) => ({ ...ctx, projects: updated }))
                return updated
              })
            }
          >
            + Add More Projects
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setProjects((prev) => {
                const updated = prev.length > 1 ? prev.slice(0, -1) : prev
                setResumeInfo((ctx) => ({ ...ctx, projects: updated }))
                return updated
              })
            }
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Projects
