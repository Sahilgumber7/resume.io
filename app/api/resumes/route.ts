// app/api/resumes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Resume from '@/models/resume';
import { connectDB } from '@/lib/db';

// GET /api/resumes - Get all resumes for the current user (signed in only)
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to view your resumes' },
        { status: 401 }
      );
    }

    await connectDB();
    const resumes = await Resume.find({ userClerkId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(resumes);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}

// POST /api/resumes - Create a new resume (guests allowed)
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    await connectDB();

    const newResume = await Resume.create({
      ...body,
      userClerkId: userId || null, // store null if guest, claim later after login
    });

    return NextResponse.json(newResume, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
