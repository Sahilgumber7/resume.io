'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
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
import { Menu } from 'lucide-react';
import { createDefaultResumePayload } from '@/lib/resume-defaults';

export default function Lnavbar() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleBuilderClick = () => setOpenDialog(true);

  const onCreate = async () => {
    if (!resumeTitle) return;
    if (!isSignedIn || !user) {
      toast.error('Please sign in to create a resume.');
      return;
    }
    setLoading(true);

    const data = createDefaultResumePayload(resumeTitle, user);

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
    <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold tracking-tight md:text-2xl">
          resume<span className="text-muted-foreground">.io</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-2 rounded-full border bg-background/85 p-1.5 md:flex">
          <Button variant="ghost" size="sm" onClick={handleBuilderClick}>
            Builder
          </Button>
          <Link href="/parser">
        <Button variant="ghost" size="sm">
            Parser
          </Button>
        </Link>
        <Link href="/ats-tester">
          <Button variant="ghost" size="sm">
            ATS Score Matcher
          </Button>
        </Link>
          
          {isSignedIn && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          )}
          {isSignedIn && (
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="sm">Profile</Button>
            </Link>
          )}
          <div className="mx-1 h-6 w-px bg-border" />
          <ThemeToggle />
          {!isSignedIn && (
            <SignInButton mode="modal">
              <Button size="sm" className="rounded-full">Sign In</Button>
            </SignInButton>
          )}
          {isSignedIn && (
            <UserButton />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="rounded-lg p-2 transition hover:bg-muted/30 md:hidden"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenu && (
        <div className="flex flex-col gap-3 border-t border-border/50 bg-background/85 px-4 py-3 backdrop-blur-lg md:hidden">
          <Button variant="ghost" size="sm" onClick={handleBuilderClick}>
            Builder
          </Button>
          {isSignedIn && (
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          )}
          {isSignedIn && (
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="sm">Profile</Button>
            </Link>
          )}
          <ThemeToggle />
          {!isSignedIn && (
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          )}
        </div>
      )}

      {/* Create Resume Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Resume</DialogTitle>
            <DialogDescription className="text-sm">
              Give your new resume a descriptive title.
            </DialogDescription>
          </DialogHeader>
          <Input
            className="my-4"
            placeholder="Ex. Full Stack Developer Resume"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={onCreate} disabled={!resumeTitle || loading}>
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
