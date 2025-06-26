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
    settings
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
      className={`w-full h-full p-10 ${fontSizeClass}`}
      style={{
        fontFamily: settings.font,
        color: "#000",
      }}
    >
      {/* Name + Contact Info */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: themeColor }}>
          {name || "Your Name"}
        </h1>

        <div className="mt-2 text-sm text-gray-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
          {email && (
            <a href={`mailto:${email}`} className="text-blue-600 underline">
              {email}
            </a>
          )}
          {phone && (
            <>
              <Separator />
              <a href={`tel:${phone}`} className="text-blue-600 underline">
                {phone}
              </a>
            </>
          )}
          {website && (
            <>
              <Separator />
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {website}
              </a>
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

      {/* Sections */}
      <Section title="Summary" themeColor={themeColor}>
        {summary ? <p>{summary}</p> : <PlaceholderText />}
      </Section>

      <Section title="Experience" themeColor={themeColor}>
        {experience.length > 0 ? (
          experience.map((exp, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-semibold">
                {exp.role} @ {exp.company}
              </p>
              <p className="text-xs italic text-muted-foreground">
                {exp.startDate} – {exp.endDate}
              </p>
              <p className="text-sm">{exp.description}</p>
            </div>
          ))
        ) : (
          <PlaceholderText />
        )}
      </Section>

      <Section title="Education" themeColor={themeColor}>
        {education.length > 0 ? (
          education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-semibold">
                {edu.degree} @ {edu.institution}
              </p>
              <p className="text-xs italic text-muted-foreground">
                {edu.startDate} – {edu.endDate} | GPA: {edu.gpa}
              </p>
              <p className="text-sm">{edu.description}</p>
            </div>
          ))
        ) : (
          <PlaceholderText />
        )}
      </Section>

      <Section title="Projects" themeColor={themeColor}>
        {projects.length > 0 ? (
          projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-semibold">{proj.title}</p>
              <p className="text-sm">{proj.description}</p>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
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

      <Section title="Skills" themeColor={themeColor}>
        {skills.length > 0 ? (
          <p className="text-sm">{skills.join(", ")}</p>
        ) : (
          <PlaceholderText />
        )}
      </Section>

      {/* Custom Section */}
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
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-2" style={{ color: themeColor }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function PlaceholderText() {
  return <p className="text-sm text-muted-foreground italic">No content yet.</p>
}

function Separator() {
  return <span className="text-gray-400">|</span>
}
