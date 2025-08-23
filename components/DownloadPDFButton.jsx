"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "./ResumePDF";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ResumeInfoContext } from '@/components/ResumeInfoContext'


export default function DownloadPDFButton() {
      const { resumeInfo } = useContext(ResumeInfoContext)
    
  if (!resumeInfo) {
    return <Button disabled>Loading...</Button>;
  }

  return (
    <PDFDownloadLink
      document={<ResumePDF resumeInfo={resumeInfo} />}
      fileName={`${resumeInfo.fullName || "resume"}.pdf`}
    >
      {({ loading }) => (
        <Button>{loading ? "Generating PDF..." : "Download PDF"}</Button>
      )}
    </PDFDownloadLink>
  );
}
