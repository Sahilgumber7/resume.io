"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Lnavbar from "@/components/Lnavbar";
import FloatingSidebar from "@/components/dashboard/FloatingSidebar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

function ResumeFilePreview({ file }) {
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
      <p className="mt-1 truncate text-sm font-semibold">{file?.name || "No resume selected"}</p>

      <div className="mt-4 flex h-[70vh] min-h-[400px] items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
        {!file && (
          <div className="px-4 text-center text-sm text-muted-foreground">
            Upload one or more files and choose a resume to preview.
          </div>
        )}

        {file && isPdf && (
          <iframe src={previewUrl} title="Resume preview" className="h-full w-full bg-white" />
        )}

        {file && !isPdf && (
          <div className="flex flex-col items-center gap-3 px-6 text-center">
            <FileText className="h-12 w-12 text-primary" />
            <p className="text-sm font-medium">DOCX preview is not available in-browser.</p>
            <p className="text-xs text-muted-foreground">This file can still be analyzed for ATS and AI feedback.</p>
          </div>
        )}
      </div>
    </div>
  );
}

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

const ScoreCard = ({ label, value, unavailable = false }) => (
  <article className="surface-card min-w-[210px] flex-1 p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 text-2xl font-semibold">{unavailable ? "N/A" : `${value}%`}</p>
    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  </article>
);

export default function ResumeATSTester() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFiles, setResumeFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDetailedOpen, setIsDetailedOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const selectedFile = resumeFiles[selectedFileIndex] || null;
  const selectedResult =
    analysisResults.find((result) => result.filename === selectedFile?.name) ||
    analysisResults[0] ||
    null;

  const selectedAnalysis = selectedResult?.heuristic_analysis || {};
  const hasHeuristicError = Boolean(selectedAnalysis.error);
  const detailedScoreCards = [
    { label: "ATS Score", value: clampPercent(selectedAnalysis.ats_score) },
    { label: "Semantic Similarity", value: clampPercent(selectedAnalysis.semantic_similarity_percent) },
    { label: "Keyword Match", value: clampPercent(selectedAnalysis.keyword_match_percent) },
    { label: "Section Coverage", value: clampPercent(selectedAnalysis.section_coverage_percent) },
    { label: "Action Verbs", value: clampPercent(selectedAnalysis.action_verb_percent) },
  ];

  const handleUpload = async () => {
    if (!resumeFiles.length || !jobDesc.trim()) {
      setError("Please upload at least one resume and paste a job description.");
      return;
    }

    setLoading(true);
    setAnalysisResults([]);
    setError("");

    try {
      const resultsArray = [];

      for (const resume of resumeFiles) {
        const atsFormData = new FormData();
        atsFormData.append("resume", resume);
        atsFormData.append("job_desc", jobDesc);
        atsFormData.append("use_ai", "true");

        const atsRes = await fetch("/api/ats-test", {
          method: "POST",
          body: atsFormData,
        });

        if (!atsRes.ok) {
          const atsJson = await atsRes.json().catch(() => ({}));
          throw new Error(atsJson?.error || atsJson?.detail || `ATS analysis failed for: ${resume.name}`);
        }

        const atsData = await atsRes.json();
        resultsArray.push({ ...atsData, filename: atsData.filename || resume.name });
      }

      setAnalysisResults(resultsArray);
      setIsDetailedOpen(false);
      setIsPreviewOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong while processing.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!analysisResults.length) return;

    const rows = analysisResults.map((res) => {
      const analysis = res.heuristic_analysis || {};
      const sectionsDetected = analysis.sections_detected ? JSON.stringify(analysis.sections_detected) : "";
      const matchedKeywords = Array.isArray(analysis.matched_keywords)
        ? analysis.matched_keywords.join(", ")
        : "";

      return {
        Filename: res.filename,
        ATS_Score: analysis.ats_score ?? "",
        Semantic_Similarity: analysis.semantic_similarity_percent ?? "",
        Keyword_Match_Percent: analysis.keyword_match_percent ?? "",
        Section_Coverage: analysis.section_coverage_percent ?? "",
        Matched_Keywords: matchedKeywords,
        Missing_Keywords: Array.isArray(analysis.missing_keywords) ? analysis.missing_keywords.join(", ") : "",
        Sections_Detected: sectionsDetected,
        AI_Analysis: typeof res.ai_analysis === "string" ? res.ai_analysis : JSON.stringify(res.ai_analysis || ""),
        Suggestions: Array.isArray(analysis.improvements) ? analysis.improvements.join(" | ") : "",
      };
    });

    const headers = Object.keys(rows[0]).join(",");
    const csvRows = rows.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csvContent = [headers, ...csvRows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume_analysis.csv");
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetAnalysis = () => {
    setAnalysisResults([]);
    setError("");
    setIsDetailedOpen(false);
    setIsPreviewOpen(false);
  };

  return (
    <>
      <Lnavbar />
      <FloatingSidebar />
      <section className="min-h-screen bg-background px-4 py-8 md:pl-24 sm:px-6 lg:px-10">
        <motion.div
          className="mx-auto w-full max-w-7xl"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <div className="surface-panel p-6 sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight">ATS + AI Resume Tester</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare resumes against a job description and review ATS fit with AI feedback.
            </p>

            {!analysisResults.length ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <ResumeFilePreview file={selectedFile} />

                <div className="surface-card p-5">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold">Job Description</label>
                      <Textarea
                        placeholder="Paste the target job description here..."
                        className="min-h-36"
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                      />
                    </div>

                    <label
                      htmlFor="resume-upload"
                      className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 text-center transition hover:bg-muted/50"
                    >
                      <p className="font-medium">Upload resume file(s)</p>
                      <p className="mt-1 text-sm text-muted-foreground">Multiple PDF or DOCX files, up to 5MB each</p>
                      <Input
                        id="resume-upload"
                        type="file"
                        multiple
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={(e) => {
                          if (!e.target.files) {
                            setResumeFiles([]);
                            return;
                          }
                          setResumeFiles(Array.from(e.target.files));
                          setSelectedFileIndex(0);
                          setAnalysisResults([]);
                          setError("");
                        }}
                      />
                    </label>

                    {resumeFiles.length > 0 && (
                      <div className="rounded-xl border p-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Uploaded Files
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {resumeFiles.map((resume, index) => (
                            <button
                              key={`${resume.name}-${index}`}
                              type="button"
                              onClick={() => setSelectedFileIndex(index)}
                              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                                selectedFileIndex === index ? "border-primary bg-primary/10" : "hover:bg-muted"
                              }`}
                            >
                              {resume.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button size="lg" onClick={handleUpload} disabled={loading || !resumeFiles.length || !jobDesc.trim()} className="w-full">
                      {loading ? "Analyzing..." : "Analyze Resume(s)"}
                    </Button>

                    {error && (
                      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <section className="surface-card p-5">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen((prev) => !prev)}
                        className="flex w-full items-center justify-between rounded-lg border bg-muted/20 px-4 py-3 text-left transition hover:bg-muted/35"
                      >
                        <div>
                          <p className="text-sm font-semibold">Resume Preview</p>
                          <p className="text-xs text-muted-foreground">{selectedFile?.name || "No file selected"}</p>
                        </div>
                        {isPreviewOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {isPreviewOpen && <ResumeFilePreview file={selectedFile} />}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold">Detailed Result</p>
                        <p className="mt-1 text-sm text-muted-foreground">{selectedResult?.filename || "No file selected"}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Job description length: {jobDesc.length} characters</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResults.map((result, index) => (
                          <button
                            key={`${result.filename}-${index}`}
                            type="button"
                            onClick={() => setSelectedFileIndex(index)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                              selectedResult?.filename === result.filename ? "border-primary bg-primary/10" : "hover:bg-muted"
                            }`}
                          >
                            {result.filename}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Button variant="outline" onClick={resetAnalysis} className="flex-1">Start New Analysis</Button>
                        <Button variant="outline" onClick={handleDownloadCSV} className="flex-1">Download CSV</Button>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="flex flex-wrap gap-3">
                  {detailedScoreCards.map((score) => (
                    <ScoreCard key={score.label} label={score.label} value={score.value} unavailable={hasHeuristicError} />
                  ))}
                </section>

                {selectedResult && (
                  <section className="space-y-3 rounded-xl border p-4">
                    {hasHeuristicError && (
                      <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-700">
                        ATS heuristic scoring is unavailable for this run: {selectedAnalysis.error}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDetailedOpen((prev) => !prev)}
                      className="flex w-full items-center justify-between rounded-lg border bg-muted/20 px-4 py-3 text-left transition hover:bg-muted/35"
                    >
                      <div>
                        <p className="text-sm font-semibold">Detailed ATS + AI Response</p>
                        <p className="text-xs text-muted-foreground">{selectedResult.filename}</p>
                      </div>
                      {isDetailedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isDetailedOpen && (
                      <div className="space-y-4">
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          <p><span className="font-semibold">ATS Score:</span> {selectedAnalysis.ats_score ?? "N/A"}%</p>
                          <p><span className="font-semibold">Semantic Similarity:</span> {selectedAnalysis.semantic_similarity_percent ?? "N/A"}%</p>
                          <p><span className="font-semibold">Keyword Match:</span> {selectedAnalysis.keyword_match_percent ?? 0}%</p>
                          <p><span className="font-semibold">Section Coverage:</span> {selectedAnalysis.section_coverage_percent ?? 0}%</p>
                          <p><span className="font-semibold">Action Verbs:</span> {selectedAnalysis.action_verb_percent ?? 0}%</p>
                          <p><span className="font-semibold">Length Quality:</span> {selectedAnalysis.length_score_percent ?? 0}%</p>
                          <p className="sm:col-span-2"><span className="font-semibold">Matched Keywords:</span> {selectedAnalysis.matched_keywords?.join(", ") || "-"}</p>
                          <p className="sm:col-span-2"><span className="font-semibold">Missing Keywords:</span> {selectedAnalysis.missing_keywords?.join(", ") || "-"}</p>
                        </div>

                        {Array.isArray(selectedAnalysis.improvements) && selectedAnalysis.improvements.length > 0 && (
                          <div>
                            <h3 className="text-sm font-semibold">Suggestions</h3>
                            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                              {selectedAnalysis.improvements.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {selectedResult.ai_analysis && (
                          <div className="rounded-2xl border bg-primary/5 p-4">
                            <h3 className="text-sm font-semibold">AI Analysis</h3>
                            <div className="mt-3 grid gap-3 md:grid-cols-2">
                              {parseAnalysisSections(
                                typeof selectedResult.ai_analysis === "string"
                                  ? selectedResult.ai_analysis
                                  : JSON.stringify(selectedResult.ai_analysis, null, 2)
                              ).map((section, index) => (
                                <article key={`${section.title}-${index}`} className="rounded-xl border bg-background p-4">
                                  <h4 className="text-sm font-semibold">{section.title}</h4>
                                  <div className="mt-2 space-y-2">
                                    {section.lines.map((line, lineIndex) => renderSectionLine(line, lineIndex))}
                                  </div>
                                </article>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </>
  );
}
