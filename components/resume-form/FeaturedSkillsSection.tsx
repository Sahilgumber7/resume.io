// components/sections/FeaturedSkillsSection.tsx
"use client"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResumeData } from "@/types/resume"

interface Props {
  resumeData: ResumeData
  handleChange: (field: keyof ResumeData, value: any) => void
}

export default function FeaturedSkillsSection({ resumeData, handleChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Skills (Optional)</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Skill 1, Skill 2, Skill 3..."
          value={resumeData.featuredSkills?.join(", ") || ""}
          onChange={(e) => handleChange("featuredSkills", e.target.value.split(",").map((s) => s.trim()))}
        />
      </CardContent>
    </Card>
  )
}
