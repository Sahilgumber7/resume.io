
import React from "react";
import PersonalDetailPreview from "../preview/PersonalDetailPreview";
import SummaryPreview from "../preview/SummaryPreview";
import ExperiencePreview from "../preview/ExperiencePreview";
import EducationalPreview from "../preview/EducationalPreview";
import SkillsPreview from "../preview/SkillsPreview";
import ProjectPreview from "../preview/ProjectPreview";

export default function Template2({ resumeInfo }) {
  if (!resumeInfo) return null;
  const visibility = resumeInfo?.sectionVisibility || {};
  const showEducation = visibility.education !== false;
  const showExperience = visibility.experience !== false;
  const showProjects = visibility.projects !== false;

  return (
    <div className="w-full bg-white p-6 font-sans leading-relaxed text-gray-900 sm:p-8">
      {/* Personal Details */}
      <div className="border-b border-gray-300 pb-4 mb-6">
        <PersonalDetailPreview resumeInfo={resumeInfo} />
      </div>

      {/* Summary */}
      {resumeInfo?.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <SummaryPreview resumeInfo={resumeInfo} />
        </div>
      )}

      {/* Skills */}
      {resumeInfo?.skills?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-2">
            Skills
          </h2>
          <SkillsPreview resumeInfo={resumeInfo} />
        </div>
      )}

      {/* Experience */}
      {showExperience && resumeInfo?.experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-2">
            Experience
          </h2>
          <ExperiencePreview resumeInfo={resumeInfo} />
        </div>
      )}

      {/* Education */}
      {showEducation && resumeInfo?.education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-2">
            Education
          </h2>
          <EducationalPreview resumeInfo={resumeInfo} />
        </div>
      )}

      {/* Projects */}
      {showProjects && resumeInfo?.projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700 border-b border-gray-200 pb-1 mb-2">
            Projects
          </h2>
          <ProjectPreview resumeInfo={resumeInfo} />
        </div>
      )}
    </div>
  );
}

