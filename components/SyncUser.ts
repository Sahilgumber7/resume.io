'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SyncUser() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    fetch('/api/create-user-if-doesnt-exist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        imageUrl: user.imageUrl,
      }),
    });
  }, [user]);

  return null;
}
