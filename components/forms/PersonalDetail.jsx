'use client'

import { useContext, useEffect, useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormCard from './FormCard'

const EMPTY_FORM = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  address: '',
}

export default function PersonalDetail() {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const { resumeId } = useParams()
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!resumeInfo) return
    setFormData({
      fullName: resumeInfo.fullName || '',
      jobTitle: resumeInfo.jobTitle || '',
      email: resumeInfo.email || '',
      phone: resumeInfo.phone || '',
      address: resumeInfo.address || '',
    })
  }, [resumeInfo])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setResumeInfo((prev) => ({ ...(prev || {}), [name]: value }))
  }

  const onSave = async (e) => {
    e.preventDefault()
    if (!resumeId) {
      toast.error('Resume ID is missing')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!response.ok) throw new Error('Failed to save details')
      toast.success('Personal details saved')
    } catch (error) {
      console.error('Failed to update resume:', error)
      toast.error('Failed to save details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <FormCard
      title="Personal Details"
      description="Add your basic contact and headline details."
    >
      <form onSubmit={onSave}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm">Full Name</label>
            <Input name="fullName" required value={formData.fullName} onChange={handleInputChange} />
          </div>
          <div>
            <label className="text-sm">Job Title</label>
            <Input name="jobTitle" required value={formData.jobTitle} onChange={handleInputChange} />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm">Address</label>
            <Input name="address" value={formData.address} onChange={handleInputChange} />
          </div>
          <div>
            <label className="text-sm">Phone</label>
            <Input name="phone" value={formData.phone} onChange={handleInputChange} />
          </div>
          <div>
            <label className="text-sm">Email</label>
            <Input name="email" type="email" required value={formData.email} onChange={handleInputChange} />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : 'Save Details'}
          </Button>
        </div>
      </form>
    </FormCard>
  )
}
