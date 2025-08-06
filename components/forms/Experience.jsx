'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'
import RichTextEditor from '../RichTextEditor'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'

export default function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [experienceList, setExperienceList] = useState([])
  const [loading, setLoading] = useState(false)

  const { resumeId } = useParams()

  // ✅ Fetch resume data only if context is empty
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return
      try {
        const res = await fetch(`/api/resumes/${resumeId}`)
        if (!res.ok) throw new Error('Failed to fetch resume data')
        const data = await res.json()
        setResumeInfo(data)
        setExperienceList(data.experience || [])
      } catch (error) {
        console.error('Failed to fetch experience:', error)
        toast.error('Could not load experience')
      }
    }

    if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
      fetchResume()
    } else {
      setExperienceList(resumeInfo.experience || [])
    }
  }, [resumeId, resumeInfo, setResumeInfo])

  const syncToContext = (newList) => {
    setExperienceList(newList)
    setResumeInfo((prev) => ({
      ...prev,
      experience: newList,
    }))
  }

  const handleChange = (index, event) => {
    const { name, value } = event.target
    const updated = [...experienceList]
    updated[index] = { ...updated[index], [name]: value }
    syncToContext(updated)
  }

  const handleRichTextEditor = (e, name, index) => {
    const value = e.target.value
    const updated = [...experienceList]
    updated[index] = { ...updated[index], [name]: value }
    syncToContext(updated)
  }

  const addNewExperience = () => {
    const updated = [
      ...experienceList,
      {
        title: '',
        companyName: '',
        city: '',
        state: '',
        startDate: '',
        endDate: '',
        worksummary: '',
      },
    ]
    syncToContext(updated)
  }

  const removeExperience = () => {
    if (experienceList.length > 0) {
      const updated = experienceList.slice(0, -1)
      syncToContext(updated)
    }
  }

  const handleSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found.')
      return
    }

    setLoading(true)
    try {
      const cleanedExperience = experienceList.map(({ id, _id, ...rest }) => rest)

      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          experience: cleanedExperience,
        }),
      })

      if (!res.ok) throw new Error()

      setResumeInfo(prev => ({ ...prev, experience: cleanedExperience }))
      toast.success('Experience updated successfully!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to update experience.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Professional Experience</h2>
      <p className="text-muted-foreground mb-4">Add your previous job experience</p>

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
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}
