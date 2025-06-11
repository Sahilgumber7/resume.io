// components/ResumePreview.tsx
"use client"

import { ResumeData } from "@/types/resume"

export default function ResumePreview({ resumeData }: { resumeData: ResumeData }) {
  const { font = "Roboto", fontSize = "Standard", themeColor = "#000000", documentSize = "A4" } = resumeData.settings || {}

  const sizeClass = fontSize === "Compact" ? "text-sm" : fontSize === "Large" ? "text-lg" : "text-base"

  return (
    <div
      className={`p-10 border shadow bg-white ${sizeClass}`}
      style={{
        fontFamily: font,
        color: "#000",
        maxWidth: documentSize === "Letter" ? "8.5in" : "210mm",
        width: "100%",
      }}
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: themeColor }}>{resumeData.name}</h1>
        <p>{resumeData.email} | {resumeData.phone} | {resumeData.website} | {resumeData.location}</p>
      </div>

      {/* Objective */}
      {resumeData.summary && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Objective</h2>
          <p>{resumeData.summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {resumeData.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Work Experience</h2>
          {resumeData.experience.map((exp, i) => (
            <div key={i} className="mb-2">
              <p className="font-bold">{exp.role} – {exp.company}</p>
              <p className="text-sm italic">{exp.startDate} – {exp.endDate}</p>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {resumeData.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Education</h2>
          {resumeData.education.map((edu, i) => (
            <div key={i} className="mb-2">
              <p className="font-bold">{edu.degree} – {edu.institution}</p>
              <p className="text-sm italic">{edu.startDate} – {edu.endDate} | GPA: {edu.gpa}</p>
              <p>{edu.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {resumeData.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Projects</h2>
          {resumeData.projects.map((proj, i) => (
            <div key={i} className="mb-2">
              <p className="font-bold">{proj.title}</p>
              <p>{proj.description}</p>
              {proj.link && <a href={proj.link} className="text-blue-600 underline">{proj.link}</a>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {resumeData.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Skills</h2>
          <p>{resumeData.skills.join(", ")}</p>
        </section>
      )}

      {/* Featured Skills */}
      {resumeData.featuredSkills && resumeData.featuredSkills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: themeColor }}>Featured Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.featuredSkills.map((skill, i) => (
              <span key={i} className="bg-gray-200 px-3 py-1 rounded-full">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Custom Section */}
      {resumeData.customSection?.title && resumeData.customSection?.content && (
        <section className="mb-4">
          <h2 className="text-xl font-semibold" style={{ color: themeColor }}>
            {resumeData.customSection.title}
          </h2>
          <p>{resumeData.customSection.content}</p>
        </section>
      )}
    </div>
  )
}
