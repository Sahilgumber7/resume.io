'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import RichTextEditor from '../RichTextEditor'
import { useResumeInfo } from '@/components/ResumeInfoContext'

export default function Experience() {
  const { resumeInfo, setResumeInfo } = useResumeInfo()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId') || resumeInfo?._id
  const [experienceList, setExperienceList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (Array.isArray(resumeInfo?.Experience)) {
      setExperienceList(resumeInfo.Experience)
    } else {
      setExperienceList([])
    }
  }, [resumeInfo])

  useEffect(() => {
    setResumeInfo(prev => ({
      ...prev,
      Experience: experienceList
    }))
  }, [experienceList])

  const handleChange = (index, event) => {
    const { name, value } = event.target
    const updated = [...experienceList]
    updated[index] = {
      ...updated[index],
      [name]: value
    }
    setExperienceList(updated)
  }

  const handleRichTextEditor = (value, name, index) => {
    const updated = [...experienceList]
    updated[index] = {
      ...updated[index],
      [name]: value
    }
    setExperienceList(updated)
  }

  const addNewExperience = () => {
    setExperienceList(prev => [
      ...prev,
      {
        title: '',
        companyName: '',
        city: '',
        state: '',
        startDate: '',
        endDate: '',
        worksummary: ''
      }
    ])
  }

  const removeExperience = () => {
    if (experienceList.length > 0) {
      setExperienceList(prev => prev.slice(0, -1))
    }
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID is missing!')
      return
    }

    if (experienceList.length === 0) {
      toast.warning('Please add at least one experience before saving.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Experience: experienceList
        })
      })

      if (!response.ok) throw new Error('Failed to update experience.')

      toast.success('Experience updated successfully!')
    } catch (err) {
      console.error('Error saving experience:', err)
      toast.error('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Professional Experience</h2>
      <p className='text-muted-foreground mb-4'>Add your previous job experiences.</p>

      {experienceList.map((item, index) => (
        <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
          <div>
            <label className='text-xs'>Position Title</label>
            <Input name='title' value={item.title} onChange={e => handleChange(index, e)} />
          </div>
          <div>
            <label className='text-xs'>Company Name</label>
            <Input name='companyName' value={item.companyName} onChange={e => handleChange(index, e)} />
          </div>
          <div>
            <label className='text-xs'>City</label>
            <Input name='city' value={item.city} onChange={e => handleChange(index, e)} />
          </div>
          <div>
            <label className='text-xs'>State</label>
            <Input name='state' value={item.state} onChange={e => handleChange(index, e)} />
          </div>
          <div>
            <label className='text-xs'>Start Date</label>
            <Input type='date' name='startDate' value={item.startDate} onChange={e => handleChange(index, e)} />
          </div>
          <div>
            <label className='text-xs'>End Date</label>
            <Input type='date' name='endDate' value={item.endDate} onChange={e => handleChange(index, e)} />
          </div>
          <div className='col-span-2'>
            <label className='text-xs mb-1'>Work Summary</label>
            <RichTextEditor
              index={index}
              defaultValue={item.worksummary}
              onRichTextEditorChange={value => handleRichTextEditor(value, 'worksummary', index)}
            />
          </div>
        </div>
      ))}

      <div className='flex justify-between mt-4'>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={addNewExperience} className='text-primary'>
            + Add More Experience
          </Button>
          <Button
            variant='outline'
            onClick={removeExperience}
            className='text-primary'
            disabled={experienceList.length === 0}
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading || experienceList.length === 0} onClick={onSave}>
          {loading ? <LoaderCircle className='w-4 h-4 animate-spin' /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}
