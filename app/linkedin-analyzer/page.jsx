"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Lnavbar from "@/components/Lnavbar";
import FloatingSidebar from "@/components/dashboard/FloatingSidebar";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function LinkedInAnalyzerPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [profileText, setProfileText] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!profileText.trim() && !profileFile) {
      setError("Paste LinkedIn profile content or upload a LinkedIn PDF/DOCX export.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const form = new FormData();
      form.append("profile_url", profileUrl);
      form.append("profile_text", profileText);
      if (profileFile) form.append("profile_file", profileFile);
      form.append("job_desc", jobDesc);
      form.append("temperature", "0.35");

      const res = await fetch("/api/linkedin-analyze", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.detail || "Failed to analyze LinkedIn profile");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Lnavbar />
      <FloatingSidebar />
      <section className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-muted/40 px-4 py-8 md:pl-24 sm:px-6 lg:px-10">
        <motion.div
          className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <h1 className="text-3xl font-bold tracking-tight">LinkedIn Analyzer</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Evaluate your LinkedIn profile for recruiter search fit and role alignment.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">LinkedIn URL (optional)</label>
              <input
                type="url"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-profile"
                className="w-full rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">LinkedIn Profile Content</label>
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your LinkedIn headline, about, experience, skills, and achievements..."
                className="h-52 w-full resize-none rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">LinkedIn Export File (PDF/DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {profileFile && (
                <p className="mt-1 text-xs text-muted-foreground">Selected: {profileFile.name}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Target Job Description (optional)</label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste a job description to compare keyword alignment..."
                className="h-40 w-full resize-none rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <Button size="lg" onClick={handleAnalyze} disabled={loading || (!profileText.trim() && !profileFile)} className="w-full">
              {loading ? "Analyzing..." : "Analyze LinkedIn Profile"}
            </Button>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}
          </div>

          {result && (
            <div className="mt-8 space-y-4">
              {result.keyword_alignment && !result.keyword_alignment.error && (
                <div className="rounded-xl border p-4 text-sm">
                  <h2 className="font-semibold">Keyword Alignment</h2>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <p><span className="font-semibold">ATS-Style Match:</span> {result.keyword_alignment.ats_score ?? 0}%</p>
                    <p><span className="font-semibold">Keyword Match:</span> {result.keyword_alignment.keyword_match_percent ?? 0}%</p>
                    <p><span className="font-semibold">Semantic Similarity:</span> {result.keyword_alignment.semantic_similarity_percent ?? 0}%</p>
                    <p><span className="font-semibold">Section Coverage:</span> {result.keyword_alignment.section_coverage_percent ?? 0}%</p>
                  </div>
                </div>
              )}

              {result.ai_analysis && (
                <div className="rounded-xl border bg-primary/5 p-4">
                  <h2 className="text-sm font-semibold">AI LinkedIn Recommendations</h2>
                  <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{result.ai_analysis}</pre>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
}
