"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Lnavbar from "@/components/Lnavbar";

export default function ATSTesterPage() {
  const [jobDesc, setJobDesc] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!jobDesc.trim()) {
      setError("⚠️ Please add a job description first.");
      return;
    }

    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_desc", jobDesc);

    try {
      const res = await fetch("/api/ats-test", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setParsed(data);
    } catch (err) {
      setError("❌ Something went wrong during analysis.");
    } finally {
      setLoading(false);
    }
  };
  

  
  return (
    <>
      <Lnavbar />
      <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-muted/40 flex items-center justify-center py-20 px-6">
        <motion.div
          className="w-full max-w-4xl bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 space-y-8 border border-gray-100"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-center text-gray-800"
            variants={fadeUp}
          >
            ATS Resume Tester
          </motion.h1>
          <motion.p
            className="text-center text-gray-600 text-lg"
            variants={fadeUp}
          >
            Paste a job description and upload your resume to get{" "}
            <span className="font-semibold text-primary">ATS compatibility analysis</span>.
          </motion.p>

          <motion.div className="space-y-5" variants={fadeUp}>
            <textarea
              placeholder="Paste Job Description here..."
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none shadow-sm"
              rows={6}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
            <div className="flex flex-col items-center space-y-3">
              <label className="text-gray-600 font-medium">
                Upload your resume (PDF/DOCX)
              </label>
              <input
                type="file"
                accept=".pdf,.docx"
                className="cursor-pointer text-sm"
                onChange={handleUpload}
              />
            </div>
          </motion.div>

          {loading && (
            <div className="text-center text-blue-600 font-medium animate-pulse">
              ⏳ Analyzing your resume, please wait...
            </div>
          )}

          {error && (
            <div className="text-center text-red-500 bg-red-50 border border-red-100 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {parsed && !loading && (
            <motion.div
              className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-inner"
              variants={fadeUp}
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                ATS Analysis Result
              </h3>
              <pre className="bg-white p-4 rounded-lg text-sm whitespace-pre-wrap">
                {parsed.ats_analysis || "No ATS analysis found."}
              </pre>

              {parsed.parsed_resume && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700">Parsed Resume Data</h4>
                  <pre className="bg-white p-4 rounded-lg text-sm overflow-x-auto">
                    {JSON.stringify(parsed.parsed_resume, null, 2)}
                  </pre>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>
    </>
  );
}
