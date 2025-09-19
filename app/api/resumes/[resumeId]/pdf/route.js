import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Resume from '@/models/resume'
import { renderToBuffer } from '@react-pdf/renderer'
import ResumePDF from '../../../../../components/ResumePDF'
// GET /api/resumes/:resumeId/pdf
export async function GET(req, { params }) {
  try {
    await connectDB()

    const { resumeId } = params
    if (!resumeId) {
      return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 })
    }

    const resume = await Resume.findById(resumeId)
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }
    const pdfBuffer = await renderToBuffer(
      <ResumePDF resume={resume} />
    )

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="resume-${resumeId}.pdf"`,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
