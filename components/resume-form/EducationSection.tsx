// components/resume-form/EducationSection.tsx
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

export default function EducationSection({
  resumeData,
  setResumeData,
  handleChange,
}: {
  resumeData: ResumeData
  setResumeData: Dispatch<SetStateAction<ResumeData>>
  handleChange: (field: keyof ResumeData, value: any) => void
}) {
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          institution: "",
          degree: "",
          gpa: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Education</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {resumeData.education.map((edu, i) => {
          const updateField = (key: keyof typeof edu, value: string) => {
            const updated = [...resumeData.education]
            updated[i][key] = value
            handleChange("education", updated)
          }

          return (
            <Card key={i} className="bg-muted/40">
              <CardHeader>
                <CardTitle>School #{i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="School"
                  value={edu.institution}
                  onChange={(e) => updateField("institution", e.target.value)}
                />
                <Input
                  placeholder="Degree & Major"
                  value={edu.degree}
                  onChange={(e) => updateField("degree", e.target.value)}
                />
                <Input
                  placeholder="GPA"
                  value={edu.gpa}
                  onChange={(e) => updateField("gpa", e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Start Date"
                    value={edu.startDate}
                    onChange={(e) =>
                      updateField("startDate", e.target.value)
                    }
                  />
                  <Input
                    placeholder="End Date"
                    value={edu.endDate}
                    onChange={(e) => updateField("endDate", e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Description (Optional)"
                  value={edu.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                />
              </CardContent>
            </Card>
          )
        })}
        <Button onClick={addEducation} variant="outline">
          Add School
        </Button>
      </CardContent>
    </Card>
  )
}
