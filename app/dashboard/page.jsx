'use client'

import { useUser, RedirectToSignIn } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import axios from 'axios'

import Lnavbar from '@/components/Lnavbar'
import DashboardHero from '@/components/dashboard/DashboardHero'
import DashboardInsights from '@/components/dashboard/DashboardInsights'
import MyResumes from '@/components/dashboard/MyResumes'

export default function Dashboard() {
  const { isSignedIn, user } = useUser()
  const [resumeList, setResumeList] = useState([])

  const getResumesList = async () => {
    try {
      const res = await axios.get('/api/resumes')
      setResumeList(res.data || [])
    } catch (error) {
      console.error('Failed to fetch resumes:', error)
    }
  }

  useEffect(() => {
    if (!user) return
    void getResumesList()
  }, [user])

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <Lnavbar />
      <DashboardHero name={user?.firstName} totalResumes={resumeList.length} />

      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:pl-24 sm:px-6 lg:px-10">
        <DashboardInsights resumes={resumeList} />
        <MyResumes resumes={resumeList} refreshData={getResumesList} />
      </div>
    </main>
  )
}
