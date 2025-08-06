// app/api/resumes/[resumeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db'
import Resume from '@/models/resume'

// GET /api/resumes/:resumeId - Get a specific resume
export async function GET(
  _req: NextRequest, // The request object is the first argument
  { params }: { params: { resumeId: string } } // Correct destructuring for dynamic params
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { resumeId } = params // Access the destructured params

    const resume = await Resume.findOne({
      _id: resumeId,
      userClerkId: userId,
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}

// DELETE /api/resumes/:resumeId - Delete resume
export async function DELETE(
  _req: NextRequest, // The request object is the first argument
  { params }: { params: { resumeId: string } } // Correct destructuring for dynamic params
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { resumeId } = params // Access the destructured params

    const deleted = await Resume.findOneAndDelete({
      _id: resumeId,
      userClerkId: userId,
    })

    if (!deleted) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 })
  }
}


// PUT /api/resumes/:resumeId - Replace the resume
export async function PUT(
  req: NextRequest,
  { params }: { params: { resumeId: string } } // Correct destructuring for dynamic params
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    await connectDB()

    const { resumeId } = params // Access the destructured params

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

// PATCH /api/resumes/:resumesId - Partially update resume
export async function PATCH(
  req: NextRequest,
  { params }: { params: { resumeId: string } } // Correct destructuring for dynamic params
) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    await connectDB()

    const { resumeId } = params // Access the destructured params

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