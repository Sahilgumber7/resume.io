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

  useEffect(() => {
    if (resumeInfo?.projects && JSON.stringify(resumeInfo.projects) !== JSON.stringify(projects)) {
      setProjects(resumeInfo.projects)
    }
  }, [resumeInfo?.projects])

  const handleChange = (e, index) => {
    const updated = [...projects]
    updated[index][e.target.name] = e.target.value
    setProjects(updated)
  }

  const onSave = async () => {
    if (!resumeId) return toast.error('Resume ID not found')

    setLoading(true)
    try {
      const res = await fetch(`/api/resume/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projects: projects.map(({ _id, ...rest }) => rest),
        }),
      })

      if (!res.ok) throw new Error()
      toast.success('Projects updated!')
      setResumeInfo(prev => ({ ...prev, projects }))
    } catch {
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
          <Button variant="outline" onClick={() => setProjects([...projects, { title: '', description: '' }])}>
            + Add More Projects
          </Button>
          <Button variant="outline" onClick={() => setProjects(projects.slice(0, -1))}>
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