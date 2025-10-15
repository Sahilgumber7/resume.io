"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Lnavbar from "@/components/Lnavbar";

export default function ResumeATSTester() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [aiData, setAiData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const handleUpload = async () => {
    if (!resumeFile || !jobDesc.trim()) {
      setError("⚠️ Please upload a resume and paste a job description.");
      return;
    }

    setLoading(true);
    setParsed(null);
    setAiData("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const parseRes = await fetch("/api/parser", { method: "POST", body: formData });
      if (!parseRes.ok) throw new Error("Failed to parse resume");
      const parsedResume = await parseRes.json();

      let resumeText = "";
      if (parsedResume.sections) {
        for (const sec of Object.values(parsedResume.sections)) {
          resumeText += Array.isArray(sec) ? sec.join("\n") + "\n" : "";
        }
      }

      const atsFormData = new FormData();
      atsFormData.append("resume", resumeFile);
      atsFormData.append("job_desc", jobDesc);
      const atsRes = await fetch("/api/ats-test", { method: "POST", body: atsFormData });
      const atsData = await atsRes.json();
      setParsed(atsData);

      const aiFormData = new FormData();
      aiFormData.append("resume_text", resumeText);
      aiFormData.append("job_description", jobDesc);
      aiFormData.append("with_job_description", "true");
      aiFormData.append("temperature", "0.3");
      aiFormData.append("max_tokens", "500");

      const aiResponse = await fetch("/api/analyze-resume", { method: "POST", body: aiFormData });
      const aiJson = await aiResponse.json();
      setAiData(aiJson.ai_analysis);
    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong while processing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Lnavbar />
      <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-muted/40 dark:from-[#0d0d0f] dark:via-[#141416] dark:to-[#1a1a1c] flex items-center justify-center py-20 px-6 transition-colors duration-300">
        <motion.div
          className="w-full max-w-3xl mx-auto bg-white/90 dark:bg-[#1a1a1c]/90 backdrop-blur-xl rounded-2xl shadow-2xl p-10 space-y-8 border border-gray-100 dark:border-[#1d1d20]"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-center text-gray-800 dark:text-[#f2f2f3]"
            variants={fadeUp}
          >
            Resume ATS + AI Analyzer
          </motion.h1>
          <motion.p
            className="text-center text-gray-600 dark:text-[#9a9a9e] text-lg"
            variants={fadeUp}
          >
            Upload your <span className="font-semibold text-primary">PDF</span> or{" "}
            <span className="font-semibold text-primary">DOCX</span> resume and paste the job
            description to evaluate ATS compatibility and get AI insights.
          </motion.p>

          <motion.div className="flex flex-col space-y-6" variants={fadeUp}>
            {/* Job Description */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700 dark:text-[#f2f2f3]">
                Job Description
              </label>
              <textarea
                placeholder="Paste job description here..."
                className="w-full p-4 border rounded-xl h-36 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none bg-gray-50 dark:bg-[#1a1a1c] dark:text-[#f2f2f3] dark:border-[#1d1d20]"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            {/* Resume Upload */}
            <label
              htmlFor="resume-upload"
              className="w-full flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-300 dark:border-[#1d1d20] rounded-xl bg-gray-50 dark:bg-[#1a1a1c] hover:bg-gray-100 dark:hover:bg-[#232326] cursor-pointer transition"
            >
              <div className="text-center text-gray-600 dark:text-[#f2f2f3]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mx-auto text-primary mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5V21h18v-4.5M12 3v12m0 0l4.5-4.5M12 15l-4.5-4.5"
                  />
                </svg>
                <p className="font-medium">Click or drag to upload resume</p>
                <p className="text-sm text-gray-500 dark:text-[#9a9a9e] mt-1">PDF or DOCX up to 5MB</p>
              </div>
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
            </label>

            {resumeFile && (
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                ✅ Selected: {resumeFile.name}
              </p>
            )}

            {/* Analyze Button */}
            <Button
              size="lg"
              onClick={handleUpload}
              disabled={loading || !resumeFile || !jobDesc.trim()}
              className="px-8 text-lg font-semibold shadow-md hover:scale-105 transition"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </Button>

            {error && (
              <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </motion.div>

          {/* Results */}
          {parsed && !loading && (
            <motion.div className="space-y-6" variants={fadeUp}>
              {/* ATS Score */}
              <div className="p-4 bg-gray-50 dark:bg-[#1a1a1c] rounded-xl shadow-sm border border-gray-100 dark:border-[#1d1d20]">
                <h2 className="text-xl font-bold text-primary dark:text-primary/80">
                  ATS Score: {parsed.ats_score ?? "N/A"}%
                </h2>
              </div>

              {/* Sections Detected */}
              {parsed.sections_detected && typeof parsed.sections_detected === "object" && (
                <div>
                  <h3 className="font-semibold mb-1 text-gray-700 dark:text-[#f2f2f3]">Sections Detected</h3>
                  <pre className="bg-gray-100 dark:bg-[#1a1a1c] text-black dark:text-[#f2f2f3] p-3 rounded text-sm">
                    {JSON.stringify(parsed.sections_detected, null, 2)}
                  </pre>
                </div>
              )}

              {/* Semantic Similarity */}
              {parsed.semantic_similarity && typeof parsed.semantic_similarity === "object" && (
                <div>
                  <h3 className="font-semibold mb-1 text-gray-700 dark:text-[#f2f2f3]">Semantic Similarity</h3>
                  <pre className="bg-gray-100 dark:bg-[#1a1a1c] text-black dark:text-[#f2f2f3] p-3 rounded text-sm">
                    {JSON.stringify(parsed.semantic_similarity, null, 2)}
                  </pre>
                </div>
              )}

              {/* Keyword Match */}
              {parsed.keyword_match?.matched_keywords &&
                Array.isArray(parsed.keyword_match.matched_keywords) &&
                parsed.keyword_match.matched_keywords.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-1 text-gray-700 dark:text-[#f2f2f3]">Keyword Match</h3>
                    <pre className="bg-gray-100 dark:bg-[#1a1a1c] text-black dark:text-[#f2f2f3] p-3 rounded text-sm">
                      {JSON.stringify(parsed.keyword_match.matched_keywords, null, 2)}
                    </pre>
                  </div>
                )}

              {/* Suggestions */}
              {Array.isArray(parsed.improvements) && parsed.improvements.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-1 text-gray-700 dark:text-[#f2f2f3]">Suggestions</h3>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    {parsed.improvements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Analysis */}
              {aiData && (
                <div className="p-4 bg-primary/10 dark:bg-primary/20 rounded-xl border border-primary/20 dark:border-primary/40">
                  <h3 className="font-semibold text-primary dark:text-primary/80 mb-2">AI Analysis</h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-600 dark:text-[#f2f2f3]">{aiData}</pre>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>
    </>
  );
}

