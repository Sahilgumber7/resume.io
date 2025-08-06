'use client';

import { Loader2Icon, MoreVertical } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ResumeCardItem({ resume, refreshData }) {
  const router = useRouter();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/resumes/${resume._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete resume');

      toast.success('Resume Deleted!');
      refreshData();
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while deleting.');
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  return (
    <div>
      <Link href={`/dashboard/resume/${resume._id}/edit`}>
        <div
          className='p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 h-[280px] rounded-t-lg border-t-4'
          style={{ borderColor: resume?.themeColor }}
        >
          <div className='flex items-center justify-center h-[180px]'>
            <Image src="/cv.jpg" width={80} height={80} alt="CV icon" />
          </div>
        </div>
      </Link>

      <div
        className='border p-3 flex justify-between items-center text-white rounded-b-lg shadow-lg'
        style={{ background: resume?.themeColor }}
      >
        <h2 className='text-sm truncate'>{resume.title}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreVertical className='h-4 w-4 cursor-pointer' />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => router.push(`/dashboard/resume/${resume._id}/edit`)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/my-resume/${resume._id}/view`)}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/my-resume/${resume._id}/download`)}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your resume.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading}>
                {loading ? <Loader2Icon className='animate-spin w-4 h-4' /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCardItem;
