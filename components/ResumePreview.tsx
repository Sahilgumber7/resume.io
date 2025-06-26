'use client'

import { useState } from "react"
import { ResumeData } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Download } from "lucide-react"
import { ResumeIframeCSR } from "./ResumeIframe"
import ResumeDocument from "./ResumeDocument"

export default function ResumePreview({ resumeData }: { resumeData: ResumeData }) {
  const [scale, setScale] = useState(0.53)
  const [autoScale, setAutoScale] = useState(true)

  const handleZoomChange = (value: number[]) => {
    setScale(value[0] / 100)
    setAutoScale(false)
  }

  const handleAutoScaleToggle = (checked: boolean) => {
    setAutoScale(checked)
  }

  return (
    <div className="w-full h-full flex flex-col bg-white border shadow-md rounded-md overflow-hidden">
      
      {/* Top Black Bar */}
      <div className="bg-black h-2 w-full" />

      {/* Resume Preview Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-white">
        <div className="bg-white">
          <ResumeIframeCSR
            documentSize={resumeData.settings.documentSize}
            scale={scale}
            autoScale={autoScale}
          >
            <ResumeDocument resumeData={resumeData} />
          </ResumeIframeCSR>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted">
        
        {/* Zoom Slider */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Zoom</span>
          <Slider
            defaultValue={[53]}
            value={[scale * 100]}
            onValueChange={handleZoomChange}
            max={200}
            min={50}
            step={1}
            className="w-[100px]"
          />
          <span className="text-sm text-muted-foreground">{(scale * 100).toFixed(0)}%</span>
        </div>

        {/* Autoscale Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox id="autoscale" checked={autoScale} onCheckedChange={handleAutoScaleToggle} />
          <label htmlFor="autoscale" className="text-sm">Autoscale</label>
        </div>

        {/* Download Button */}
        <Button variant="default">
          <Download className="w-4 h-4 mr-2" />
          Download Resume
        </Button>
      </div>
    </div>
  )
}
