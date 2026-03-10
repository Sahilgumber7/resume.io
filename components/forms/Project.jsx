'use client'

import { useContext, useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ProfileSectionDropdown from './ProfileSectionDropdown'
import FormCard from './FormCard'

const EMPTY_PROJECT = { title: '', description: '' }

export default function Projects() {
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const { resumeId } = useParams()
  const [projects, setProjects] = useState([])

  useEffect(() => {
    setProjects(resumeInfo?.projects || [])
  }, [resumeInfo?.projects])

  const syncToContext = (newList) => {
    setProjects(newList)
    setResumeInfo((prev) => ({ ...(prev || {}), projects: newList }))
  }

  const handleChange = (e, index) => {
    const { name, value } = e.target
    const updated = [...projects]
    updated[index] = { ...updated[index], [name]: value }
    syncToContext(updated)
  }

  const addNewProject = () => {
    syncToContext([...projects, { ...EMPTY_PROJECT }])
  }

  const removeProject = () => {
    if (projects.length === 0) return
    syncToContext(projects.slice(0, -1))
  }

  const applyProfileProjects = (items, mode) => {
    const normalized = (items || []).map((item) => ({
      title: item.title || '',
      description: item.description || '',
    }))
    const updated = mode === 'replace' ? normalized : [...projects, ...normalized]
    syncToContext(updated)
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found')
      return
    }

    setLoading(true)
    try {
      const cleanedProjects = projects.map((item) => {
        const copy = { ...item }
        delete copy.id
        delete copy._id
        return copy
      })
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: cleanedProjects }),
      })
      if (!res.ok) throw new Error('Failed to update projects')
      setResumeInfo((prev) => ({ ...(prev || {}), projects: cleanedProjects }))
      toast.success('Projects saved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save projects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormCard
      title="Projects"
      description="Add projects that show your practical impact."
    >
      <ProfileSectionDropdown section="projects" onApply={applyProfileProjects} />

      {projects.map((item, index) => (
        <div key={index} className="my-4 grid gap-3 rounded-xl border p-3">
          <div>
            <label className="text-xs">Project Title</label>
            <Input name="title" value={item.title} onChange={(e) => handleChange(e, index)} />
          </div>
          <div>
            <label className="text-xs">Description</label>
            <Textarea name="description" value={item.description} onChange={(e) => handleChange(e, index)} />
          </div>
        </div>
      ))}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewProject}>+ Add Project</Button>
          <Button variant="outline" onClick={removeProject} disabled={projects.length === 0}>
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Save Projects'}
        </Button>
      </div>
    </FormCard>
  )
}
