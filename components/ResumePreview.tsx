'use client'

import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ResumeData } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Download } from 'lucide-react'
import { ResumeIframeCSR } from './ResumeIframe'
import ResumeDocument from './ResumeDocument'

export default function ResumePreview({ resumeData }: { resumeData: ResumeData }) {
  const [scale, setScale] = useState(0.53)
  const [autoScale, setAutoScale] = useState(true)

  const printRef = useRef<HTMLDivElement>(null)

  const handleZoomChange = (value: number[]) => {
    setScale(value[0] / 100)
    setAutoScale(false)
  }

  const handleAutoScaleToggle = (checked: boolean) => {
    setAutoScale(!!checked)
  }

  const handleDownload = async () => {
    const element = printRef.current
    if (!element) {
      console.error("No printable element found.")
      alert("Printable content not found.")
      return
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const imgWidth = canvas.width
      const imgHeight = canvas.height

      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight)
      const finalWidth = imgWidth * ratio
      const finalHeight = imgHeight * ratio

      pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight)
      pdf.save(`${resumeData.name || 'resume'}.pdf`)
    } catch (error) {
      console.error("PDF generation error:", error)
      alert("Failed to download PDF.")
    }
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-gray-300 dark:bg-background">
        <div className="bg-white shadow-xl rounded-md overflow-hidden">
          <ResumeIframeCSR
            documentSize={resumeData.settings.documentSize}
            scale={scale}
            autoScale={autoScale}
            iframeId="resume-iframe"
          >
            <ResumeDocument resumeData={resumeData} />
          </ResumeIframeCSR>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-muted dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-muted-foreground">Zoom</span>
          <Slider
            value={[scale * 100]}
            onValueChange={handleZoomChange}
            min={50}
            max={200}
            step={1}
            className="w-[100px]"
          />
          <span className="text-sm text-muted-foreground">{(scale * 100).toFixed(0)}%</span>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="autoscale" checked={autoScale} onCheckedChange={handleAutoScaleToggle} />
          <label htmlFor="autoscale" className="text-sm text-muted-foreground">Autoscale</label>
        </div>

        <Button onClick={handleDownload} variant="default">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Hidden printable version */}
      <div style={{ position: 'absolute', left: '-10000px', top: 0 }}>
        <div
          ref={printRef}
          style={{
            width: '794px', // A4 width
            padding: '48px',
            backgroundColor: 'white',
          }}
        >
          <ResumeDocument resumeData={resumeData} />
        </div>
      </div>
    </div>
  )
}
