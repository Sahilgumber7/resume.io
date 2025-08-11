'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Lnavbar() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBuilderClick = () => setOpenDialog(true);

  const onCreate = async () => {
    if (!resumeTitle) return;
    setLoading(true);

    const data = {
      title: resumeTitle,
      userClerkId: isSignedIn ? user.id : 'guest',
      fullName: isSignedIn ? user.fullName || '' : '',
      jobTitle: '',
      email: isSignedIn ? user.primaryEmailAddress?.emailAddress || '' : '',
      phone: '',
      address: '',
      themeColor: '#000000',
      summary: '',
      education: [],
      experience: [],
      skills: [],
      projects: [],
    };

    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create resume');

      const docId = json?.insertedId || json?._id || json?.documentId;
      toast.success('Resume created!');
      router.push(`/builder/${docId}`);
    } catch (error) {
      toast.error('Something went wrong!');
      console.error(error);
    } finally {
      setLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-10 py-3 shadow-sm bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="text-lg md:text-2xl font-bold text-primary tracking-tight">
        resume<span className="text-muted-foreground">.io</span>
      </div>

      <div className="flex flex-row items-center gap-2 md:gap-4 text-sm md:text-base">
        <Button variant="ghost" size="sm" className="px-2 md:px-3" onClick={handleBuilderClick}>
          Builder
        </Button>

        <SignedIn>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="px-2 md:px-3">
              Dashboard
            </Button>
          </Link>
        </SignedIn>

        <ThemeToggle />

        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm" className="px-2 md:px-3">Sign In</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
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
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
              />
            </DialogDescription>
            <div className="flex justify-end gap-5 mt-4">
              <Button onClick={() => setOpenDialog(false)} variant="ghost">Cancel</Button>
              <Button onClick={onCreate} disabled={!resumeTitle || loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
