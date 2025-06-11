// components/ResumeForm.tsx
"use client"

import { Dispatch, SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ResumeData } from "@/types/resume"
import { Button } from "@/components/ui/button"

interface Props {
  resumeData: ResumeData
  setResumeData: Dispatch<SetStateAction<ResumeData>>
}

export default function ResumeForm({ resumeData, setResumeData }: Props) {
  const handleChange = (field: keyof ResumeData, value: any) => {
    setResumeData({ ...resumeData, [field]: value })
  }

  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    })
  }

  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          institution: "",
          degree: "",
          startDate: "",
          endDate: "",
          description: "",
          gpa: "",
        },
      ],
    })
  }

  const addProject = () => {
    setResumeData({
      ...resumeData,
      projects: [...resumeData.projects, { title: "", description: "", link: "" }],
    })
  }

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Basic Info</h2>
        <Input placeholder="Full Name" value={resumeData.name} onChange={(e) => handleChange("name", e.target.value)} />
        <Input placeholder="Email" value={resumeData.email} onChange={(e) => handleChange("email", e.target.value)} />
        <Input placeholder="Phone" value={resumeData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        <Input placeholder="Website / LinkedIn" value={resumeData.website} onChange={(e) => handleChange("website", e.target.value)} />
        <Input placeholder="Location" value={resumeData.location} onChange={(e) => handleChange("location", e.target.value)} />
      </section>

      {/* Objective */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Objective</h2>
        <Textarea placeholder="A short professional summary..." value={resumeData.summary} onChange={(e) => handleChange("summary", e.target.value)} />
      </section>

      {/* Work Experience */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Work Experience</h2>
        {resumeData.experience.map((exp, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border p-4 rounded-lg">
            <Input placeholder="Company" value={exp.company} onChange={(e) => {
              const updated = [...resumeData.experience]
              updated[i].company = e.target.value
              handleChange("experience", updated)
            }} />
            <Input placeholder="Job Title" value={exp.role} onChange={(e) => {
              const updated = [...resumeData.experience]
              updated[i].role = e.target.value
              handleChange("experience", updated)
            }} />
            <div className="flex gap-2">
              <Input placeholder="Start Date" value={exp.startDate} onChange={(e) => {
                const updated = [...resumeData.experience]
                updated[i].startDate = e.target.value
                handleChange("experience", updated)
              }} />
              <Input placeholder="End Date" value={exp.endDate} onChange={(e) => {
                const updated = [...resumeData.experience]
                updated[i].endDate = e.target.value
                handleChange("experience", updated)
              }} />
            </div>
            <Textarea placeholder="Description" value={exp.description} onChange={(e) => {
              const updated = [...resumeData.experience]
              updated[i].description = e.target.value
              handleChange("experience", updated)
            }} />
          </div>
        ))}
        <Button onClick={addExperience} variant="outline">Add Job</Button>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Education</h2>
        {resumeData.education.map((edu, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border p-4 rounded-lg">
            <Input placeholder="School" value={edu.institution} onChange={(e) => {
              const updated = [...resumeData.education]
              updated[i].institution = e.target.value
              handleChange("education", updated)
            }} />
            <Input placeholder="Degree & Major" value={edu.degree} onChange={(e) => {
              const updated = [...resumeData.education]
              updated[i].degree = e.target.value
              handleChange("education", updated)
            }} />
            <Input placeholder="GPA" value={edu.gpa} onChange={(e) => {
              const updated = [...resumeData.education]
              updated[i].gpa = e.target.value
              handleChange("education", updated)
            }} />
            <div className="flex gap-2">
              <Input placeholder="Start Date" value={edu.startDate} onChange={(e) => {
                const updated = [...resumeData.education]
                updated[i].startDate = e.target.value
                handleChange("education", updated)
              }} />
              <Input placeholder="End Date" value={edu.endDate} onChange={(e) => {
                const updated = [...resumeData.education]
                updated[i].endDate = e.target.value
                handleChange("education", updated)
              }} />
            </div>
            <Textarea placeholder="Description (Optional)" value={edu.description} onChange={(e) => {
              const updated = [...resumeData.education]
              updated[i].description = e.target.value
              handleChange("education", updated)
            }} />
          </div>
        ))}
        <Button onClick={addEducation} variant="outline">Add School</Button>
      </section>

      {/* Projects */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Projects</h2>
        {resumeData.projects.map((proj, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border p-4 rounded-lg">
            <Input placeholder="Project Title" value={proj.title} onChange={(e) => {
              const updated = [...resumeData.projects]
              updated[i].title = e.target.value
              handleChange("projects", updated)
            }} />
            <Textarea placeholder="Description" value={proj.description} onChange={(e) => {
              const updated = [...resumeData.projects]
              updated[i].description = e.target.value
              handleChange("projects", updated)
            }} />
            <Input placeholder="Link (Optional)" value={proj.link} onChange={(e) => {
              const updated = [...resumeData.projects]
              updated[i].link = e.target.value
              handleChange("projects", updated)
            }} />
          </div>
        ))}
        <Button onClick={addProject} variant="outline">Add Project</Button>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Skills</h2>
        <Textarea
          placeholder="List your skills separated by commas"
          value={resumeData.skills.join(", ")}
          onChange={(e) => handleChange("skills", e.target.value.split(",").map((s) => s.trim()))}
        />
      </section>

      {/* Featured Skills */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Featured Skills (Optional)</h2>
        <Textarea
          placeholder="Skill 1, Skill 2, Skill 3..."
          value={resumeData.featuredSkills?.join(", ") || ""}
          onChange={(e) => handleChange("featuredSkills", e.target.value.split(",").map((s) => s.trim()))}
        />
      </section>

      {/* Custom Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Custom Section</h2>
        <Input placeholder="Title" value={resumeData.customSection?.title || ""} onChange={(e) =>
          handleChange("customSection", {
            ...resumeData.customSection,
            title: e.target.value,
          })
        } />
        <Textarea placeholder="Content" value={resumeData.customSection?.content || ""} onChange={(e) =>
          handleChange("customSection", {
            ...resumeData.customSection,
            content: e.target.value,
          })
        } />
      </section>

      {/* Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Resume Settings</h2>
        <Label>Font</Label>
        <select value={resumeData.settings?.font || "Roboto"} onChange={(e) => handleChange("settings", { ...resumeData.settings, font: e.target.value })}>
          {["Roboto", "Lato", "Montserrat", "Open Sans", "Raleway", "Lora", "Merriweather", "Playfair Display"].map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        <Label>Font Size</Label>
        <select value={resumeData.settings?.fontSize || "Standard"} onChange={(e) => handleChange("settings", { ...resumeData.settings, fontSize: e.target.value })}>
          <option value="Compact">Compact</option>
          <option value="Standard">Standard</option>
          <option value="Large">Large</option>
        </select>

        <Label>Theme Color</Label>
        <Input type="color" value={resumeData.settings?.themeColor || "#000000"} onChange={(e) => handleChange("settings", { ...resumeData.settings, themeColor: e.target.value })} />

        <Label>Document Size</Label>
        <select value={resumeData.settings?.documentSize || "A4"} onChange={(e) => handleChange("settings", { ...resumeData.settings, documentSize: e.target.value })}>
          <option value="A4">A4 (Other countries)</option>
          <option value="Letter">Letter (US, Canada)</option>
        </select>
      </section>
    </div>
  )
}
