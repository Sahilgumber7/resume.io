'use client'

import ResumeForm from "@/components/ResumeForm"
import ResumePreview from "@/components/ResumePreview"
import { useState } from "react"
import { ResumeData } from "@/types/resume"

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      <ResumeForm resumeData={resumeData} setResumeData={setResumeData} />
      <ResumePreview resumeData={resumeData} />
    </div>
  )
}
