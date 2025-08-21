'use client'

import { Button } from '@/components/ui/button';
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs'

function Header() {
  const { isSignedIn } = useUser()

  return (
    <div className="p-3 px-5 flex justify-between shadow-md items-center">
      <Link href="/dashboard">
        <img
          src="/logo.svg"
          className="cursor-pointer"
          width={100}
          height={100}
          alt="Logo"
        />
      </Link>

      {isSignedIn ? (
        <div className="flex gap-2 items-center">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      ) : (
        <Link href="/auth/auth/sign-in">
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  )
}

export default Header
