import { ResumeData } from "@/types/resume"

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

  const themeColor = settings.themeColor

  return (
    <div
      className={`w-full max-w-[800px] mx-auto px-10 py-10 bg-white ${fontSizeClass} text-gray-900`}
      style={{ fontFamily: settings.font }}
    >
      <Header
        name={name}
        email={email}
        phone={phone}
        website={website}
        location={location}
        themeColor={themeColor}
      />

      {summary && (
        <Section title="Professional Summary" themeColor={themeColor}>
          <p className="text-justify leading-relaxed">{summary}</p>
        </Section>
      )}

      <ExperienceSection experience={experience} themeColor={themeColor} />
      <EducationSection education={education} themeColor={themeColor} />
      <ProjectsSection projects={projects} themeColor={themeColor} />

      {skills.length > 0 && (
        <Section title="Skills" themeColor={themeColor}>
          <ul className="list-disc list-inside columns-2 gap-x-8">
            {skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </Section>
      )}

      {customSection.title && (
        <Section title={customSection.title} themeColor={themeColor}>
          <p>{customSection.content}</p>
        </Section>
      )}
    </div>
  )
}

function Header({ name, email, phone, website, location, themeColor }: any) {
  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: themeColor }}>
        {name || "Your Name"}
      </h1>
      <div className="mt-2 flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-sm text-gray-700">
        {email && <ContactLink href={`mailto:${email}`} label={email} />}
        {phone && <ContactLink href={`tel:${phone}`} label={phone} />}
        {website && <ContactLink href={website} label={website} external />}
        {location && <span>{location}</span>}
      </div>
    </header>
  )
}

function Section({ title, children, themeColor }: any) {
  return (
    <section className="mb-8">
      <h2
        className="text-xl font-semibold uppercase tracking-wide mb-2 border-b pb-1"
        style={{ color: themeColor }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function ContactLink({ href, label, external = false }: any) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="text-blue-600 hover:underline"
    >
      {label}
    </a>
  )
}

function ExperienceSection({ experience, themeColor }: any) {
  return (
    <Section title="Experience" themeColor={themeColor}>
      {experience.length > 0 ? (
        experience.map((exp: any, i: number) => (
          <div key={i} className="mb-4">
            <p className="font-semibold text-gray-900">
              {exp.role} @ {exp.company}
            </p>
            <p className="text-xs italic text-gray-500">
              {exp.startDate} – {exp.endDate}
            </p>
            <ul className="list-disc list-inside mt-1 text-sm leading-relaxed">
              {exp.description.split("\n").map((line: string, idx: number) => (
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

function EducationSection({ education, themeColor }: any) {
  return (
    <Section title="Education" themeColor={themeColor}>
      {education.length > 0 ? (
        education.map((edu: any, i: number) => (
          <div key={i} className="mb-4">
            <p className="font-semibold text-gray-900">
              {edu.degree} @ {edu.institution}
            </p>
            <p className="text-xs italic text-gray-500">
              {edu.startDate} – {edu.endDate} | GPA: {edu.gpa}
            </p>
            <p className="text-sm mt-1">{edu.description}</p>
          </div>
        ))
      ) : (
        <PlaceholderText />
      )}
    </Section>
  )
}

function ProjectsSection({ projects, themeColor }: any) {
  return (
    <Section title="Projects" themeColor={themeColor}>
      {projects.length > 0 ? (
        projects.map((proj: any, i: number) => (
          <div key={i} className="mb-4">
            <p className="font-semibold text-gray-900">{proj.title}</p>
            <p className="text-sm mt-1">{proj.description}</p>
            {proj.link && (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm hover:text-blue-800 transition"
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

function PlaceholderText() {
  return <p className="text-sm text-gray-400 italic">No content yet.</p>
}
