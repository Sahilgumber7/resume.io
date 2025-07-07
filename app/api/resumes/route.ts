// app/api/resumes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/db';
import Resume from '@/models/resume';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const resumes = await Resume.find({ userClerkId: userId }).sort({ updatedAt: -1 });

  return NextResponse.json(resumes);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  await connectDB();

  const newResume = await Resume.create({
    userClerkId: userId,
    title: body.title || 'Untitled Resume',
    content: body.content || {},
  });

  return NextResponse.json(newResume);
}
