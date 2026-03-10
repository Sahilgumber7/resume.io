'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

export default function SyncUser() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    fetch('/api/create-user-if-doesnt-exist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clerkId: user.id,
        email,
        name: user.fullName,
        imageUrl: user.imageUrl,
      }),
    }).catch((error) => {
      console.error('[SyncUser] failed to sync user:', error);
    });
  }, [user]);

  return null;
}
