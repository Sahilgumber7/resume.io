'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { Rating } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'

import React, { useContext, useEffect, useState } from 'react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { toast } from 'sonner'
import { useParams } from 'next/navigation'

export default function Skills() {
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }])
  const [loading, setLoading] = useState(false)

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const params = useParams()
  const resumeId = params?.resumeId

  useEffect(() => {
    if (resumeInfo?.skills) {
      setSkillsList(resumeInfo.skills)
    }
  }, [resumeInfo])

  useEffect(() => {
    setResumeInfo((prev) => ({
      ...prev,
      skills: skillsList,
    }))
  }, [skillsList])

  const handleChange = (index, name, value) => {
    const updated = [...skillsList]
    updated[index][name] = value
    setSkillsList(updated)
  }

  const addNewSkill = () => {
    setSkillsList([...skillsList, { name: '', rating: 0 }])
  }

  const removeSkill = () => {
    if (skillsList.length > 1) {
      setSkillsList((prev) => prev.slice(0, -1))
    }
  }

  const handleSave = async () => {
    setLoading(true)

    try {
      const res = await fetch(`/api/resume/${resumeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skills: skillsList.map(({ id, ...rest }) => rest),
        }),
      })

      if (!res.ok) throw new Error('Failed to update')

      toast('Skills updated successfully!')
    } catch (error) {
      console.error(error)
      toast('Failed to update skills. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
      <p className='text-sm text-muted-foreground mb-4'>
        Add your top professional key skills
      </p>

      <div className='space-y-3'>
        {skillsList.map((item, index) => (
          <div
            key={index}
            className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border rounded-lg p-3'
          >
            <div className='flex-1'>
              <label className='text-xs'>Skill Name</label>
              <Input
                value={item.name}
                onChange={(e) => handleChange(index, 'name', e.target.value)}
              />
            </div>

            <div className='flex items-center gap-2'>
              <label className='text-xs hidden sm:block'>Rating</label>
              <Rating
                style={{ maxWidth: 120 }}
                value={item.rating}
                onChange={(v) => handleChange(index, 'rating', v)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className='flex justify-between items-center mt-4'>
        <div className='flex gap-2'>
          <Button variant='outline' onClick={addNewSkill}>
            + Add Skill
          </Button>
          <Button variant='outline' onClick={removeSkill}>
            - Remove
          </Button>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <LoaderCircle className='animate-spin w-4 h-4' /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}
