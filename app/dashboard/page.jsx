'use client'

import { useUser, RedirectToSignIn } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Lnavbar from '@/components/Lnavbar'
import DashboardHero from '@/components/dashboard/DashboardHero'
import MyResumes from '@/components/dashboard/MyResumes'
import TemplatesPreview from '@/components/dashboard/TemplatesPreview'

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  const GetResumesList = async () => {
    try {
      const res = await axios.get('/api/resumes');
      setResumeList(res.data || []);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    void GetResumesList();
  }, [user]);

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Lnavbar />
      <DashboardHero name={user?.firstName} />
      <div className="p-10 md:px-20 lg:px-32">
        <MyResumes resumes={resumeList} refreshData={GetResumesList} />
        <TemplatesPreview />
      </div>
    </main>
  )
}
