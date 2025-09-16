"use client";
import { useState } from "react";

export default function ResumeATSTester() {
  const [jobDesc, setJobDesc] = useState("");
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    if (!e.target.files?.[0] || !jobDesc) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", e.target.files[0]);
    formData.append("job_desc", jobDesc);

    try {
      const res = await fetch("/api/ats-test", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setParsed(data);
    } catch (err) {
      setParsed({ error: "Something went wrong" });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-4">
      <textarea
        placeholder="Paste Job Description here..."
        className="w-full p-2 border rounded"
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
      />

      <input type="file" onChange={handleUpload} />

      {loading && <p>Processing...</p>}

      {parsed && (
        <div className="mt-6 space-y-4">
          {parsed.error ? (
            <p className="text-red-500">{parsed.error}</p>
          ) : (
            <>
              <h2 className="text-xl font-bold">
                ATS Score: {parsed.ats_score}%
              </h2>

              <div>
                <h3 className="font-semibold">Sections Detected</h3>
                <pre className="bg-gray-100 p-2 rounded">
                  {JSON.stringify(parsed.sections_detected, null, 2)}
                </pre>
              </div>

              {parsed.keyword_match && (
                <div>
                  <h3 className="font-semibold">Keyword Match</h3>
                  <p>
                    Match %: {parsed.keyword_match.match_percent || 0}%
                  </p>
                  <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(
                      parsed.keyword_match.matched_keywords || [],
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              {parsed.improvements && (
                <div>
                  <h3 className="font-semibold">Suggestions</h3>
                  <ul className="list-disc pl-5">
                    {parsed.improvements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
