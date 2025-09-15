"use client";
import { useState } from "react";
import Result from "./result";

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
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Upload Resume</h1>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!file || loading}
      >
        {loading ? "Parsing..." : "Parse Resume"}
      </button>

      {parsed && <Result data={parsed} />}
    </div>
  );
}
