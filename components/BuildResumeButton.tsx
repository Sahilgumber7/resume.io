'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function BuildResumeButton() {
  const { user } = useUser();
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/builder');
    }
  };

  return (
    <Button onClick={handleClick} size="sm">
      Build My Resume
    </Button>
  );
}
