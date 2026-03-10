import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { connectDB } from "@/lib/db";
import User from "@/models/user";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const profileData = user.profileData || {};
    return NextResponse.json({
      linkedInUrl: profileData.linkedInUrl || "",
      githubUsername: profileData.githubUsername || "",
      importedAt: profileData.importedAt || null,
      experience: Array.isArray(profileData.experience) ? profileData.experience : [],
      education: Array.isArray(profileData.education) ? profileData.education : [],
      projects: Array.isArray(profileData.projects) ? profileData.projects : [],
    });
  } catch (error) {
    console.error("[Profile][GET] error:", error);
    return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 });
  }
}

type ProfilePatchBody = {
  linkedInUrl?: string;
  githubUsername?: string;
  experience?: Array<Record<string, unknown>>;
  education?: Array<Record<string, unknown>>;
  projects?: Array<Record<string, unknown>>;
};

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as ProfilePatchBody;

    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    user.profileData = {
      linkedInUrl:
        typeof body.linkedInUrl === "string"
          ? body.linkedInUrl.trim()
          : user.profileData?.linkedInUrl || "",
      githubUsername:
        typeof body.githubUsername === "string"
          ? body.githubUsername.trim()
          : user.profileData?.githubUsername || "",
      importedAt: new Date(),
      experience: Array.isArray(body.experience)
        ? body.experience
        : user.profileData?.experience || [],
      education: Array.isArray(body.education)
        ? body.education
        : user.profileData?.education || [],
      projects: Array.isArray(body.projects)
        ? body.projects
        : user.profileData?.projects || [],
    };

    await user.save();

    return NextResponse.json({
      message: "Profile data updated",
      profileData: user.profileData,
    });
  } catch (error) {
    console.error("[Profile][PATCH] error:", error);
    return NextResponse.json({ error: "Failed to update profile data" }, { status: 500 });
  }
}
