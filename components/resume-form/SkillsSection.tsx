"use client"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResumeData } from "@/types/resume"

interface Props {
  resumeData: ResumeData
  handleChange: (field: keyof ResumeData, value: any) => void
}

export default function SkillsSection({ resumeData, handleChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Languages: C, C++, Java, Python, JavaScript"
          value={resumeData.skills[0] || ""}
          onChange={(e) => {
            const newSkills = [...resumeData.skills]
            newSkills[0] = e.target.value
            handleChange("skills", newSkills)
          }}
        />
        <Textarea
          placeholder="Technologies: React.js, Next.js, Tailwind CSS, Supabase"
          value={resumeData.skills[1] || ""}
          onChange={(e) => {
            const newSkills = [...resumeData.skills]
            newSkills[1] = e.target.value
            handleChange("skills", newSkills)
          }}
        />
        <Textarea
          placeholder="Concepts: Data Structures, REST APIs, ML, DBMS"
          value={resumeData.skills[2] || ""}
          onChange={(e) => {
            const newSkills = [...resumeData.skills]
            newSkills[2] = e.target.value
            handleChange("skills", newSkills)
          }}
        />
      </CardContent>
    </Card>
  )
}
