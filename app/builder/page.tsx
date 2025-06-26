'use client'

import ResumeForm from "@/components/ResumeForm"
import ResumePreview from "@/components/ResumePreview"
import { useState } from "react"
import { ResumeData } from "@/types/resume"
import Navbar from "@/components/Navbar"

export default function ResumeBuilderPage() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    featuredSkills: [],
    customSection: {
      title: "",
      content: "",
    },
    settings: {
      font: "Roboto",
      fontSize: "Standard",
      themeColor: "#000000",
      documentSize: "A4",
    },
  })

  return (
    <div className="h-screen w-full overflow-hidden">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Main Builder Area (below navbar) */}
      <div className="pt-[64px] h-[calc(100vh)] flex">
        {/* Form Side (scrollable) */}
        <div className="w-full lg:w-1/2 h-full overflow-y-auto p-4 bg-white shadow-md rounded-none lg:rounded-l-lg">
          <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-border" />

        {/* Preview Side (fixed) */}
        <div className="w-full lg:w-1/2 h-full p-4 bg-white shadow-md rounded-none lg:rounded-r-lg overflow-hidden">
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  )
}
