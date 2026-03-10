import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { connectDB } from "@/lib/db";
import {
  importFromGitHub,
  mergeImportedSection,
  parseLinkedInPayload,
} from "@/lib/profile-import";
import User from "@/models/user";

type ImportRequestBody = {
  source: "linkedin" | "github";
  linkedInRaw?: string;
  linkedInUrl?: string;
  githubUsername?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as ImportRequestBody;
    if (!body?.source || !["linkedin", "github"].includes(body.source)) {
      return NextResponse.json({ error: "Invalid source" }, { status: 400 });
    }
    if (body.source === "linkedin" && !body.linkedInRaw?.trim()) {
      return NextResponse.json(
        { error: "LinkedIn extractor needs pasted profile text/JSON. URL-only import is not supported." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json(
        { error: "User profile not found. Sign in again and retry." },
        { status: 404 }
      );
    }

    const existingProfile = user.profileData || {
      experience: [],
      education: [],
      projects: [],
    };

    const imported =
      body.source === "linkedin"
        ? parseLinkedInPayload({
            linkedInRaw: body.linkedInRaw,
            linkedInUrl: body.linkedInUrl,
          })
        : await importFromGitHub(body.githubUsername || "");

    const importedCounts = {
      experience: imported.experience.length,
      education: imported.education.length,
      projects: imported.projects.length,
    };
    const totalImported =
      importedCounts.experience + importedCounts.education + importedCounts.projects;
    if (totalImported === 0) {
      return NextResponse.json(
        {
          error:
            body.source === "github"
              ? "No public data found to import from GitHub for this user."
              : "No structured items could be extracted from the provided LinkedIn data.",
        },
        { status: 400 }
      );
    }

    const nextProfileData = {
      linkedInUrl: imported.linkedInUrl || existingProfile.linkedInUrl || "",
      githubUsername: imported.githubUsername || existingProfile.githubUsername || "",
      importedAt: new Date(),
      experience: mergeImportedSection(
        existingProfile.experience || [],
        imported.experience || [],
        (item) => `${item.title || ""}|${item.companyName || ""}|${item.startDate || ""}`
      ),
      education: mergeImportedSection(
        existingProfile.education || [],
        imported.education || [],
        (item) => `${item.universityName || ""}|${item.degree || ""}|${item.startDate || ""}`
      ),
      projects: mergeImportedSection(
        existingProfile.projects || [],
        imported.projects || [],
        (item) => `${item.title || ""}`
      ),
    };

    user.profileData = nextProfileData;
    await user.save();

    return NextResponse.json({
      message: "Profile data imported successfully",
      source: body.source,
      profileData: nextProfileData,
      importedCounts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed";
    console.error("[Profile][Import] error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
