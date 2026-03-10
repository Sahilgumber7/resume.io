"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { FileText, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import Lnavbar from "@/components/Lnavbar";
import FloatingSidebar from "@/components/dashboard/FloatingSidebar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function ResumePreviewPanel({ file }) {
  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const isPdf = file?.type === "application/pdf";

  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm lg:sticky lg:top-24">
      <p className="text-sm font-medium text-muted-foreground">Resume Preview</p>
      <p className="mt-1 truncate text-sm font-semibold">{file?.name || "No file selected"}</p>

      <div className="mt-4 flex h-[70vh] min-h-[400px] items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
        {!file && (
          <div className="px-4 text-center text-sm text-muted-foreground">
            Upload a PDF or DOCX file to preview it here.
          </div>
        )}

        {file && isPdf && (
          <iframe
            src={previewUrl}
            title="Resume preview"
            className="h-full w-full bg-white"
          />
        )}

        {file && !isPdf && (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <FileText className="h-12 w-12 text-primary" />
            <p className="text-sm font-medium">DOCX preview is not available in-browser.</p>
            <p className="text-xs text-muted-foreground">
              The file will still be parsed and saved correctly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ParserPage() {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a resume file first.");
      return;
    }

    setLoading(true);
    setError("");
    setParsed(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/parser", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.detail || "Parse failed");
      setParsed(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong while parsing your resume.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndOpen = async () => {
    if (!parsed) return;

    if (!isSignedIn) {
      router.push("/auth/sign-in?redirect_url=/parser");
      return;
    }

    setSaving(true);

    try {
      const formattedResume = {
        fullName: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        title: file?.name || "Untitled Resume",
        jobTitle: parsed.jobTitle || "",
        address: parsed.location || "",
        themeColor: "#000000",
        summary: parsed.summary || "",
        education: [],
        experience: [],
        skills: [],
        projects: [],
      };

      if (parsed.sections?.education?.length) {
        const edu = parsed.sections.education;
        formattedResume.education.push({
          degree: edu[2] || "",
          universityName: edu[0] || "",
          major: edu[2] || "",
          startDate: edu[1] || "",
          endDate: "",
          description: edu.slice(4).join(" "),
        });
      }

      if (parsed.sections?.experience?.length) {
        const expArr = parsed.sections.experience;
        const chunks = [];
        let current = [];

        expArr.forEach((line) => {
          if (line.startsWith("•") && current.length) {
            chunks.push([...current]);
            current = [];
          }
          current.push(line);
        });

        if (current.length) chunks.push(current);

        formattedResume.experience = chunks.map((chunk) => ({
          title: chunk.find((l) => l.includes("Developer")) || "",
          companyName: chunk.find((l) => l.includes(".com") || l.includes("PYOP")) || "",
          city: chunk.find((l) => ["Delhi", "Bangalore", "Mumbai"].includes(l)) || "",
          state: "",
          startDate: chunk.find((l) => l.includes("–"))?.split("–")[0]?.trim() || "",
          endDate: chunk.find((l) => l.includes("–"))?.split("–")[1]?.trim() || "",
          worksummary: chunk.filter((l) => l.startsWith("•")).join(" "),
        }));
      }

      if (parsed.sections?.skills?.length) {
        formattedResume.skills = parsed.sections.skills
          .filter((line) => line && !line.includes("Social"))
          .map((line) => ({ name: line, rating: 4 }));
      }

      if (parsed.sections?.projects?.length) {
        const projLines = parsed.sections.projects;
        const projects = [];
        let current = [];

        projLines.forEach((line) => {
          if (line.includes("|") && current.length) {
            projects.push([...current]);
            current = [];
          }
          current.push(line);
        });

        if (current.length) projects.push(current);

        formattedResume.projects = projects.map((proj) => ({
          title: proj[0] || "",
          description: proj.slice(1).join(" "),
        }));
      }

      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedResume),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to save resume");
      }

      const savedResume = await res.json();
      router.push(`/builder/${savedResume._id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save and open in builder.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const detectedSections = Object.entries(parsed?.sections || {});

  return (
    <>
      <Lnavbar />
      <FloatingSidebar />
      <section className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-muted/40 px-4 py-8 md:pl-24 sm:px-6 lg:px-10">
        <motion.div
          className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-2"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <ResumePreviewPanel file={file} />

          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight">Resume Parser</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload a resume, extract structured data, then open it in the builder.
            </p>

            <div className="mt-6 space-y-4">
              <label
                htmlFor="file-upload"
                className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 text-center transition hover:bg-muted/50"
              >
                <p className="font-medium">Click to upload</p>
                <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX up to 5MB</p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                    setParsed(null);
                    setError("");
                  }}
                />
              </label>

              <Button size="lg" disabled={!file || loading} onClick={handleUpload} className="w-full">
                {loading ? "Parsing..." : "Parse Resume"}
              </Button>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {parsed && !loading && (
              <div className="mt-8 space-y-6">
                <div className="grid gap-3 rounded-xl border bg-muted/20 p-4 text-sm sm:grid-cols-2">
                  <p><span className="font-semibold">Name:</span> {parsed.name || "-"}</p>
                  <p><span className="font-semibold">Email:</span> {parsed.email || "-"}</p>
                  <p><span className="font-semibold">Phone:</span> {parsed.phone || "-"}</p>
                  <p><span className="font-semibold">Location:</span> {parsed.location || "-"}</p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold">Detected Sections</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detectedSections.length === 0 && (
                      <span className="text-sm text-muted-foreground">No sections detected.</span>
                    )}
                    {detectedSections.map(([sectionName, sectionData]) => (
                      <span
                        key={sectionName}
                        className="rounded-full border bg-background px-3 py-1 text-xs font-medium"
                      >
                        {sectionName}: {Array.isArray(sectionData) ? sectionData.length : 1}
                      </span>
                    ))}
                  </div>
                </div>

                {parsed.summary && (
                  <div className="rounded-xl border p-4">
                    <h2 className="text-sm font-semibold">Summary</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{parsed.summary}</p>
                  </div>
                )}

                <details className="rounded-xl border p-4">
                  <summary className="cursor-pointer text-sm font-semibold">Raw Parsed JSON</summary>
                  <pre className="mt-3 overflow-auto rounded-lg bg-muted/30 p-3 text-xs">
                    {JSON.stringify(parsed, null, 2)}
                  </pre>
                </details>

                <Button
                  onClick={handleSaveAndOpen}
                  disabled={saving}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  {!isSignedIn && <Lock className="mr-2 h-4 w-4" />}
                  {saving ? "Saving..." : isSignedIn ? "Open in Builder" : "Sign in to Continue"}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </>
  );
}
