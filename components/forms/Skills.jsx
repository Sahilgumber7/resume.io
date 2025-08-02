'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { toast } from 'sonner'
import { useResumeInfo } from '@/components/ResumeInfoContext'

function Skills({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useResumeInfo()
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }])
  const params = useParams()
  const resumeId = params?.resumeId
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (resumeInfo?.skills?.length > 0) {
      setSkillsList(resumeInfo.skills)
    }
  }, [resumeInfo])

  useEffect(() => {
    setResumeInfo({
      ...resumeInfo,
      skills: skillsList,
    })
  }, [skillsList])

  const handleChange = (index, name, value) => {
    const updated = [...skillsList]
    updated[index][name] = value
    setSkillsList(updated)
    enabledNext(false)
  }

  const AddNewSkills = () => {
    setSkillsList([...skillsList, { name: '', rating: 0 }])
  }

  const RemoveSkills = () => {
    setSkillsList((prev) => prev.slice(0, -1))
  }

  const onSave = async () => {
    setLoading(true)

    try {
      const res = await fetch(`/api/resume/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsList }),
      })

      if (!res.ok) throw new Error()

      toast('Skills updated successfully!')
      enabledNext(true)
    } catch (err) {
      toast('Error updating skills. Try again!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Skills</h2>
      <p className="text-muted-foreground mb-4">Add your top professional skills</p>

      <div className="space-y-3">
        {skillsList.map((item, index) => (
          <div key={index} className="flex justify-between items-center gap-3 border rounded-lg p-3">
            <div className="w-full">
              <label className="text-xs">Skill Name</label>
              <Input
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v) => handleChange(index, 'rating', v)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={AddNewSkills}>+ Add Skill</Button>
          <Button variant="outline" onClick={RemoveSkills}>- Remove</Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Skills
