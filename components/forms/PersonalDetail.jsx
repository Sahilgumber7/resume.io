'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

function PersonalDetail({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [formData, setFormData] = useState(resumeInfo || {})
  const [loading, setLoading] = useState(false)

  const { resumeId } = useParams()

  // ✅ Fetch resume from backend if context is empty
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) return
      try {
        const res = await fetch(`/api/resumes/${resumeId}`)
        if (!res.ok) throw new Error('Failed to fetch resume data')
        const data = await res.json()
        setResumeInfo(data)
        setFormData(data)
      } catch (error) {
        console.error('Failed to fetch resume info:', error)
        toast.error('Could not load resume details')
      }
    }

    if (!resumeInfo || Object.keys(resumeInfo).length === 0) {
      fetchResume()
    } else {
      setFormData(resumeInfo)
    }
  }, [resumeId, resumeInfo, setResumeInfo])

  useEffect(() => {
    enabledNext(false)
  }, [enabledNext])

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    setResumeInfo((prev) => ({
      ...prev,
      [name]: value
    }))
  }

const onSave = async (e) => {
  e.preventDefault()

  if (!resumeId) {
    toast.error('Resume ID is missing from the URL')
    return
  }

  setLoading(true)

  try {
    const response = await fetch(`/api/resumes/${resumeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData) // ✅ FIXED
    })

    if (!response.ok) throw new Error('Failed to update')

    enabledNext(true)
    toast.success('Details updated successfully!')
  } catch (error) {
    console.error('Failed to update resume:', error)
    toast.error('Failed to save changes')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Personal Detail</h2>
      <p>Get started with the basic information</p>

      <form onSubmit={onSave}>
        <div className="grid grid-cols-2 mt-5 gap-3">
          <div>
            <label className="text-sm">Full Name</label>
            <Input
              name="fullName"
              required
              value={formData.fullName || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <Input
              name="jobTitle"
              required
              value={formData.jobTitle || ''}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              required
              value={formData.address || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              required
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              required
              value={formData.email || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PersonalDetail
