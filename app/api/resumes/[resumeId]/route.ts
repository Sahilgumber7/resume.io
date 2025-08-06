import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db'
import Resume from '@/models/resume'

// Utility to extract resumeId from URL
function extractResumeId(req: NextRequest) {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1]
}

// GET /api/resumes/:resumeId
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const resumeId = extractResumeId(req)

    const resume = await Resume.findOne({ _id: resumeId, userClerkId: userId })
    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}

// DELETE /api/resumes/:resumeId
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const resumeId = extractResumeId(req)

    const deleted = await Resume.findOneAndDelete({ _id: resumeId, userClerkId: userId })
    if (!deleted) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 })
  }
}

// PUT /api/resumes/:resumeId
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    await connectDB()
    const resumeId = extractResumeId(req)

    const updated = await Resume.findOneAndUpdate(
      { _id: resumeId, userClerkId: userId },
      { ...data },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 })
  }
}

// PATCH /api/resumes/:resumeId
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    await connectDB()
    const resumeId = extractResumeId(req)

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userClerkId: userId },
      { $set: body },
      { new: true }
    )

    if (!updatedResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json(updatedResume)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 })
  }
}
