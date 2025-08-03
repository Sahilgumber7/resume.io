'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'

function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [experienceList, setExperienceList] = useState([])
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')

  // Load from context once
  useEffect(() => {
    if (Array.isArray(resumeInfo?.Experience)) {
      setExperienceList(resumeInfo.Experience)
    }
  }, [resumeInfo?.Experience])

  // Update context when experienceList changes meaningfully
  useEffect(() => {
    const hasChanged = JSON.stringify(resumeInfo?.Experience) !== JSON.stringify(experienceList)
    if (hasChanged) {
      setResumeInfo((prev) => ({
        ...prev,
        Experience: experienceList,
      }))
    }
  }, [experienceList])

  const handleChange = (index, event) => {
    const { name, value } = event.target
    setExperienceList((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [name]: value }
      return updated
    })
  }

  const handleRichTextEditor = (e, name, index) => {
    const value = e.target.value
    setExperienceList((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [name]: value }
      return updated
    })
  }

  const addNewExperience = () => {
    setExperienceList((prev) => [
      ...prev,
      {
        title: '',
        companyName: '',
        city: '',
        state: '',
        startDate: '',
        endDate: '',
        worksummary: '',
      },
    ])
  }

  const removeExperience = () => {
    setExperienceList((prev) => prev.slice(0, -1))
  }

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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Experience: experienceList.map(({ id, ...rest }) => rest), // omit `id` if needed
        }),
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
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p>Add your previous job experience</p>

      {experienceList.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg"
        >
          <div>
            <label className="text-xs">Position Title</label>
            <Input
              name="title"
              value={item.title}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">Company Name</label>
            <Input
              name="companyName"
              value={item.companyName}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">City</label>
            <Input
              name="city"
              value={item.city}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">State</label>
            <Input
              name="state"
              value={item.state}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate}
              onChange={(e) => handleChange(index, e)}
            />
          </div>
          <div className="col-span-2">
            <RichTextEditor
              index={index}
              defaultValue={item.worksummary}
              onRichTextEditorChange={(e) =>
                handleRichTextEditor(e, 'worksummary', index)
              }
            />
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewExperience}>
            + Add More Experience
          </Button>
          <Button
            variant="outline"
            onClick={removeExperience}
            disabled={experienceList.length === 0}
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

export default Experience
