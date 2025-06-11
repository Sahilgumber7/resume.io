"use client"

import { useState } from "react"
import { ResumeData } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { PlusIcon, MinusIcon } from "lucide-react"

export default function ResumePreview({ resumeData }: { resumeData: ResumeData }) {
  const {
    font = "Roboto",
    fontSize = "Standard",
    themeColor = "#000000",
    documentSize = "A4",
  } = resumeData.settings || {}

  const sizeClass =
    fontSize === "Compact"
      ? "text-sm"
      : fontSize === "Large"
      ? "text-lg"
      : "text-base"

  const [scale, setScale] = useState(1)

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.1, 2))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.5))

  const width = documentSize === "Letter" ? "8.5in" : "210mm"
  const height = documentSize === "Letter" ? "11in" : "297mm"

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col items-center p-8 overflow-auto">
      {/* Zoom Controls */}
      <div className="mb-4 flex gap-2">
        <Button onClick={zoomOut} variant="outline" size="sm">
          <MinusIcon className="w-4 h-4" />
        </Button>
        <Button onClick={zoomIn} variant="outline" size="sm">
          <PlusIcon className="w-4 h-4" />
        </Button>
        <span className="text-sm text-muted-foreground">
          Zoom: {(scale * 100).toFixed(0)}%
        </span>
      </div>

      {/* Resume (A4) */}
      <div
        className={`border bg-white shadow-md ${sizeClass}`}
        style={{
          fontFamily: font,
          color: "#000",
          width,
          height,
          padding: "2rem",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold" style={{ color: themeColor }}>
            {resumeData.name}
          </h1>
          <p className="text-sm">
            {resumeData.email} | {resumeData.phone} | {resumeData.website} |{" "}
            {resumeData.location}
          </p>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <Section title="Objective" themeColor={themeColor}>
            <p>{resumeData.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <Section title="Work Experience" themeColor={themeColor}>
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold">{exp.role} – {exp.company}</p>
                <p className="text-sm italic">{exp.startDate} – {exp.endDate}</p>
                <p>{exp.description}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <Section title="Education" themeColor={themeColor}>
            {resumeData.education.map((edu, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold">{edu.degree} – {edu.institution}</p>
                <p className="text-sm italic">
                  {edu.startDate} – {edu.endDate} | GPA: {edu.gpa}
                </p>
                <p>{edu.description}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Projects */}
        {resumeData.projects.length > 0 && (
          <Section title="Projects" themeColor={themeColor}>
            {resumeData.projects.map((proj, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold">{proj.title}</p>
                <p>{proj.description}</p>
                {proj.link && (
                  <a href={proj.link} className="text-blue-600 underline" target="_blank">
                    {proj.link}
                  </a>
                )}
              </div>
            ))}
          </Section>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <Section title="Skills" themeColor={themeColor}>
            <p>{resumeData.skills.join(", ")}</p>
          </Section>
        )}


        {/* Custom Section */}
        {resumeData.customSection?.title && resumeData.customSection?.content && (
          <Section title={resumeData.customSection.title} themeColor={themeColor}>
            <p>{resumeData.customSection.content}</p>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
  themeColor,
}: {
  title: string
  children: React.ReactNode
  themeColor: string
}) {
  return (
    <section className="mb-4">
      <h2 className="text-xl font-semibold mb-1" style={{ color: themeColor }}>
        {title}
      </h2>
      {children}
    </section>
  )
}
