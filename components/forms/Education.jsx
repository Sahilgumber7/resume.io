'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { toast } from 'sonner'

function Education() {
  const [loading, setLoading] = useState(false)
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')

  const [educationalList, setEducationalList] = useState([
    {
      universityName: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: ''
    }
  ])

  useEffect(() => {
    if (resumeInfo?.education) {
      setEducationalList(resumeInfo.education)
    }
  }, [resumeInfo])

  const handleChange = (event, index) => {
    const newEntries = [...educationalList]
    const { name, value } = event.target
    newEntries[index][name] = value
    setEducationalList(newEntries)
  }

  const AddNewEducation = () => {
    setEducationalList(prev => [
      ...prev,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ])
  }

  const RemoveEducation = () => {
    setEducationalList(prev => prev.slice(0, -1))
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found in URL!')
      return
    }

    setLoading(true)
    const data = {
      education: educationalList.map(({ id, ...rest }) => rest)
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

      toast.success('Details updated!')
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
      education: educationalList
    })
  }, [educationalList])

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
      <p>Add your educational details</p>

      <div>
        {educationalList.map((item, index) => (
          <div key={index} className='grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg'>
            <div className='col-span-2'>
              <label>University Name</label>
              <Input
                name='universityName'
                onChange={e => handleChange(e, index)}
                value={item.universityName}
              />
            </div>
            <div>
              <label>Degree</label>
              <Input
                name='degree'
                onChange={e => handleChange(e, index)}
                value={item.degree}
              />
            </div>
            <div>
              <label>Major</label>
              <Input
                name='major'
                onChange={e => handleChange(e, index)}
                value={item.major}
              />
            </div>
            <div>
              <label>Start Date</label>
              <Input
                type='date'
                name='startDate'
                onChange={e => handleChange(e, index)}
                value={item.startDate}
              />
            </div>
            <div>
              <label>End Date</label>
              <Input
                type='date'
                name='endDate'
                onChange={e => handleChange(e, index)}
                value={item.endDate}
              />
            </div>
            <div className='col-span-2'>
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
          <Button variant='outline' onClick={AddNewEducation} className='text-primary'>
            + Add More Education
          </Button>
          <Button variant='outline' onClick={RemoveEducation} className='text-primary'>
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

export default Education
