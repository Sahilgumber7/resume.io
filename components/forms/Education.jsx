'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
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

  // ✅ Fetch resume if context is empty
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return
      try {
        const res = await fetch(`/api/resumes/${resumeId}`)
        if (!res.ok) throw new Error('Failed to fetch resume data')
        const data = await res.json()
        setResumeInfo(data)
        setEducationalList(data.education || [
          {
            universityName: '',
            degree: '',
            major: '',
            startDate: '',
            endDate: '',
            description: ''
          }
        ])
      } catch (error) {
        console.error('Failed to fetch resume info:', error)
        toast.error('Could not load education info')
      }
    }

    if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
      fetchResume()
    } else if (resumeInfo.education) {
      setEducationalList(resumeInfo.education)
    }
  }, [resumeId, resumeInfo, setResumeInfo])

  // ✅ Real-time context update
  const handleChange = (event, index) => {
    const { name, value } = event.target
    const updated = [...educationalList]
    updated[index] = { ...updated[index], [name]: value }
    setEducationalList(updated)

    setResumeInfo(prev => ({
      ...prev,
      education: updated
    }))
  }

  const addNewEducation = () => {
    const updated = [
      ...educationalList,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]
    setEducationalList(updated)
    setResumeInfo(prev => ({
      ...prev,
      education: updated
    }))
  }

  const removeEducation = () => {
    if (educationalList.length > 1) {
      const updated = educationalList.slice(0, -1)
      setEducationalList(updated)
      setResumeInfo(prev => ({
        ...prev,
        education: updated
      }))
    }
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found in URL!')
      return
    }

    setLoading(true)

    try {
      const cleanedEducation = educationalList.map(({ id, _id, ...rest }) => rest)

      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          education: cleanedEducation
        })
      })

      if (!response.ok) throw new Error('Failed to update education')

      setResumeInfo(prev => ({ ...prev, education: cleanedEducation }))
      toast.success('Education details updated!')
    } catch (error) {
      console.error(error)
      toast.error('Server error. Please try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add your educational details</p>

      {educationalList.map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
          <div className="col-span-2">
            <label>University Name</label>
            <Input
              name="universityName"
              value={item.universityName}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>Degree</label>
            <Input
              name="degree"
              value={item.degree}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>Major</label>
            <Input
              name="major"
              value={item.major}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="col-span-2">
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
          <Button variant="outline" onClick={addNewEducation}>
            + Add More Education
          </Button>
          <Button
            variant="outline"
            onClick={removeEducation}
            disabled={educationalList.length <= 1}
          >
            - Remove
          </Button>
        </div>
        <Button onClick={onSave} disabled={loading}>
          {loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Education
