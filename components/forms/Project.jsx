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

  const [projects, setProjects] = useState([
    {
      title: '',
      description: ''
    }
  ])

  useEffect(() => {
    if (resumeInfo?.projects) {
      setProjects(resumeInfo.projects)
    }
  }, [resumeInfo])

  const handleChange = (event, index) => {
    const newEntries = [...projects]
    const { name, value } = event.target
    newEntries[index][name] = value
    setProjects(newEntries)
  }

  const addNewProject = () => {
    setProjects(prev => [...prev, { title: '', description: '' }])
  }

  const removeProject = () => {
    setProjects(prev => prev.slice(0, -1))
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found in URL!')
      return
    }

    setLoading(true)

    const data = {
      projects: projects.map(({ _id, ...rest }) => rest) // omit _id if present
    }

    try {
      const response = await fetch(`/api/resume/${resumeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to update')

      toast.success('Projects updated!')
    } catch (error) {
      console.error(error)
      toast.error('Server error. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      projects
    })
  }, [projects])

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Projects</h2>
      <p>Add your projects and descriptions</p>

      <div>
        {projects.map((item, index) => (
          <div key={index} className='grid gap-3 border p-3 my-5 rounded-lg'>
            <div>
              <label>Project Title</label>
              <Input
                name='title'
                onChange={e => handleChange(e, index)}
                value={item.title}
              />
            </div>
            <div>
              <label>Description</label>
              <Textarea
                name='description'
                onChange={e => handleChange(e, index)}
                value={item.description}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={addNewProject} className='text-primary'>
            + Add More Projects
          </Button>
          <Button variant='outline' onClick={removeProject} className='text-primary'>
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Projects
