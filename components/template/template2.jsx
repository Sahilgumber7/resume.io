// src/components/templates/Template2.js
import React from 'react';
import PersonalDetailPreview from '../preview/PersonalDetailPreview';
import SummaryPreview from '../preview/SummaryPreview';
import ExperiencePreview from '../preview/ExperiencePreview';
import EducationalPreview from '../preview/EducationalPreview';
import SkillsPreview from '../preview/SkillsPreview';
import ProjectPreview from '../preview/ProjectPreview';

function Template2({ resumeInfo }) {
  if (!resumeInfo) return null;

  return (
    <div className="grid grid-cols-3 h-full bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div
        className="col-span-1 p-6 text-white"
        style={{ backgroundColor: resumeInfo?.themeColor }}
      >
        <PersonalDetailPreview resumeInfo={resumeInfo} />
        <SkillsPreview resumeInfo={resumeInfo} />
      </div>

      {/* Main Content */}
      <div className="col-span-2 p-8">
        <SummaryPreview resumeInfo={resumeInfo} />
        {resumeInfo?.experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
        {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
        {resumeInfo?.projects?.length > 0 && <ProjectPreview resumeInfo={resumeInfo} />}
      </div>
    </div>
  );
}

export default Template2;
