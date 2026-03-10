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

const EMPTY_EDUCATION = {
  universityName: '',
  degree: '',
  major: '',
  startDate: '',
  endDate: '',
  description: '',
}

export default function Education() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const { resumeId } = useParams()
  const [educationalList, setEducationalList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setEducationalList(resumeInfo?.education || [])
  }, [resumeInfo?.education])

  const syncToContext = (newList) => {
    setEducationalList(newList)
    setResumeInfo((prev) => ({ ...(prev || {}), education: newList }))
  }

  const handleChange = (e, index) => {
    const { name, value } = e.target
    const updated = [...educationalList]
    updated[index] = { ...updated[index], [name]: value }
    syncToContext(updated)
  }

  const addNewEducation = () => {
    syncToContext([...educationalList, { ...EMPTY_EDUCATION }])
  }

  const removeEducation = () => {
    if (educationalList.length === 0) return
    syncToContext(educationalList.slice(0, -1))
  }

  const applyProfileEducation = (items, mode) => {
    const normalized = (items || []).map((item) => ({
      universityName: item.universityName || '',
      degree: item.degree || '',
      major: item.major || '',
      startDate: item.startDate || '',
      endDate: item.endDate || '',
      description: item.description || '',
    }))
    const updated = mode === 'replace' ? normalized : [...educationalList, ...normalized]
    syncToContext(updated)
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID not found')
      return
    }

    setLoading(true)
    try {
      const cleanedEducation = educationalList.map((item) => {
        const copy = { ...item }
        delete copy.id
        delete copy._id
        return copy
      })
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ education: cleanedEducation }),
      })
      if (!response.ok) throw new Error('Failed to update education')
      setResumeInfo((prev) => ({ ...(prev || {}), education: cleanedEducation }))
      toast.success('Education saved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save education')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormCard
      title="Education"
      description="Add your academic background."
    >
      <ProfileSectionDropdown section="education" onApply={applyProfileEducation} />

      {educationalList.map((item, index) => (
        <div key={index} className="my-4 grid grid-cols-1 gap-3 rounded-xl border p-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs">University Name</label>
            <Input name="universityName" value={item.universityName} onChange={(e) => handleChange(e, index)} />
          </div>
          <div>
            <label className="text-xs">Degree</label>
            <Input name="degree" value={item.degree} onChange={(e) => handleChange(e, index)} />
          </div>
          <div>
            <label className="text-xs">Major</label>
            <Input name="major" value={item.major} onChange={(e) => handleChange(e, index)} />
          </div>
          <div>
            <label className="text-xs">Start Date</label>
            <Input type="date" name="startDate" value={item.startDate} onChange={(e) => handleChange(e, index)} />
          </div>
          <div>
            <label className="text-xs">End Date</label>
            <Input type="date" name="endDate" value={item.endDate} onChange={(e) => handleChange(e, index)} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs">Description</label>
            <Textarea name="description" value={item.description} onChange={(e) => handleChange(e, index)} />
          </div>
        </div>
      ))}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewEducation}>+ Add Education</Button>
          <Button variant="outline" onClick={removeEducation} disabled={educationalList.length === 0}>
            - Remove
          </Button>
        </div>
        <Button onClick={onSave} disabled={loading}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Save Education'}
        </Button>
      </div>
    </FormCard>
  )
}
