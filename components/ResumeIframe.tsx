'use client'

import { useMemo } from "react"
import Frame from "react-frame-component"
import dynamic from "next/dynamic"
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  A4_WIDTH_PT,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
  LETTER_WIDTH_PT,
} from "@/lib/constants"

const getIframeInitialContent = (isA4: boolean) => {
  const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT

  return `<!DOCTYPE html>
<html>
  <head>
    <style>
      html, body {
        margin: 0;
        padding: 0;
        width: ${width}pt;
        overflow: hidden;
        font-family: sans-serif;
        -webkit-text-size-adjust: none;
        background-color: white;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
}

const ResumeIframe = ({
  documentSize,
  scale,
  children,
  enablePDFViewer = false,
  autoScale = false,
}: {
  documentSize: string
  scale: number
  children: React.ReactNode
  enablePDFViewer?: boolean
  autoScale?: boolean
}) => {
  const isA4 = documentSize === "A4"
  const iframeInitialContent = useMemo(() => getIframeInitialContent(isA4), [isA4])
  const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX
  const height = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX
  const appliedScale = autoScale ? 0.53 : scale

  if (enablePDFViewer) {
    return (
      <DynamicPDFViewer className="h-full w-full">
        {children as any}
      </DynamicPDFViewer>
    )
  }

  return (
    <div
      className="overflow-hidden"
      style={{
        width: `${width * appliedScale}px`,
        height: `${height * appliedScale}px`,
        maxWidth: "100%",
        margin: "0 auto",
      }}
    >
      <div
        className="origin-top-left"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${appliedScale})`,
          transformOrigin: "top left",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <Frame
          style={{ width: "100%", height: "100%", border: "none", backgroundColor: "gray" }}
          initialContent={iframeInitialContent}
          mountTarget="#root"
          key={isA4 ? "A4" : "LETTER"}
        >
          {children}
        </Frame>
      </div>
    </div>
  )
}

export const ResumeIframeCSR = dynamic(() => Promise.resolve(ResumeIframe), {
  ssr: false,
})

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false }
)
