"use client";
import { useState } from "react";
import Result from "./result";
import Lnavbar from "@/components/Lnavbar";

export default function ResumeUploadPage() {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/parser", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setParsed(data);
    setLoading(false);
  };

  return (
        <>
      <Lnavbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-600">
          Upload Your Resume
        </h1>

        <div className=" p-6" >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose a resume file (PDF or DOCX)
          </label>

          <input
            type="file"
            accept=".pdf,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
              mb-4"
          />

          <button
            onClick={handleUpload}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-all"
            disabled={!file || loading}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Parsing...
              </span>
            ) : (
              "Parse Resume"
            )}
          </button>
        </div>

        {parsed && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Parsed Result</h2>
            <Result data={parsed} />
          </div>
        )}
      </div>
    </>
  );
}
