// "use client";
// import { useState } from "react";

// export default function ResumeATSTester() {
//   const [jobDesc, setJobDesc] = useState("");
//   const [parsed, setParsed] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // const handleUpload = async (e) => {
//   //   if (!e.target.files?.[0] || !jobDesc) return;

//   //   setLoading(true);
//   //   const formData = new FormData();
//   //   formData.append("resume", e.target.files[0]);
//   //   formData.append("job_desc", jobDesc);

//   //   try {
//   //     const res = await fetch("/api/ats-test", {
//   //       method: "POST",
//   //       body: formData,
//   //     });

//   //     const data = await res.json();
//   //     setParsed(data);
//   //   } catch (err) {
//   //     setParsed({ error: "Something went wrong" });
//   //   }
//   //   setLoading(false);
//   // };

//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !jobDesc) return;

//     setLoading(true);

//     try {
//       // Step 1️⃣ — Parse resume using /api/parser
//       const formData = new FormData();
//       formData.append("resume", file);

//       const parseRes = await fetch("/api/parser", {
//         method: "POST",
//         body: formData,
//       });

//       const parsedResume = await parseRes.json();

//       // Step 2️⃣ — Send parsed resume + JD to ATS model
//       const atsFormData = new FormData();
//       atsFormData.append("resume_text", parsedResume.text || ""); // depends on parser output key
//       atsFormData.append("job_desc", jobDesc);

//       const atsRes = await fetch("/api/ats-test", {
//         method: "POST",
//         body: atsFormData,
//       });

//       const atsData = await atsRes.json();
//       // Step 3️⃣ — AI analysis using /analyze-resume
// const aiResponse = await fetch("/api/analyze-resume", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     resume_text: parsedResume.text || "",
//     job_description: jobDesc,
//     temperature: 0.3,
//     max_tokens: 500,
//   }),
// });

// const aiData = await aiResponse.text(); // this will be plain text from Groq
// console.log("AI Analysis:", aiData);

//       setParsed(atsData);
//     } catch (err) {
//       setParsed({ error: "Something went wrong while processing." });
//     }

//     setLoading(false);
//   };
//   return (
//     <div className="p-6 space-y-4">
//       <textarea
//         placeholder="Paste Job Description here..."
//         className="w-full p-2 border rounded"
//         value={jobDesc}
//         onChange={(e) => setJobDesc(e.target.value)}
//       />

//       <input type="file" onChange={handleUpload} />

//       {loading && <p>Processing...</p>}

//       {parsed && (
//         <div className="mt-6 space-y-4">
//           {parsed.error ? (
//             <p className="text-red-500">{parsed.error}</p>
//           ) : (
//             <>
//               <h2 className="text-xl font-bold">
//                 ATS Score: {parsed.ats_score}%
//               </h2>

//               <div>
//                 <h3 className="font-semibold">Sections Detected</h3>
//                 <pre className="bg-gray-100 p-2 rounded">
//                   {JSON.stringify(parsed.sections_detected, null, 2)}
//                 </pre>
//               </div>

//               {parsed.keyword_match && (
//                 <div>
//                   <h3 className="font-semibold">Keyword Match</h3>
//                   <p>
//                     Match %: {parsed.keyword_match.match_percent || 0}%
//                   </p>
//                   <pre className="bg-gray-100 p-2 rounded">
//                     {JSON.stringify(
//                       parsed.keyword_match.matched_keywords || [],
//                       null,
//                       2
//                     )}
//                   </pre>
//                 </div>
//               )}

//               {parsed.improvements && (
//                 <div>
//                   <h3 className="font-semibold">Suggestions</h3>
//                   <ul className="list-disc pl-5">
//                     {parsed.improvements.map((s, i) => (
//                       <li key={i}>{s}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {aiData && (
//   <div className="mt-6">
//     <h3 className="font-semibold">AI Analysis</h3>
//     <pre className="bg-gray-100 p-2 rounded">{aiData}</pre>
//   </div>
// )}

//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";
import { useState } from "react";

export default function ResumeATSTester() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [aiData, setAiData] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!resumeFile || !jobDesc) {
      alert("Please upload a resume and paste a job description first!");
      return;
    }

    setLoading(true);
    setParsed(null);
    setAiData("");

    try {
      // Step 1️⃣ — Parse resume using /api/parser
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const parseRes = await fetch("/api/parser", {
        method: "POST",
        body: formData,
      });

      
      if (!parseRes.ok) {
        const text = await parseRes.text();
        console.error("Parser returned:", text);
        setParsed({ error: "Failed to parse resume." });
        setLoading(false);
        return;
      }

      const parsedResume = await parseRes.json();
      let resumeText = "";

if (parsedResume.sections) {
  for (const sec of Object.values(parsedResume.sections)) {
    resumeText += sec.join("\n") + "\n";
  }
}

console.log("Parsed resume text:", resumeText);


      // Step 2️⃣ — Basic ATS scoring using /api/ats-test
      const atsFormData = new FormData();
      atsFormData.append("resume", resumeFile);
      atsFormData.append("job_desc", jobDesc);

      const atsRes = await fetch("/api/ats-test", {
        method: "POST",
        body: atsFormData,
      });

      const atsData = await atsRes.json();
      setParsed(atsData);

      // Step 3️⃣ — AI analysis using /api/analyze-resume
// const aiResponse = await fetch("/api/analyze-resume", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     resume_text: resumeText,
//     job_description: jobDesc,
//     temperature: 0.3,
//     max_tokens: 500,
//   }),
// });
// const aiJson = await aiResponse.json();

// if (aiJson.error) {
//   setAiData(`Error: ${aiJson.error}`);
// } else {
//   setAiData(aiJson.ai_analysis);
// }
const aiFormData = new FormData();
aiFormData.append("resume_text", resumeText);
aiFormData.append("job_description", jobDesc);
aiFormData.append("with_job_description", "true");
aiFormData.append("temperature", 0.3);
aiFormData.append("max_tokens", 500);

const aiResponse = await fetch("/api/analyze-resume", {
  method: "POST",
  body: aiFormData,
});

const aiJson = await aiResponse.json();
setAiData(aiJson.ai_analysis);
    } catch (err) {
      console.error(err);
      setParsed({ error: "Something went wrong while processing." });
    }

    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Resume ATS + AI Analyzer</h1>

      {/* Job Description Input */}
      <div>
        <h3 className="font-semibold mb-2">Job Description</h3>
        <textarea
          placeholder="Paste Job Description here..."
          className="w-full p-3 border rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
        />
      </div>

      {/* Resume Upload */}
      <div>
        <h3 className="font-semibold mb-2">Upload Resume</h3>
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setResumeFile(e.target.files[0])}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className={`px-6 py-2 font-medium rounded-lg text-white transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-600">Processing your resume...</p>
      )}

      {/* Results */}
      {parsed && !loading && (
        <div className="mt-8 space-y-6">
          {parsed.error ? (
            <p className="text-red-500">{parsed.error}</p>
          ) : (
            <>
              {/* ATS Score Section */}
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-blue-700">
                  ATS Score: {parsed.ats_score}%
                </h2>
              </div>

              {/* Sections Detected */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">
                  Sections Detected
                </h3>
                <pre className="bg-gray-100 p-3 rounded text-sm">
                  {JSON.stringify(parsed.sections_detected, null, 2)}
                </pre>
              </div>

              {/* Keyword Match */}
              {parsed.keyword_match && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Keyword Match
                  </h3>
                  <p className="text-sm mb-1">
                    Match %: {parsed.keyword_match.match_percent || 0}%
                  </p>
                  <pre className="bg-gray-100 p-3 rounded text-sm">
                    {JSON.stringify(
                      parsed.keyword_match.matched_keywords || [],
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}

              {/* Suggestions */}
              {parsed.improvements && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">
                    Suggestions
                  </h3>
                  <ul className="list-disc pl-6 text-sm space-y-1">
                    {parsed.improvements.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Analysis */}
              {aiData && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">
                    AI Analysis
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {aiData}
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


// "use client";
// import { useState } from "react";

// export default function ResumeATSTester() {
//   const [jobDesc, setJobDesc] = useState("");
//   const [file, setFile] = useState(null); // just plain JS, no File | null
//   const [parsed, setParsed] = useState(null); // any type
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     const uploadedFile = e.target.files?.[0] ?? null;
//     setFile(uploadedFile);
//   };

//   const handleSubmit = async () => {
//     if (!file || !jobDesc) {
//       alert("Please upload a resume and paste a job description!");
//       return;
//     }

//     setLoading(true);
// try{
//      // 1️⃣ — Upload resume to parser
//       const formData = new FormData();
//       formData.append("resume", file);

//       const parseRes = await fetch("/api/parser", {
//         method: "POST",
//         body: formData,
//       });

//       if (!parseRes.ok) {
//         setParsed({ error: `Parser API error: ${parseRes.status}` });
//         setLoading(false);
//         return;
//       }

//       const parsedResume = await parseRes.json();

//       if (!parsedResume?.text) {
//         setParsed({ error: "Parser returned empty resume text" });
//         setLoading(false);
//         return;
//       }



//       // Step 2 — ATS check
//       const atsFormData = new FormData();
//       atsFormData.append("resume_text", parsedResume.text);
//       atsFormData.append("job_desc", jobDesc);

//       const atsRes = await fetch("/api/ats-test", {
//         method: "POST",
//         body: atsFormData,
//       });

//       const atsData = await atsRes.json();
//       setParsed(atsData);
//     } catch (err) {
//       console.error(err);
//       setParsed({ error: "Something went wrong while processing." });
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-6 space-y-4 max-w-xl mx-auto">
//       <h1 className="text-2xl font-bold text-center">ATS Resume Checker</h1>

//       <textarea
//         placeholder="Paste Job Description here..."
//         className="w-full p-2 border rounded"
//         rows={5}
//         value={jobDesc}
//         onChange={(e) => setJobDesc(e.target.value)}
//       />

//       <input type="file" onChange={handleFileChange} accept=".pdf,.docx" />

//       <button
//         onClick={handleSubmit}
//         className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//         disabled={loading}
//       >
//         {loading ? "Processing..." : "Check ATS Score"}
//       </button>

//       {parsed && (
//         <div className="mt-6 space-y-4">
//           {parsed.error ? (
//             <p className="text-red-500">{parsed.error}</p>
//           ) : (
//             <>
//               <h2 className="text-xl font-bold">
//                 ATS Score: {parsed.ats_score}%
//               </h2>

//               {parsed.keyword_match && (
//                 <div>
//                   <h3 className="font-semibold">Keyword Match</h3>
//                   <p>
//                     Match %: {parsed.keyword_match.match_percent || 0}%
//                   </p>
//                   <pre className="bg-gray-100 p-2 rounded">
//                     {JSON.stringify(
//                       parsed.keyword_match.matched_keywords || [],
//                       null,
//                       2
//                     )}
//                   </pre>
//                 </div>
//               )}

//               {parsed.improvements && (
//                 <div>
//                   <h3 className="font-semibold">Suggestions</h3>
//                   <ul className="list-disc pl-5">
//                     {parsed.improvements.map((s, i) => (
//                       <li key={i}>{s}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
