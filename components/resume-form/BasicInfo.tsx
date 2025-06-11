// components/sections/BasicInfoSection.tsx
"use client"

import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResumeData } from "@/types/resume"

interface Props {
  resumeData: ResumeData
  handleChange: (field: keyof ResumeData, value: any) => void
}

export default function BasicInfoSection({ resumeData, handleChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Full Name" value={resumeData.name} onChange={(e) => handleChange("name", e.target.value)} />
        <Input placeholder="Email" value={resumeData.email} onChange={(e) => handleChange("email", e.target.value)} />
        <Input placeholder="Phone" value={resumeData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        <Input placeholder="Website / LinkedIn" value={resumeData.website} onChange={(e) => handleChange("website", e.target.value)} />
        <Input placeholder="Location" value={resumeData.location} onChange={(e) => handleChange("location", e.target.value)} />
      </CardContent>
    </Card>
  )
}