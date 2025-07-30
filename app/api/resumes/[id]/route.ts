// app/api/resumes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Resume from '@/models/resume';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();

    const resume = await Resume.findById(params.id);
    if (!resume || resume.userClerkId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const data = await req.json();
    await connectDB();

    const resume = await Resume.findById(params.id);
    if (!resume || resume.userClerkId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    // Update only basic fields like title, content, education, experience, etc.
    resume.title = data.title || resume.title;
    resume.content = data.content || resume.content;
    resume.education = data.education || resume.education;
    resume.experience = data.experience || resume.experience;
    resume.skills = data.skills || resume.skills;
    resume.projects = data.projects || resume.projects;
    resume.certifications = data.certifications || resume.certifications;
    resume.updatedAt = new Date();

    await resume.save();

    return NextResponse.json({ message: 'Updated', resume });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const resume = await Resume.findById(params.id);

    if (!resume || resume.userClerkId !== userId) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await resume.deleteOne();
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
