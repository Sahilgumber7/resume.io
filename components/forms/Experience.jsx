'use client'

import { useContext, useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import RichTextEditor from '../RichTextEditor'
import ProfileSectionDropdown from './ProfileSectionDropdown'
import FormCard from './FormCard'

const EMPTY_EXPERIENCE = {
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  worksummary: '',
}

export default function Experience() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [experienceList, setExperienceList] = useState([])
  const [loading, setLoading] = useState(false)
  const { resumeId } = useParams()

  useEffect(() => {
    setExperienceList(resumeInfo?.experience || [])
  }, [resumeInfo?.experience])

  const syncToContext = (newList) => {
    setExperienceList(newList)
    setResumeInfo((prev) => ({ ...(prev || {}), experience: newList }))
  }

  const handleChange = (index, event) => {
    const { name, value } = event.target
    const updated = [...experienceList]
    updated[index] = { ...updated[index], [name]: value }
    syncToContext(updated)
  }

  const handleRichTextEditor = (e, index) => {
    const updated = [...experienceList]
    updated[index] = { ...updated[index], worksummary: e.target.value }
    syncToContext(updated)
  }

  const addNewExperience = () => {
    syncToContext([...experienceList, { ...EMPTY_EXPERIENCE }])
  }

  const removeExperience = () => {
    if (experienceList.length === 0) return
    syncToContext(experienceList.slice(0, -1))
  }

  const applyProfileExperience = (items, mode) => {
    const normalized = (items || []).map((item) => ({
      title: item.title || '',
      companyName: item.companyName || '',
      city: item.city || '',
      state: item.state || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      currentlyWorking: !!item.currentlyWorking,
      worksummary: item.worksummary || '',
    }))
    const updated = mode === 'replace' ? normalized : [...experienceList, ...normalized]
    syncToContext(updated)
  }

  const handleSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found')
      return
    }

    setLoading(true)
    try {
      const cleanedExperience = experienceList.map((item) => {
        const copy = { ...item }
        delete copy.id
        delete copy._id
        return copy
      })
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience: cleanedExperience }),
      })
      if (!res.ok) throw new Error('Failed to update experience')
      setResumeInfo((prev) => ({ ...(prev || {}), experience: cleanedExperience }))
      toast.success('Experience saved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save experience')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormCard
      title="Professional Experience"
      description="Add your most relevant work history."
    >
      <ProfileSectionDropdown section="experience" onApply={applyProfileExperience} />

      {experienceList.map((item, index) => (
        <div key={index} className="my-4 grid grid-cols-1 gap-3 rounded-xl border p-3 sm:grid-cols-2">
          <div>
            <label className="text-xs">Position Title</label>
            <Input name="title" value={item.title} onChange={(e) => handleChange(index, e)} />
          </div>
          <div>
            <label className="text-xs">Company Name</label>
            <Input name="companyName" value={item.companyName} onChange={(e) => handleChange(index, e)} />
          </div>
          <div>
            <label className="text-xs">City</label>
            <Input name="city" value={item.city} onChange={(e) => handleChange(index, e)} />
          </div>
          <div>
            <label className="text-xs">State</label>
            <Input name="state" value={item.state} onChange={(e) => handleChange(index, e)} />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input type="date" name="startDate" value={item.startDate} onChange={(e) => handleChange(index, e)} />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input type="date" name="endDate" value={item.endDate} onChange={(e) => handleChange(index, e)} />
          </div>
          <div className="sm:col-span-2">
            <RichTextEditor
              index={index}
              defaultValue={item.worksummary}
              onRichTextEditorChange={(e) => handleRichTextEditor(e, index)}
            />
          </div>
        </div>
      ))}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewExperience}>+ Add Experience</Button>
          <Button variant="outline" onClick={removeExperience} disabled={experienceList.length === 0}>
            - Remove
          </Button>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Save Experience'}
        </Button>
      </div>
    </FormCard>
  )
}
