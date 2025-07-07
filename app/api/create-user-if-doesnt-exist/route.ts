
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User, { IUser } from '@/models/user';

interface RequestBody {
  clerkId: string;
  email: string;
  name?: string;
  imageUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { clerkId, email, name, imageUrl } = body;

    if (!clerkId || !email) {
      return NextResponse.json({ error: 'Missing clerkId or email' }, { status: 400 });
    }

    await connectDB();

    const existingUser: IUser | null = await User.findOne({ clerkId });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 200 });
    }

    await User.create({ clerkId, email, name, imageUrl });

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error) {
    console.error('[CreateUser] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
 