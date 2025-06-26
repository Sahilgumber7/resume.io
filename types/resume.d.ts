export interface ResumeData {
  name: string
  email: string
  phone: string
  location: string
  website: string

  summary: string

  experience: Array<{
    company: string
    role: string
    startDate: string
    endDate: string
    description: string
  }>

  education: Array<{
    institution: string
    degree: string
    startDate: string
    endDate: string
    gpa: string
    description: string
  }>

  projects: Array<{
    title: string
    description: string
    link: string
  }>

  skills: string[]
  featuredSkills?: string[]

  customSection?: {
    title: string
    content: string
  }

  settings: {
    font: string
    fontSize: "Compact" | "Standard" | "Large"
    themeColor: string
    documentSize: "A4" | "Letter"
  }
}
