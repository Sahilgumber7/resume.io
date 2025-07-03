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
      className={`w-full max-w-[750px] px-12 py-10 ${fontSizeClass} text-gray-900`}
      style={{
        fontFamily: settings.font,
        boxSizing: "border-box",
        backgroundColor: "white",
      }}
    >
      <Header
        name={name}
        email={email}
        phone={phone}
        website={website}
        location={location}
        themeColor={themeColor}
      />

      <Section title="Summary" themeColor={themeColor}>
        {summary ? <p>{summary}</p> : <PlaceholderText />}
      </Section>

      <ExperienceSection experience={experience} />
      <EducationSection education={education} />
      <ProjectsSection projects={projects} />

      <Section title="Skills" themeColor={themeColor}>
        {skills.length > 0 ? (
          <p className="text-sm">{skills.join(", ")}</p>
        ) : (
          <PlaceholderText />
        )}
      </Section>

      {customSection.title && (
        <Section title={customSection.title} themeColor={themeColor}>
          {customSection.content ? (
            <p className="text-sm">{customSection.content}</p>
          ) : (
            <PlaceholderText />
          )}
        </Section>
      )}
    </div>
  )
}

function Header({ name, email, phone, website, location, themeColor }: any) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold tracking-tight" style={{ color: themeColor }}>
        {name || "Your Name"}
      </h1>
      <div className="mt-2 flex flex-wrap justify-center items-center gap-2 text-sm text-gray-700">
        {email && <ContactLink href={`mailto:${email}`} label={email} />}
        {phone && (
          <>
            <Separator />
            <ContactLink href={`tel:${phone}`} label={phone} />
          </>
        )}
        {website && (
          <>
            <Separator />
            <ContactLink href={website} label={website} external />
          </>
        )}
        {location && (
          <>
            <Separator />
            <span>{location}</span>
          </>
        )}
      </div>
    </header>
  )
}

function Section({ title, children, themeColor }: any) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3" style={{ color: themeColor }}>
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
      className="text-blue-600 underline hover:text-blue-800 transition"
    >
      {label}
    </a>
  )
}

function ExperienceSection({ experience }: any) {
  return (
    <Section title="Experience" themeColor="#000">
      {experience.length > 0 ? (
        experience.map((exp: any, i: number) => (
          <div key={i} className="mb-4">
            <p className="font-semibold text-gray-900">
              {exp.role} @ {exp.company}
            </p>
            <p className="text-xs italic text-gray-500">
              {exp.startDate} – {exp.endDate}
            </p>
            <p className="text-sm mt-1">{exp.description}</p>
          </div>
        ))
      ) : (
        <PlaceholderText />
      )}
    </Section>
  )
}

function EducationSection({ education }: any) {
  return (
    <Section title="Education" themeColor="#000">
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

function ProjectsSection({ projects }: any) {
  return (
    <Section title="Projects" themeColor="#000">
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
  return <p className="text-sm text-muted-foreground italic">No content yet.</p>
}

function Separator() {
  return <span className="text-gray-400 px-1">|</span>
}
