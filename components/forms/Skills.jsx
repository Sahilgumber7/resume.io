'use client'

import React, { useContext, useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

function Skills() {
  const { resumeId } = useParams()
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (resumeInfo?.skills && JSON.stringify(resumeInfo.skills) !== JSON.stringify(skillsList)) {
      setSkillsList(resumeInfo.skills)
    }
  }, [resumeInfo?.skills])

  const handleChange = (index, name, value) => {
    const updated = [...skillsList]
    updated[index][name] = value
    setSkillsList(updated)
  }

  const onSave = async () => {
    setLoading(true)
    try {
      const payload = {
        data: { skills: skillsList.map(({ id, ...rest }) => rest) },
      }

      const res = await fetch(`/api/resume/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()
      toast.success('Skills updated!')
      setResumeInfo(prev => ({ ...prev, skills: skillsList }))
    } catch {
      toast.error('Failed to update skills.')
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
          <Button variant="outline" onClick={() => setSkillsList([...skillsList, { name: '', rating: 0 }])}>
            + Add Skill
          </Button>
          <Button variant="outline" onClick={() => setSkillsList(skillsList.slice(0, -1))}>
            - Remove
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin w-4 h-4" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Skills
