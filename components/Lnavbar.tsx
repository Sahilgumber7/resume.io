'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Lnavbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-10 py-4 shadow-sm bg-white dark:bg-zinc-900 sticky top-0 z-50">
      <div className="text-2xl font-bold text-primary tracking-tight">
        resume<span className="text-muted-foreground">.io</span>
      </div>

      <div className="flex flex-row items-center gap-4">
        {/* Always visible - public route */}
        <Link href="/builder">
          <Button variant="ghost" size="sm">
            Builder
          </Button>
        </Link>

        {/* Only visible when signed in */}
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
          </Link>
        </SignedIn>

        <ThemeToggle />

        {/* Sign In or User Profile */}
        <SignedOut>
          <SignInButton mode="modal">
            <Button size="sm">Sign In</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton  />
        </SignedIn>
      </div>
    </nav>
  );
}
