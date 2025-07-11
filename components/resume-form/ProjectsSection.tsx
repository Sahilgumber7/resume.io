// components/resume-form/ProjectsSection.tsx
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

export default function ProjectsSection({
  resumeData,
  setResumeData,
  handleChange,
}: {
  resumeData: ResumeData
  setResumeData: Dispatch<SetStateAction<ResumeData>>
  handleChange: (field: keyof ResumeData, value: any) => void
}) {
  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { title: "", description: "", link: "", tags: [] },
      ],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projects</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {resumeData.projects.map((proj, i) => {
          const updateField = (key: keyof typeof proj, value: any) => {
            const updated = [...resumeData.projects]
            updated[i][key] = value
            handleChange("projects", updated)
          }

          return (
            <Card key={i} className="bg-muted/40">
              <CardHeader>
                <CardTitle>Project #{i + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Project Title"
                  value={proj.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />
                <Textarea
                  placeholder="Description"
                  value={proj.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />
                <Input
                  placeholder="Link (Optional)"
                  value={proj.link}
                  onChange={(e) => updateField("link", e.target.value)}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={proj.tags?.join(", ") || ""}
                  onChange={(e) =>
                    updateField(
                      "tags",
                      e.target.value.split(",").map((tag) => tag.trim())
                    )
                  }
                />
              </CardContent>
            </Card>
          )
        })}
        <Button onClick={addProject} variant="outline">
          Add Project
        </Button>
      </CardContent>
    </Card>
  )
}
