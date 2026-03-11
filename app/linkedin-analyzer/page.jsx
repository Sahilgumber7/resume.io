"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import Lnavbar from "@/components/Lnavbar";
import FloatingSidebar from "@/components/dashboard/FloatingSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cleanInlineMarkdown = (line) => line.replace(/\*\*(.*?)\*\*/g, "$1").trim();

const parseAnalysisSections = (analysisText) => {
  if (!analysisText || typeof analysisText !== "string") return [];

  const lines = analysisText
    .split("\n")
    .map((line) => line.replace(/\r/g, ""))
    .map((line) => line.trim());

  const sections = [];
  let current = null;

  const pushCurrent = () => {
    if (current && current.lines.length) sections.push(current);
  };

  for (const rawLine of lines) {
    if (!rawLine) continue;

    const markdownHeading = rawLine.match(/^\*\*(.+?)\*\*:?\s*$/);
    const numberedHeading = rawLine.match(/^\d+\.\s+\*\*(.+?)\*\*:?\s*$/);
    const heading = markdownHeading?.[1] || numberedHeading?.[1];

    if (heading) {
      pushCurrent();
      current = { title: cleanInlineMarkdown(heading), lines: [] };
      continue;
    }

    if (!current) current = { title: "Overview", lines: [] };
    current.lines.push(cleanInlineMarkdown(rawLine));
  }

  pushCurrent();
  return sections;
};

const renderSectionLine = (line, idx) => {
  if (line.startsWith("- ")) {
    return (
      <p key={`bullet-${idx}`} className="text-sm leading-relaxed text-foreground/90">
        {"\u2022"} {line.slice(2)}
      </p>
    );
  }

  const numbered = line.match(/^(\d+)\.\s+(.*)$/);
  if (numbered) {
    return (
      <p key={`num-${idx}`} className="text-sm leading-relaxed text-foreground/90">
        <span className="font-semibold">{numbered[1]}.</span> {numbered[2]}
      </p>
    );
  }

  return (
    <p key={`text-${idx}`} className="text-sm leading-relaxed text-muted-foreground">
      {line}
    </p>
  );
};

const clampPercent = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
};

const extractProfileStrengthScore = (analysisText) => {
  if (!analysisText || typeof analysisText !== "string") return null;
  const match = analysisText.match(/profile strength score\s*[:\-]?\s*(\d{1,3})\s*\/\s*100/i);
  if (!match) return null;
  return clampPercent(match[1]);
};

const ScoreCard = ({ label, value }) => (
  <article className="surface-card w-full p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-semibold">{value}%</p>
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  </article>
);

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

  const resetAnalysis = () => {
    setResult(null);
    setError("");
  };

  const profileStrength = extractProfileStrengthScore(result?.ai_analysis);
  const scoreCards = [
    { label: "Profile Strength", value: profileStrength ?? 0 },
    { label: "ATS Match", value: clampPercent(result?.keyword_alignment?.ats_score) },
    { label: "Keyword Match", value: clampPercent(result?.keyword_alignment?.keyword_match_percent) },
    { label: "Semantic Similarity", value: clampPercent(result?.keyword_alignment?.semantic_similarity_percent) },
    { label: "Section Coverage", value: clampPercent(result?.keyword_alignment?.section_coverage_percent) },
  ];

  return (
    <>
      <Lnavbar />
      <FloatingSidebar />
      <main className="min-h-screen bg-background text-foreground">
      <section className="px-4 py-6 md:pl-24 sm:px-6 sm:py-8 lg:px-10">
        <motion.div
          className="mx-auto w-full max-w-7xl"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <section className="surface-panel p-6 sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight">LinkedIn Analyzer</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Evaluate your LinkedIn profile for recruiter search fit and role alignment.
            </p>

            {!result ? (
              <div className="mt-6 surface-card p-5">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">LinkedIn URL (optional)</label>
                    <Input
                      type="url"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                      placeholder="https://www.linkedin.com/in/your-profile"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">LinkedIn Profile Content</label>
                    <Textarea
                      value={profileText}
                      onChange={(e) => setProfileText(e.target.value)}
                      placeholder="Paste your LinkedIn headline, about, experience, skills, and achievements..."
                      className="min-h-52"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">LinkedIn Export File (PDF/DOCX)</label>
                    <Input
                      type="file"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                    />
                    {profileFile && (
                      <p className="mt-1 text-xs text-muted-foreground">Selected: {profileFile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">Target Job Description (optional)</label>
                    <Textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="Paste a job description to compare keyword alignment..."
                      className="min-h-40"
                    />
                  </div>

                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    disabled={loading || (!profileText.trim() && !profileFile)}
                    className="w-full"
                  >
                    {loading ? "Analyzing..." : "Analyze LinkedIn Profile"}
                  </Button>

                  {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <section className="surface-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Analyzed Source</p>
                      <p className="text-sm text-muted-foreground">
                        {profileFile ? `PDF/DOCX: ${profileFile.name}` : "Pasted LinkedIn profile content"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        URL: {result.profile_url || profileUrl || "Not provided"}
                      </p>
                    </div>
                    <Button variant="outline" onClick={resetAnalysis}>Start New Analysis</Button>
                  </div>
                </section>

                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {scoreCards.map((score) => (
                    <ScoreCard key={score.label} label={score.label} value={score.value} />
                  ))}
                </section>

                {result.keyword_alignment?.error && (
                  <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    Keyword alignment graph data unavailable: {result.keyword_alignment.error}
                  </div>
                )}

                {result.ai_analysis && (
                  <section className="rounded-2xl border bg-primary/5 p-4">
                    <h2 className="text-base font-semibold">AI LinkedIn Recommendations</h2>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {parseAnalysisSections(result.ai_analysis).map((section, index) => (
                        <article key={`${section.title}-${index}`} className="rounded-xl border bg-background p-4">
                          <h3 className="text-sm font-semibold">{section.title}</h3>
                          <div className="mt-2 space-y-2">
                            {section.lines.map((line, lineIndex) => renderSectionLine(line, lineIndex))}
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </section>
        </motion.div>
      </section>
      </main>
    </>
  );
}
