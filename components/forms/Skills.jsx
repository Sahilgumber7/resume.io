'use client'

import { useContext, useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormCard from './FormCard'

const EMPTY_SKILL = { name: '', rating: 0 }

export default function Skills() {
  const { resumeId } = useParams()
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [loading, setLoading] = useState(false)
  const [skillsList, setSkillsList] = useState([EMPTY_SKILL])

  useEffect(() => {
    const skills = Array.isArray(resumeInfo?.skills) && resumeInfo.skills.length > 0
      ? resumeInfo.skills
      : [EMPTY_SKILL]
    setSkillsList(skills)
  }, [resumeInfo?.skills])

  const syncSkills = (updatedSkills) => {
    setSkillsList(updatedSkills)
    setResumeInfo((prev) => ({ ...(prev || {}), skills: updatedSkills }))
  }

  const handleChange = (index, name, value) => {
    const updated = [...skillsList]
    updated[index] = { ...updated[index], [name]: value }
    syncSkills(updated)
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID is missing')
      return
    }

    setLoading(true)
    try {
      const cleanedSkills = skillsList.map((item) => {
        const copy = { ...item }
        delete copy.id
        delete copy._id
        return copy
      })
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: cleanedSkills }),
      })
      if (!res.ok) throw new Error('Failed to update skills')
      setResumeInfo((prev) => ({ ...(prev || {}), skills: cleanedSkills }))
      toast.success('Skills saved')
    } catch (error) {
      console.error(error)
      toast.error('Failed to save skills')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormCard
      title="Skills"
      description="List your strongest skills and add a quick proficiency rating."
    >
      <div className="space-y-3">
        {skillsList.map((item, index) => (
          <div key={index} className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
            <div className="w-full">
              <label className="text-xs">Skill Name</label>
              <Input value={item.name} onChange={(e) => handleChange(index, 'name', e.target.value)} />
            </div>
            <div className="min-w-32">
              <label className="text-xs">Rating</label>
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(value) => handleChange(index, 'rating', value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => syncSkills([...skillsList, { ...EMPTY_SKILL }])}>
            + Add Skill
          </Button>
          <Button
            variant="outline"
            onClick={() => syncSkills(skillsList.slice(0, -1))}
            disabled={skillsList.length <= 1}
          >
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Save Skills'}
        </Button>
      </div>
    </FormCard>
  )
}
