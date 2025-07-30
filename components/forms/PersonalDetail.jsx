'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

function PersonalDetail({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [formData, setFormData] = useState(resumeInfo || {})
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId')

  useEffect(() => {
    setFormData(resumeInfo || {})
  }, [resumeInfo])

  const handleInputChange = (e) => {
    enabledNext(false)
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
    setLoading(true)

    try {
      // Replace with your actual API call (Supabase, fetch, etc.)
      await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: formData })
      })

      enabledNext(true)
      toast('Details updated successfully')
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
            <label className="text-sm">First Name</label>
            <Input
              name="firstName"
              required
              defaultValue={formData?.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              required
              defaultValue={formData?.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Job Title</label>
            <Input
              name="jobTitle"
              required
              defaultValue={formData?.jobTitle}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              required
              defaultValue={formData?.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              required
              defaultValue={formData?.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              required
              defaultValue={formData?.email}
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
