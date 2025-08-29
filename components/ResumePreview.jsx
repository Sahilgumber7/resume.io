// src/components/ResumePreview.js
import React, { useContext } from "react";
import { ResumeInfoContext } from "@/components/ResumeInfoContext";
import { templates } from "./template";

function ResumePreview({ selectedTemplate = "template1" }) {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) return null;

  const SelectedTemplate = templates[selectedTemplate] || templates.template1;

  return <SelectedTemplate resumeInfo={resumeInfo} />;
}

export default ResumePreview;
