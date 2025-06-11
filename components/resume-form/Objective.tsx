// components/sections/ObjectiveSection.tsx
"use client"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResumeData } from "@/types/resume"

interface Props {
  resumeData: ResumeData
  handleChange: (field: keyof ResumeData, value: any) => void
}

export default function ObjectiveSection({ resumeData, handleChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Objective</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="A short professional summary..."
          value={resumeData.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
        />
      </CardContent>
    </Card>
  )
}