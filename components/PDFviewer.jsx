'use client'

export default function PdfViewer({ fileUrl }) {
  return (
    <iframe
      src={`/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}`}
      width="100%"
      height="800px"
      style={{ border: "none" }}
    />
  )
}
