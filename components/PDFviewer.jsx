import React from "react";

export default function ResumePDFViewer({ pdfUrl }) {
  return (
    <iframe
      src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`}
      width="100%"
      height="800"
      style={{ border: "none" }}
      title="Resume PDF Preview"
    />
  );
}
