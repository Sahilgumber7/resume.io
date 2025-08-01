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