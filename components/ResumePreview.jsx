import { ResumeInfoContext } from '@/components/ResumeInfoContext'
import React, { useContext } from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummaryPreview from './preview/SummaryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationalPreview from './preview/EducationalPreview'
import SkillsPreview from './preview/SkillsPreview'
import ProjectPreview from './preview/ProjectPreview'

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext)

  if (!resumeInfo) return null // Or show a loading state

  return (
    <div
      className='shadow-lg h-full p-14 border-t-[20px]'
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
  )
}

export default ResumePreview
