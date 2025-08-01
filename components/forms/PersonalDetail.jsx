'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function PersonalDetail({ resumeInfo, setResumeInfo, enabledNext }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  })
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const resumeId = searchParams.get('resumeId') || resumeInfo?._id

  useEffect(() => {
    if (resumeInfo?.basicInfo) {
      setFormData({
        firstName: resumeInfo.basicInfo.firstName || '',
        lastName: resumeInfo.basicInfo.lastName || '',
        email: resumeInfo.basicInfo.email || '',
        phone: resumeInfo.basicInfo.phone || '',
        address: resumeInfo.basicInfo.address || ''
      })
    }
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
      basicInfo: {
        ...prev.basicInfo,
        [name]: value
      }
    }))
  }

  const onSave = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!resumeId) {
      toast.error('Missing resume ID')
      return
    }

    try {
      const res = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ basicInfo: formData })
      })

      if (!res.ok) throw new Error('Failed to update')

      enabledNext(true)
      toast.success('Details updated successfully')
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
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Last Name</label>
            <Input
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm">Address</label>
            <Input
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input
              name="email"
              required
              value={formData.email}
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
