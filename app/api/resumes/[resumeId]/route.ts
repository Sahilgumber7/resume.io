<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Resume from '@/models/resume';
import { connectDB } from '@/lib/db';

// GET: /api/resumes/:id
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Await params before using its properties
    const { id } = await context.params;

    await connectDB();
    const resume = await Resume.findById(id);

    if (!resume || resume.userClerkId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT: /api/resumes/:id
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before using its properties
    const { id } = await context.params;

    await connectDB();
    const resume = await Resume.findById(id);

    if (!resume || resume.userClerkId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const body = await req.json();
    Object.assign(resume, body);
    await resume.save();

    return NextResponse.json(resume);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE: /api/resumes/:id
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Await params before using its properties
    const { id } = await context.params;

    await connectDB();
    const resume = await Resume.findById(id);

    if (!resume || resume.userClerkId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await resume.deleteOne();
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
=======
// app/api/resumes/[resumeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectDB } from '@/lib/db'
import Resume from '@/models/resume'

// GET /api/resumes/:resumeId - Get a specific resume
export async function GET(
  req: NextRequest,
  context: { params: { resumeId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // The params object must be awaited before accessing its properties.
    const { resumeId } = await context.params

    const resume = await Resume.findOne({
      _id: resumeId,
      userClerkId: userId
    })

    if (!resume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json(resume)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 })
  }
}

// PUT /api/resumes/:resumeId - Replace the resume
export async function PUT(
  req: NextRequest,
  context: { params: { resumeId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data } = await req.json()
    await connectDB()

    // The params object must be awaited before accessing its properties.
    const { resumeId } = await context.params

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
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 })
  }
}

// PATCH /api/resumes/:resumeId - Partially update resume
export async function PATCH(
  req: NextRequest,
  context: { params: { resumeId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data } = await req.json()
    await connectDB()

    // The params object must be awaited before accessing its properties.
    const { resumeId } = await context.params

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userClerkId: userId },
      { $set: data },
      { new: true }
    )

    if (!updatedResume) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json(updatedResume)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 })
  }
}

// DELETE /api/resumes/:resumeId - Delete resume
export async function DELETE(
  req: NextRequest,
  context: { params: { resumeId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // The params object must be awaited before accessing its properties.
    const { resumeId } = await context.params

    const deleted = await Resume.findOneAndDelete({
      _id: resumeId,
      userClerkId: userId
    })

    if (!deleted) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 })
  }
}
>>>>>>> old-version
