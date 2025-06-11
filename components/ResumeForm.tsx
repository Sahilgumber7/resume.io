import { ResumeData } from "@/types/resume"
import { Dispatch, SetStateAction } from "react"

// Section Components
import BasicInfo from "./resume-form/BasicInfo"
import Objective from "./resume-form/Objective"
import ExperienceSection from "./resume-form/ExperienceSection"
import EducationSection from "./resume-form/EducationSection"
import ProjectsSection from "./resume-form/ProjectsSection"
import SkillsSection from "./resume-form/SkillsSection"
import FeaturedSkillsSection from "./resume-form/FeaturedSkillsSection"
import CustomSection from "./resume-form/CustomSection"
import SettingsSection from "./resume-form/SettingsSection"

interface Props {
  resumeData: ResumeData
  setResumeData: Dispatch<SetStateAction<ResumeData>>
}

export default function ResumeForm({ resumeData, setResumeData }: Props) {
  const handleChange = (field: keyof ResumeData, value: any) => {
    setResumeData({ ...resumeData, [field]: value })
  }

  return (
    <div className="space-y-8">
      <BasicInfo resumeData={resumeData} handleChange={handleChange} />
      <Objective resumeData={resumeData} handleChange={handleChange} />
      <ExperienceSection resumeData={resumeData} setResumeData={setResumeData} handleChange={handleChange} />
      <EducationSection resumeData={resumeData} setResumeData={setResumeData} handleChange={handleChange} />
      <ProjectsSection resumeData={resumeData} setResumeData={setResumeData} handleChange={handleChange} />
      <SkillsSection resumeData={resumeData} handleChange={handleChange} />
      <FeaturedSkillsSection resumeData={resumeData} handleChange={handleChange} />
      <CustomSection resumeData={resumeData} handleChange={handleChange} />
      <SettingsSection resumeData={resumeData} handleChange={handleChange} />
    </div>
  )
}
