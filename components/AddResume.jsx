'use client'

import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function AddResume() {
  const [openDialog, setOpenDialog] = useState(false)
  const [resumeTitle, setResumeTitle] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onCreate = async () => {
    if (!resumeTitle || !user) return
    setLoading(true)

    const uuid = uuidv4()
    const data = {
      title: resumeTitle,
      resumeId: uuid,
      userEmail: user.primaryEmailAddress?.emailAddress,
      userName: user.fullName,
      themeColor: '#6366f1', // optional default color
    }

    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Failed to create resume')

      const docId = json?.insertedId || json?._id || json?.documentId
      toast.success('Resume created!')
      router.push(`/dashboard/resume/${docId}/edit`)
    } catch (error) {
      toast.error('Something went wrong!')
      console.error(error)
    } finally {
      setLoading(false)
      setOpenDialog(false)
    }
  }

  return (
    <div>
      <div
        className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dashed'
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              <p>Add a title for your new resume</p>
              <Input
                className="my-2"
                placeholder="Ex. Full Stack Resume"
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
            <div className='flex justify-end gap-5 mt-4'>
              <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
              <Button onClick={onCreate} disabled={!resumeTitle || loading}>
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create'}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
