'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import RichTextEditor from '../RichTextEditor'

export default function Experience({ resumeInfo, setResumeInfo }) {
  const [experienceList, setExperienceList] = useState([])
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (resumeInfo?.Experience?.length > 0) {
      setExperienceList(resumeInfo.Experience)
    }
  }, [resumeInfo])

  const handleChange = (index, event) => {
    const updated = [...experienceList]
    const { name, value } = event.target
    updated[index][name] = value
    setExperienceList(updated)
  }

  const handleRichTextEditor = (e, name, index) => {
    const updated = [...experienceList]
    updated[index][name] = e.target.value
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
    setExperienceList(prev => prev.slice(0, -1))
  }

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      Experience: experienceList
    })
  }, [experienceList])

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID missing in URL!')
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
          Experience: experienceList.map(({ id, ...rest }) => rest)
        })
      })

      if (!response.ok) throw new Error('Failed to update experience')

      toast.success('Experience updated!')
    } catch (err) {
      console.error(err)
      toast.error('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Professional Experience</h2>
      <p>Add your previous job experience</p>

      {experienceList.map((item, index) => (
        <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
          <div>
            <label className='text-xs'>Position Title</label>
            <Input
              name='title'
              onChange={e => handleChange(index, e)}
              value={item.title}
            />
          </div>
          <div>
            <label className='text-xs'>Company Name</label>
            <Input
              name='companyName'
              onChange={e => handleChange(index, e)}
              value={item.companyName}
            />
          </div>
          <div>
            <label className='text-xs'>City</label>
            <Input
              name='city'
              onChange={e => handleChange(index, e)}
              value={item.city}
            />
          </div>
          <div>
            <label className='text-xs'>State</label>
            <Input
              name='state'
              onChange={e => handleChange(index, e)}
              value={item.state}
            />
          </div>
          <div>
            <label className='text-xs'>Start Date</label>
            <Input
              type='date'
              name='startDate'
              onChange={e => handleChange(index, e)}
              value={item.startDate}
            />
          </div>
          <div>
            <label className='text-xs'>End Date</label>
            <Input
              type='date'
              name='endDate'
              onChange={e => handleChange(index, e)}
              value={item.endDate}
            />
          </div>
          <div className='col-span-2'>
            <RichTextEditor
              index={index}
              defaultValue={item.worksummary}
              onRichTextEditorChange={e =>
                handleRichTextEditor(e, 'worksummary', index)
              }
            />
          </div>
        </div>
      ))}

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={addNewExperience} className='text-primary'>
            + Add More Experience
          </Button>
          <Button variant='outline' onClick={removeExperience} className='text-primary'>
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
