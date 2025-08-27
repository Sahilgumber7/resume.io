'use client';

import { Loader2Icon, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    <div className="group transition-transform hover:scale-105 duration-300 cursor-pointer">
      {/* Card Container */}
      <div
        className="rounded-lg border border-dashed shadow-sm hover:shadow-md overflow-hidden bg-secondary"
        style={{ borderColor: resume?.themeColor }}
      >
        {/* Image Section */}
        <Link href={`/dashboard/resume/${resume._id}/edit`}>
          <div className="relative h-[280px] w-full">
            <Image
              src="/cv.jpg"
              alt="Resume Preview"
              fill
              className="object-cover"
              priority
            />
          </div>
        </Link>

        {/* Bottom Section */}
        <div className="flex justify-between items-center p-3 border-t bg-background">
          <h2 className="text-sm font-medium truncate">{resume.title}</h2>

          {/* Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="w-5 h-5 cursor-pointer opacity-90 hover:opacity-100 transition" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 rounded-xl border border-border/50 shadow-lg bg-background/90 backdrop-blur-lg">
              <DropdownMenuItem
                onClick={() => router.push(`/dashboard/resume/${resume._id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/my-resume/${resume._id}/view`)}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/my-resume/${resume._id}/download`)}
              >
                Download
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => setOpenAlert(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
            <AlertDialogContent className="rounded-2xl border border-border/50 bg-background/90 backdrop-blur-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg font-bold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  This action cannot be undone. This will permanently delete your resume.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                  onClick={onDelete}
                  disabled={loading}
                >
                  {loading ? <Loader2Icon className="animate-spin w-4 h-4" /> : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

export default ResumeCardItem;
