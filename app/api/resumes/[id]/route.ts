// app/api/resumes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Resume from '@/models/resume';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const resume = await Resume.findById(params.id);

  if (!resume || resume.userClerkId !== userId) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
  }

  return NextResponse.json(resume);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  await connectDB();

  const resume = await Resume.findById(params.id);
  if (!resume || resume.userClerkId !== userId) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
  }

  resume.title = body.title || resume.title;
  resume.content = body.content || resume.content;
  resume.updatedAt = new Date();
  await resume.save();

  return NextResponse.json({ message: 'Updated', resume });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const resume = await Resume.findById(params.id);

  if (!resume || resume.userClerkId !== userId) {
    return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
  }

  await resume.deleteOne();
  return NextResponse.json({ message: 'Deleted successfully' });
}
