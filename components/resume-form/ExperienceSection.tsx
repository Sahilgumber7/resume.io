// components/resume-form/ExperienceSection.tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ResumeData } from "@/types/resume"
import { Dispatch, SetStateAction } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export default function ExperienceSection({
  resumeData,
  setResumeData,
  handleChange,
}: {
  resumeData: ResumeData
  setResumeData: Dispatch<SetStateAction<ResumeData>>
  handleChange: (field: keyof ResumeData, value: any) => void
}) {
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        { company: "", role: "", startDate: "", endDate: "", description: "" },
      ],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {resumeData.experience.map((exp, i) => {
          const updateField = (key: keyof typeof exp, value: string) => {
            const updated = [...resumeData.experience]
            updated[i][key] = value
            handleChange("experience", updated)
          }

          return (
            <Card key={i} className="border bg-muted/40">
              <CardHeader>
                <CardTitle>Job #{i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateField("company", e.target.value)}
                />
                <Input
                  placeholder="Job Title"
                  value={exp.role}
                  onChange={(e) => updateField("role", e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) => updateField("startDate", e.target.value)}
                  />
                  <Input
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
              </CardContent>
            </Card>
          )
        })}
        <Button onClick={addExperience} variant="outline">
          Add Job
        </Button>
      </CardContent>
    </Card>
  )
}
