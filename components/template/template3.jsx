import React from "react";

export default function Template3({ resumeInfo }) {
  return (
    <main className="max-w-[960px] mx-auto my-8 p-8 bg-white font-sans">
      <header
        className="grid gap-2 border-b-4 pb-4"
        style={{ borderColor: resumeInfo?.themeColor || "#000" }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {resumeInfo?.fullName || "Your Name"}
        </h1>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-gray-600 text-sm">
          {resumeInfo?.email && (
            <span>
              Email:{" "}
              <a href={`mailto:${resumeInfo.email}`} className="text-sky-900">
                {resumeInfo.email}
              </a>
            </span>
          )}
          {resumeInfo?.phone && (
            <span>
              Phone:{" "}
              <a href={`tel:${resumeInfo.phone}`} className="text-sky-900">
                {resumeInfo.phone}
              </a>
            </span>
          )}
          {resumeInfo?.linkedin && (
            <span>
              LinkedIn:{" "}
              <a
                href={resumeInfo.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-sky-900"
              >
                {resumeInfo.linkedin}
              </a>
            </span>
          )}
          {resumeInfo?.github && (
            <span>
              GitHub:{" "}
              <a
                href={resumeInfo.github}
                target="_blank"
                rel="noreferrer"
                className="text-sky-900"
              >
                {resumeInfo.github}
              </a>
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-8 mt-8 md:grid-cols-[2fr_1fr]">
        <div>
          {resumeInfo?.education?.length > 0 && (
            <section>
              <h2 className="uppercase font-bold text-sm mb-3 text-slate-900 tracking-wide">
                Education
              </h2>
              <hr className="h-[2px] bg-gray-200 border-0 mb-3" />
              {resumeInfo.education.map((edu, i) => (
                <div key={i} className="mb-5">
                  <h3 className="text-base font-semibold">
                    {edu.universityName} - {edu.degree}
                  </h3>
                  <div className="flex gap-4 text-gray-600 text-xs mt-1">
                    <span>{edu.city}</span>
                    <span>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-gray-600 text-sm mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {resumeInfo?.experience?.length > 0 && (
            <section>
              <h2 className="uppercase font-bold text-sm mb-3 text-slate-900 tracking-wide">
                Experience
              </h2>
              <hr className="h-[2px] bg-gray-200 border-0 mb-3" />
              {resumeInfo.experience.map((exp, i) => (
                <div key={i} className="mb-5">
                  <h3 className="text-base font-semibold">
                    {exp.companyName} - {exp.title}
                  </h3>
                  <div className="flex gap-4 text-gray-600 text-xs mt-1">
                    <span>{exp.city}</span>
                    <span>
                      {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div
                    className="text-sm text-gray-700 mt-2"
                    dangerouslySetInnerHTML={{ __html: exp.worksummary }}
                  />
                </div>
              ))}
            </section>
          )}

          {resumeInfo?.projects?.length > 0 && (
            <section>
              <h2 className="uppercase font-bold text-sm mb-3 text-slate-900 tracking-wide">
                Projects
              </h2>
              <hr className="h-[2px] bg-gray-200 border-0 mb-3" />
              {resumeInfo.projects.map((project, i) => (
                <div key={i} className="mb-5">
                  <h3 className="text-base font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>

        <aside>
          {resumeInfo?.skills?.length > 0 && (
            <section>
              <h2 className="uppercase font-bold text-sm mb-3 text-slate-900 tracking-wide">
                Technical Skills
              </h2>
              <hr className="h-[2px] bg-gray-200 border-0 mb-3" />
              {resumeInfo.skills.map((skill, i) => (
                <p key={i} className="text-sm text-gray-700">
                  {skill.name}
                </p>
              ))}
            </section>
          )}

          {(resumeInfo?.github || resumeInfo?.linkedin) && (
            <section className="mt-6">
              <h2 className="uppercase font-bold text-sm mb-3 text-slate-900 tracking-wide">
                Links
              </h2>
              <hr className="h-[2px] bg-gray-200 border-0 mb-3" />
              <ul className="list-disc list-inside text-sm text-gray-700">
                {resumeInfo.github && (
                  <li>
                    <a href={resumeInfo.github} target="_blank" rel="noreferrer">
                      {resumeInfo.github}
                    </a>
                  </li>
                )}
                {resumeInfo.linkedin && (
                  <li>
                    <a href={resumeInfo.linkedin} target="_blank" rel="noreferrer">
                      {resumeInfo.linkedin}
                    </a>
                  </li>
                )}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}
