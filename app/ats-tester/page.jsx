"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
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

export default function ResumeATSTester() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFiles, setResumeFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [analysisResults, setAnalysisResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedFile = resumeFiles[selectedFileIndex] || null;
  const selectedResult =
    analysisResults.find((result) => result.filename === selectedFile?.name) ||
    analysisResults[0] ||
    null;

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
          <ResumeFilePreview file={selectedFile} />

          <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight">ATS + AI Resume Tester</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare resumes against a job description and review ATS fit with AI feedback.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold">Job Description</label>
                <textarea
                  placeholder="Paste the target job description here..."
                  className="h-36 w-full resize-none rounded-xl border bg-muted/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                <input
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

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button size="lg" onClick={handleUpload} disabled={loading || !resumeFiles.length || !jobDesc.trim()} className="flex-1">
                  {loading ? "Analyzing..." : "Analyze Resume(s)"}
                </Button>

                <Button size="lg" variant="outline" onClick={handleDownloadCSV} disabled={!analysisResults.length} className="flex-1">
                  Download CSV
                </Button>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {analysisResults.length > 0 && (
              <div className="mt-8 space-y-5">
                <div className="rounded-xl border p-4">
                  <h2 className="text-sm font-semibold">Score Snapshot</h2>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {analysisResults.map((result) => (
                      <div key={result.filename} className="rounded-lg border bg-muted/20 p-3 text-sm">
                        <p className="truncate font-medium">{result.filename}</p>
                        <p className="mt-1 text-muted-foreground">
                          ATS Score: {result.heuristic_analysis?.ats_score ?? "N/A"}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedResult && (
                  <div className="space-y-4 rounded-xl border p-4">
                    <h2 className="text-lg font-semibold">Detailed Result: {selectedResult.filename}</h2>

                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <p><span className="font-semibold">ATS Score:</span> {selectedResult.heuristic_analysis?.ats_score ?? "N/A"}%</p>
                      <p><span className="font-semibold">Semantic Similarity:</span> {selectedResult.heuristic_analysis?.semantic_similarity_percent ?? "N/A"}%</p>
                      <p><span className="font-semibold">Keyword Match:</span> {selectedResult.heuristic_analysis?.keyword_match_percent ?? 0}%</p>
                      <p><span className="font-semibold">Section Coverage:</span> {selectedResult.heuristic_analysis?.section_coverage_percent ?? 0}%</p>
                      <p><span className="font-semibold">Action Verbs:</span> {selectedResult.heuristic_analysis?.action_verb_percent ?? 0}%</p>
                      <p><span className="font-semibold">Length Quality:</span> {selectedResult.heuristic_analysis?.length_score_percent ?? 0}%</p>
                      <p className="sm:col-span-2"><span className="font-semibold">Matched Keywords:</span> {selectedResult.heuristic_analysis?.matched_keywords?.join(", ") || "-"}</p>
                      <p className="sm:col-span-2"><span className="font-semibold">Missing Keywords:</span> {selectedResult.heuristic_analysis?.missing_keywords?.join(", ") || "-"}</p>
                    </div>

                    {Array.isArray(selectedResult.heuristic_analysis?.improvements) && selectedResult.heuristic_analysis.improvements.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold">Suggestions</h3>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                          {selectedResult.heuristic_analysis.improvements.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedResult.ai_analysis && (
                      <div className="rounded-lg border bg-primary/5 p-3">
                        <h3 className="text-sm font-semibold">AI Analysis</h3>
                        <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">
                          {typeof selectedResult.ai_analysis === "string"
                            ? selectedResult.ai_analysis
                            : JSON.stringify(selectedResult.ai_analysis, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </>
  );
}
