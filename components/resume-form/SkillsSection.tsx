// components/sections/SkillsSection.tsx
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
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="List your skills separated by commas"
          value={resumeData.skills.join(", ")}
          onChange={(e) => handleChange("skills", e.target.value.split(",").map((s) => s.trim()))}
        />
      </CardContent>
    </Card>
  )
}
