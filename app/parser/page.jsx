"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Lnavbar from "@/components/Lnavbar";
import Result from "./result";

export default function ParserPage() {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const handleUpload = async () => {
    if (!file) {
      setError("⚠️ Please select a resume file first.");
      return;
    }
    setLoading(true);
    setError("");
    setParsed(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await fetch("/api/parser", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setParsed(data);
    } catch (err) {
      setError("❌ Something went wrong while uploading your resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Lnavbar />
      <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-muted/40 flex items-center justify-center py-20 px-6">
        <motion.div
          className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-10 space-y-8 border border-gray-100"
          initial="hidden"
          animate="show"
          variants={fadeUp}
        >
          <motion.h1
            className="text-4xl sm:text-5xl font-bold text-center text-gray-800"
            variants={fadeUp}
          >
            Parse Your Resume Instantly
          </motion.h1>
          <motion.p
            className="text-center text-gray-600 text-lg"
            variants={fadeUp}
          >
            Upload your <span className="font-semibold text-primary">PDF</span>{" "}
            or <span className="font-semibold text-primary">DOCX</span> resume to
            extract structured details for analysis.
          </motion.p>

          <motion.div
            className="flex flex-col items-center space-y-5"
            variants={fadeUp}
          >
            <label
              htmlFor="file-upload"
              className="w-full flex flex-col items-center justify-center h-44 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="text-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mx-auto text-blue-500 mb-2"
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
                <p className="text-sm text-gray-500 mt-1">PDF or DOCX up to 5MB</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            {file && (
              <p className="text-sm text-blue-700 font-medium">
                ✅ Selected: {file.name}
              </p>
            )}

            <Button
              size="lg"
              disabled={!file || loading}
              onClick={handleUpload}
              className="px-8 text-lg font-semibold shadow-md hover:scale-105 transition"
            >
              {loading ? "Parsing..." : "Parse Resume"}
            </Button>

            {error && (
              <div className="text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </motion.div>

          {parsed && !loading && (
            <motion.div variants={fadeUp}>
              <Result data={parsed} />
            </motion.div>
          )}
        </motion.div>
      </section>
    </>
  );
}
