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

function Skills({ enabledNext }) {
  const { resumeId } = useParams()
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [loading, setLoading] = useState(false)

  // Sync local list with context
  const [skillsList, setSkillsList] = useState([{ name: '', rating: 0 }])

  // Fetch resume initially if not loaded
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return
      try {
        const res = await fetch(`/api/resumes/${resumeId}`)
        if (!res.ok) throw new Error('Failed to fetch resume data')
        const data = await res.json()
        setResumeInfo(data)
        if (Array.isArray(data.skills)) {
          setSkillsList(data.skills)
        }
      } catch (error) {
        console.error('Failed to fetch resume info:', error)
        toast.error('Could not load resume details')
      }
    }

    if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
      fetchResume()
    } else {
      if (Array.isArray(resumeInfo.skills)) {
        setSkillsList(resumeInfo.skills)
      }
    }
  }, [resumeId, resumeInfo, setResumeInfo])

  useEffect(() => {
    enabledNext(false)
  }, [enabledNext])

  const handleChange = (index, name, value) => {
    const updatedSkills = [...skillsList]
    updatedSkills[index][name] = value
    setSkillsList(updatedSkills)

    setResumeInfo(prev => ({
      ...prev,
      skills: updatedSkills,
    }))
  }

  const onSave = async () => {
    if (!resumeId) {
      toast.error('Resume ID is missing from the URL')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            skills: skillsList.map(({ id, ...rest }) => rest),
          },
        }),
      })

      if (!res.ok) throw new Error()
      toast.success('Skills updated successfully!')
      enabledNext(true)
    } catch (err) {
      console.error('Failed to update skills:', err)
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
          <Button
            variant="outline"
            onClick={() => {
              const newSkills = [...skillsList, { name: '', rating: 0 }]
              setSkillsList(newSkills)
              setResumeInfo(prev => ({ ...prev, skills: newSkills }))
            }}
          >
            + Add Skill
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const newSkills = skillsList.slice(0, -1)
              setSkillsList(newSkills)
              setResumeInfo(prev => ({ ...prev, skills: newSkills }))
            }}
            disabled={skillsList.length === 1}
          >
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
