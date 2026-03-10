// src/template/Template1.jsx
import React from "react";
import PersonalDetailPreview from "@/components/preview/PersonalDetailPreview";
import SummaryPreview from "@/components/preview/SummaryPreview";
import ExperiencePreview from "@/components/preview/ExperiencePreview";
import EducationalPreview from "@/components/preview/EducationalPreview";
import SkillsPreview from "@/components/preview/SkillsPreview";
import ProjectPreview from "@/components/preview/ProjectPreview";

export default function Template1({ resumeInfo }) {
  if (!resumeInfo) return null;
  const visibility = resumeInfo?.sectionVisibility || {};
  const showEducation = visibility.education !== false;
  const showExperience = visibility.experience !== false;
  const showProjects = visibility.projects !== false;

  return (
    <div
      className="h-full w-full border-t-[20px] bg-white p-6 text-black shadow-lg sm:p-8 md:p-10 dark:bg-white dark:text-black"
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      <SummaryPreview resumeInfo={resumeInfo} />
      {showEducation && resumeInfo?.education?.length > 0 && (
        <EducationalPreview resumeInfo={resumeInfo} />
      )}
      {showExperience && resumeInfo?.experience?.length > 0 && (
        <ExperiencePreview resumeInfo={resumeInfo} />
      )}
      {showProjects && resumeInfo?.projects?.length > 0 && (
        <ProjectPreview resumeInfo={resumeInfo} />
      )}
      {resumeInfo?.skills?.length > 0 && (
        <SkillsPreview resumeInfo={resumeInfo} />
      )}
    </div>
  );
}

