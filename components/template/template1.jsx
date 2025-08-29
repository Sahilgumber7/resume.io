// src/template/Template1.jsx
import React from "react";
import PersonalDetailPreview from "@/components/preview/PersonalDetailPreview";
import SummaryPreview from "@/components/preview/SummaryPreview";
import ExperiencePreview from "@/components/preview/ExperiencePreview";
import EducationalPreview from "@/components/preview/EducationalPreview";
import SkillsPreview from "@/components/preview/SkillsPreview";
import ProjectPreview from "@/components/preview/ProjectPreview";

function Template1({ resumeInfo }) {
  if (!resumeInfo) return null;

  return (
    <div
      className="shadow-lg h-full p-14 border-t-[20px] bg-white text-black dark:bg-white dark:text-black"
      style={{ borderColor: resumeInfo?.themeColor }}
    >
      <PersonalDetailPreview resumeInfo={resumeInfo} />
      <SummaryPreview resumeInfo={resumeInfo} />
      {resumeInfo?.education?.length > 0 && (
        <EducationalPreview resumeInfo={resumeInfo} />
      )}
      {resumeInfo?.experience?.length > 0 && (
        <ExperiencePreview resumeInfo={resumeInfo} />
      )}
      {resumeInfo?.projects?.length > 0 && (
        <ProjectPreview resumeInfo={resumeInfo} />
      )}
      {resumeInfo?.skills?.length > 0 && (
        <SkillsPreview resumeInfo={resumeInfo} />
      )}
    </div>
  );
}

export default Template1;
