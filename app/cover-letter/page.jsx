"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PDFDocument, StandardFonts } from "pdf-lib";

import Lnavbar from "@/components/Lnavbar";
import FloatingSidebar from "@/components/dashboard/FloatingSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const wrapLine = (line, maxWidth, font, size) => {
  const words = line.split(" ");
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [""];
};

const downloadCoverLetterPdf = async (coverLetterText, fileBaseName) => {
  const pdfDoc = await PDFDocument.create();
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 52;
  const contentWidth = pageWidth - margin * 2;

  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  page.drawText("Cover Letter", { x: margin, y, size: 20, font: titleFont });
  y -= 34;

  const fontSize = 11.5;
  const lineHeight = 16;
  const paragraphs = coverLetterText.split("\n");

  for (const paragraph of paragraphs) {
    const lines = wrapLine(paragraph.trim(), contentWidth, bodyFont, fontSize);
    for (const line of lines) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      page.drawText(line, { x: margin, y, size: fontSize, font: bodyFont });
      y -= lineHeight;
    }
    y -= 6;
  }

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileBaseName || "cover-letter"}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

export default function CoverLetterPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedResumeText, setParsedResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManager, setHiringManager] = useState("");
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState("");

  const parseSelectedResume = async () => {
    if (!selectedFile) throw new Error("Please upload and select a resume file first.");

    setParsing(true);
    try {
      const form = new FormData();
      form.append("file", selectedFile);

      const res = await fetch("/api/parser", {
        method: "POST",
        body: form,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || data?.detail || "Failed to parse resume file");

      const sectionText = data?.sections
        ? Object.values(data.sections)
            .flat()
            .filter(Boolean)
            .join("\n")
        : "";

      const extractedText = [data?.summary, sectionText, data?.raw_text]
        .filter((item) => typeof item === "string" && item.trim())
        .join("\n\n")
        .trim();

      if (!extractedText) {
        throw new Error("Parser returned empty text. Try another resume file.");
      }

      setParsedResumeText(extractedText);
      return extractedText;
    } finally {
      setParsing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile || !jobDesc.trim() || !companyName.trim() || !hiringManager.trim()) {
      setError("Resume file, job description, company, and hiring manager are required.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const resumeText = parsedResumeText.trim() ? parsedResumeText : await parseSelectedResume();

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
      const coverLetter = data?.cover_letter || "";
      if (!coverLetter.trim()) throw new Error("Cover letter response was empty.");

      setResult(coverLetter);
      await downloadCoverLetterPdf(
        coverLetter,
        `${selectedFile?.name?.replace(/\.(pdf|docx)$/i, "") || "resume"}-cover-letter`
      );
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
      <section className="min-h-screen bg-background px-4 py-6 md:pl-24 sm:px-6 sm:py-8 lg:px-8">
        <motion.div
          className="mx-auto w-full max-w-5xl rounded-2xl border bg-card p-4 shadow-sm sm:p-6"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <h1 className="text-3xl font-bold tracking-tight">AI Cover Letter Generator</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a resume file, parse it, and generate a tailored cover letter using a target job description.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Company <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Hiring Manager <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="Hiring Manager Name"
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
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={loading || parsing || !selectedFile || !jobDesc.trim() || !companyName.trim() || !hiringManager.trim()}
                className="w-full"
              >
                {loading ? "Generating PDF..." : parsedResumeText.trim() ? "Generate PDF" : "Parse + Generate PDF"}
              </Button>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="surface-card p-4">
              <label className="mb-2 block text-sm font-semibold">Resume File(s)</label>
              <label
                htmlFor="resume-upload"
                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30 text-center transition hover:bg-muted/50"
              >
                <p className="font-medium">Upload resume file(s)</p>
                <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX, up to 5MB</p>
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (!file) {
                      setSelectedFile(null);
                      setParsedResumeText("");
                      return;
                    }
                    setSelectedFile(file);
                    setParsedResumeText("");
                    setResult("");
                    setError("");
                  }}
                />
              </label>

              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={parseSelectedResume}
                  disabled={!selectedFile || parsing || loading}
                >
                  {parsing ? "Parsing..." : "Parse Selected Resume"}
                </Button>
                {selectedFile && (
                  <p className="self-center text-xs text-muted-foreground">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              {parsedResumeText && (
                <p className="mt-3 text-xs text-emerald-700">
                  Resume parsed successfully and ready for cover-letter generation.
                </p>
              )}
            </div>

            <div className="surface-card p-4">
              <label className="mb-2 block text-sm font-semibold">Job Description</label>
              <Textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the target job description..."
                className="h-72 resize-none text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          {result && (
            <div className="mt-8 rounded-xl border bg-primary/5 p-4">
              <h2 className="text-sm font-semibold">Generated Cover Letter (Downloaded as PDF)</h2>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{result}</pre>
            </div>
          )}
        </motion.div>
      </section>
    </>
  );
}
