// src/components/ResumePreview.js
import React, { useContext } from "react";
import { ResumeInfoContext } from "@/components/ResumeInfoContext";
import { DEFAULT_TEMPLATE_ID, templates } from "./template";

function ResumePreview({ selectedTemplate = DEFAULT_TEMPLATE_ID }) {
  const { resumeInfo } = useContext(ResumeInfoContext);

  if (!resumeInfo) return null;

  const SelectedTemplate = templates[selectedTemplate] || templates[DEFAULT_TEMPLATE_ID];

  return <SelectedTemplate resumeInfo={resumeInfo} />;
}

export default ResumePreview;
