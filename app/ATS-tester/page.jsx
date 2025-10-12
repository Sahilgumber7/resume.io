"use client";
import { useState } from "react";

export default function ResumeATSTester() {
  const [jobDesc, setJobDesc] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!jobDesc.trim()) {
      setError("⚠️ Please paste a job description first.");
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
      console.error(err);
      setError("Something went wrong while processing your resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">ATS Resume Tester</h1>

      <textarea
        placeholder="Paste Job Description here..."
        className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-200"
        rows={6}
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <div className="flex flex-col items-center space-y-3">
        <label className="text-gray-600">Upload your resume (PDF/DOCX)</label>
        <input
          type="file"
          accept=".pdf,.docx"
          className="cursor-pointer"
          onChange={handleUpload}
        />
      </div>

      {loading && (
        <div className="text-center text-blue-600 font-medium">
          ⏳ Analyzing your resume, please wait...
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 font-medium">{error}</div>
      )}

      {parsed && !loading && (
        <div className="mt-8 space-y-6 bg-white p-6 rounded-xl shadow-md">
          {parsed.error ? (
            <p className="text-red-600">{parsed.error}</p>
          ) : (
            <>
              {/* ATS Score */}
              {parsed.ats_analysis && (
                <div>
                  <h2 className="text-xl font-semibold mb-2">ATS Analysis</h2>
                  <pre className="bg-gray-100 p-3 rounded text-sm whitespace-pre-wrap">
                    {parsed.ats_analysis}
                  </pre>
                </div>
              )}

              {/* Parsed Resume Data */}
              {parsed.parsed_resume && (
                <div>
                  <h3 className="font-semibold mb-2">Parsed Resume Data</h3>
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(parsed.parsed_resume, null, 2)}
                  </pre>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
