'use client'

import { ResumeData } from "@/types/resume"
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
} from "lucide-react"

export default function ResumeDocument({ resumeData }: { resumeData: ResumeData }) {
  const {
    name,
    email,
    phone,
    website,
    location,
    summary,
    experience,
    education,
    projects,
    skills,
    customSection = { title: "", content: "" },
    settings,
  } = resumeData

  const fontSizeClass =
    settings.fontSize === "Compact"
      ? "text-sm"
      : settings.fontSize === "Large"
      ? "text-lg"
      : "text-base"

  const themeColor = settings.themeColor || "#3b82f6"

  return (
    <div
      className={`w-full max-w-[800px] mx-auto px-4 sm:px-6 md:px-10 py-10 bg-white ${fontSizeClass} text-gray-900`}
      style={{ fontFamily: settings.font }}
    >
      <Header
        name={name}
        email={email}
        phone={phone}
        website={website}
        location={location}
        summary={summary}
        themeColor={themeColor}
      />

      <ExperienceSection experience={experience} themeColor={themeColor} />
      <EducationSection education={education} themeColor={themeColor} />
      <ProjectsSection projects={projects} themeColor={themeColor} />
      <SkillsSection skills={skills} themeColor={themeColor} />

      {customSection.title && (
        <Section title={customSection.title} themeColor={themeColor}>
          <p>{customSection.content}</p>
        </Section>
      )}
    </div>
  )
}

// ---------------------- Header ----------------------

type HeaderProps = {
  name: string
  email?: string
  phone?: string
  website?: string
  location?: string
  summary?: string
  themeColor: string
}

function Header({
  name,
  email,
  phone,
  website,
  location,
  summary,
  themeColor,
}: HeaderProps) {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-4xl font-bold mb-2" style={{ color: themeColor }}>
        {name || "Your Name"}
      </h1>

      <div className="flex justify-center gap-6 flex-wrap text-sm text-gray-700 mb-1">
        {website && (
          <ContactLink
            icon={<Linkedin size={16} />}
            href={website}
            label="LinkedIn"
            external
          />
        )}
        {phone && (
          <ContactLink icon={<Phone size={16} />} href={`tel:${phone}`} label={phone} />
        )}
      </div>

      <div className="flex justify-center gap-6 flex-wrap text-sm text-gray-700 mb-2">
        {location && <ContactLink icon={<MapPin size={16} />} label={location} />}
        {email && (
          <ContactLink icon={<Mail size={16} />} href={`mailto:${email}`} label={email} />
        )}
      </div>

      {summary && <p className="mt-2 text-base text-gray-700">{summary}</p>}
    </header>
  )
}

type ContactLinkProps = {
  icon: React.ReactNode
  href?: string
  label: string
  external?: boolean
}

function ContactLink({ icon, href, label, external = false }: ContactLinkProps) {
  const content = (
    <span className="flex items-center gap-1 group">
      {icon}
      <span className="group-hover:underline text-gray-700">{label}</span>
    </span>
  )

  if (!href) {
    return <div className="text-gray-700">{content}</div>
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-gray-700 no-underline hover:no-underline"
    >
      {content}
    </a>
  )
}

// ---------------------- Section Wrapper ----------------------

type SectionProps = {
  title: string
  children: React.ReactNode
  themeColor: string
}

function Section({ title, children, themeColor }: SectionProps) {
  return (
    <section className="mb-8">
      <h2
        className="text-lg font-bold uppercase tracking-wide mb-2 border-l-4 pl-2"
        style={{ borderColor: themeColor, color: themeColor }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

// ---------------------- Experience Section ----------------------

function ExperienceSection({ experience, themeColor }: any) {
  return (
    <Section title="Work Experience" themeColor={themeColor}>
      {experience.length > 0 ? (
        experience.map((exp: any, i: number) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-start flex-wrap">
              <p className="font-semibold text-gray-900">
                {exp.role} @ {exp.company}
              </p>
              <p className="text-sm italic text-gray-500 whitespace-nowrap">
                {exp.startDate} – {exp.endDate}
              </p>
            </div>
            <ul className="list-disc list-inside mt-1 text-sm leading-relaxed text-gray-700">
              {exp.description?.split("\n").map((line: string, idx: number) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <PlaceholderText />
      )}
    </Section>
  )
}

// ---------------------- Education Section ----------------------

function EducationSection({ education, themeColor }: any) {
  return (
    <Section title="Education" themeColor={themeColor}>
      {education.length > 0 ? (
        education.map((edu: any, i: number) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-start flex-wrap">
              <p className="font-semibold text-gray-900">
                {edu.degree} @ {edu.institution}
              </p>
              <p className="text-sm italic text-gray-500 whitespace-nowrap">
                {edu.startDate} – {edu.endDate}
              </p>
            </div>
            <p className="text-sm text-gray-700">GPA: {edu.gpa}</p>
            <p className="text-sm mt-1 text-gray-700">{edu.description}</p>
          </div>
        ))
      ) : (
        <PlaceholderText />
      )}
    </Section>
  )
}

// ---------------------- Projects Section ----------------------

function ProjectsSection({ projects, themeColor }: any) {
  return (
    <Section title="Projects" themeColor={themeColor}>
      {projects.length > 0 ? (
        projects.map((proj: any, i: number) => (
          <div key={i} className="mb-4">
            <p className="font-semibold text-gray-900">{proj.title}</p>
            <p className="text-sm mt-1 text-gray-700">{proj.description}</p>
            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline text-gray-700 hover:text-gray-900 transition"
              >
                {proj.link}
              </a>
            )}
          </div>
        ))
      ) : (
        <PlaceholderText />
      )}
    </Section>
  )
}

// ---------------------- Skills Section ----------------------

function SkillsSection({ skills, themeColor }: any) {
  if (!skills || skills.length === 0) return null

  const [languages = "", technologies = "", concepts = ""] = skills

  const formatLine = (label: string, values: string) => {
    const formatted = values
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .join(", ")

    return formatted ? (
      <p className="text-sm text-gray-700">
        <span className="font-semibold" style={{ color: themeColor }}>
          {label}:
        </span>{" "}
        {formatted}
      </p>
    ) : null
  }

  return (
    <Section title="Skills" themeColor={themeColor}>
      <div className="space-y-2">
        {formatLine("Languages", languages)}
        {formatLine("Technologies", technologies)}
        {formatLine("Concepts", concepts)}
      </div>
    </Section>
  )
}

// ---------------------- Placeholder Text ----------------------

function PlaceholderText() {
  return <p className="text-sm text-gray-400 italic">No content yet.</p>
}
