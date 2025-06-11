// components/sections/CustomSection.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResumeData } from "@/types/resume"

interface Props {
  resumeData: ResumeData
  handleChange: (field: keyof ResumeData, value: any) => void
}

export default function CustomSection({ resumeData, handleChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Title"
          value={resumeData.customSection?.title || ""}
          onChange={(e) =>
            handleChange("customSection", {
              ...resumeData.customSection,
              title: e.target.value,
            })
          }
        />
        <Textarea
          placeholder="Content"
          value={resumeData.customSection?.content || ""}
          onChange={(e) =>
            handleChange("customSection", {
              ...resumeData.customSection,
              content: e.target.value,
            })
          }
        />
      </CardContent>
    </Card>
  )
}
