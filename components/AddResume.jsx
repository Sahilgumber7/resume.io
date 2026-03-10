'use client'

import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { createDefaultResumePayload } from '@/lib/resume-defaults'

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
    const data = createDefaultResumePayload(resumeTitle, user)

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="transition-transform"
    >
      {/* Add Resume Card */}
      <div
        className="surface-card flex h-[280px] items-center justify-center border-dashed p-14 py-24 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare className="h-10 w-10 text-muted-foreground" />
      </div>

      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl shadow-2xl">
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
