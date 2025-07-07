import { auth, clerkClient } from "@clerk/nextjs/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import ResumeCard from "@/components/ResumeCard";
import { ResumeData } from "@/types/resume";

type ResumeResponse = {
  _id: string;
  title: string;
  updatedAt: string;
  content: ResumeData;
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.userId;
  if (!userId) {
    return <div className="p-6 text-muted-foreground">Please sign in to continue.</div>;
  }

  // ✅ Get user's first name from Clerk
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const firstName = user.firstName || "User";

  // ✅ Fetch resumes (relative path keeps cookies working)
  const res = await fetch("/api/resumes", {
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch resumes:", await res.text());
    return (
      <div className="p-6 text-red-500">
        Something went wrong while loading your resumes.
      </div>
    );
  }

  const resumes: ResumeResponse[] = await res.json();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
        <p className="text-muted-foreground">Build and manage your resumes easily.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Create New Resume Card */}
        <Link href="/builder/new">
          <div className="border border-dashed border-gray-300 rounded-2xl h-52 flex items-center justify-center hover:bg-muted/50 transition cursor-pointer">
            <div className="flex flex-col items-center text-muted-foreground">
              <Plus className="w-6 h-6 mb-2" />
              <span className="text-sm">Create New Resume</span>
            </div>
          </div>
        </Link>

        {/* Existing Resume Cards */}
        {resumes.length === 0 ? (
          <div className="col-span-full text-muted-foreground text-sm italic">
            You don’t have any resumes yet.
          </div>
        ) : (
          resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              title={resume.title || "Untitled Resume"}
              updatedAt={new Date(resume.updatedAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              href={`/builder/${resume._id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
