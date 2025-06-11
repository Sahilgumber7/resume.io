// types/resume.ts

export interface ResumeData {
  name: string
  email: string
  phone: string
  website: string
  location: string
  summary: string
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: string[]
  featuredSkills?: string[]
  customSection?: {
    title: string
    content: string
  }
  settings?: {
    font: string
    fontSize: "Compact" | "Standard" | "Large"
    themeColor: string
    documentSize: "A4" | "Letter"
  }
}

export interface Experience {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  institution: string
  degree: string
  startDate: string
  endDate: string
  gpa?: string
  description?: string
}

export interface Project {
  title: string
  description: string
  link?: string
}
