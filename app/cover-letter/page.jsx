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

export default function CoverLetterPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      setError("Resume text and job description are required.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const form = new FormData();
      form.append("resume_text", resumeText);
      form.append("job_desc", jobDesc);
      form.append("company_name", companyName);
      form.append("hiring_manager", hiringManager);
      form.append("tone", tone);
      form.append("temperature", "0.45");

      const res = await fetch("/api/cover-letter", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.detail || "Failed to generate cover letter");
      setResult(data?.cover_letter || "");
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
          className="mx-auto w-full max-w-6xl rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <h1 className="text-3xl font-bold tracking-tight">AI Cover Letter Generator</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate a tailored cover letter from your resume and target job description.
          </p>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Resume Text</label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume text..."
                className="h-72 w-full resize-none rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Job Description</label>
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the target job description..."
                className="h-72 w-full resize-none rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Company</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc"
                className="w-full rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Hiring Manager</label>
              <input
                type="text"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="Hiring Manager Name"
                className="w-full rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="professional">Professional</option>
                <option value="confident">Confident</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="concise">Concise</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button size="lg" onClick={handleGenerate} disabled={loading || !resumeText.trim() || !jobDesc.trim()} className="w-full">
                {loading ? "Generating..." : "Generate Letter"}
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          {result && (
            <div className="mt-8 rounded-xl border bg-primary/5 p-4">
              <h2 className="text-sm font-semibold">Generated Cover Letter</h2>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{result}</pre>
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
}
