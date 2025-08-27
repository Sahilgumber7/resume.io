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
import { Menu } from 'lucide-react';

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
    <nav className="w-full sticky top-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="flex justify-between items-center px-4 md:px-10 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          resume<span className="text-muted-foreground">.io</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBuilderClick}>
            Builder
          </Button>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          </SignedIn>
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted/30 transition"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenu && (
        <div className="md:hidden px-4 py-3 flex flex-col gap-3 border-t border-border/50 bg-background/80 backdrop-blur-lg">
          <Button variant="ghost" size="sm" onClick={handleBuilderClick}>
            Builder
          </Button>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
          </SignedIn>
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">Sign In</Button>
            </SignInButton>
          </SignedOut>
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
