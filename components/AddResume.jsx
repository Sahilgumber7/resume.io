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
import { motion } from 'framer-motion'

export default function AddResume() {
  const [openDialog, setOpenDialog] = useState(false)
  const [resumeTitle, setResumeTitle] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const onCreate = async () => {
    if (!resumeTitle || !user) {
      toast.error('Please enter a title to continue.')
      return
    }

    setLoading(true)
    const uuid = uuidv4()                                             










    

    const data = {
      title: resumeTitle.trim(),
      userClerkId: user.id,
      fullName: user.fullName || '',
      jobTitle: '',
      email: user.primaryEmailAddress?.emailAddress || '',
      phone: '',
      address: '',
      themeColor: '#000000',
      summary: '',
      education: [],
      experience: [],
      skills: [],
      projects: [],
    }

    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to create resume')

      const docId = json?.insertedId || json?._id || json?.documentId
      toast.success('Resume created!')
      router.push(`/dashboard/resume/${docId}/edit`)
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong while creating your resume.')
    } finally {
      setLoading(false)
      setOpenDialog(false)
      setResumeTitle('')
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="transition-transform"
    >
      {/* Add Resume Card */}
      <div
        className="p-14 py-24 border border-dashed items-center flex justify-center
        bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-[280px] 
        hover:shadow-xl cursor-pointer transition-all duration-300"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare className="w-10 h-10 text-gray-600" />
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Create New Resume
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Give your resume a clear title to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <Input
              className="my-2"
              placeholder="Ex. Frontend Developer Resume"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onCreate}
              disabled={!resumeTitle.trim() || loading}
              className="bg-primary text-white"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
