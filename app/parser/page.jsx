"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Lnavbar from "@/components/Lnavbar";
import Result from "./result";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Lock } from "lucide-react";

export default function ParserPage() {
  const [file, setFile] = useState(null);
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { isSignedIn } = useUser();
  const router = useRouter();

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
      formData.append("file", file);

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

  const handleSaveAndOpen = async () => {
    if (!parsed) return;

    // 🔒 Require Authentication to Save & Open
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/parser");
      return;
    }

    setSaving(true);

    try {
      const formattedResume = {
        fullName: parsed.name || "",
        email: parsed.email || "",
        phone: parsed.phone || "",
        title: file?.name || "Untitled Resume",
        jobTitle: parsed.jobTitle || "",
        address: parsed.location || "",
        themeColor: "#000000",
        summary: parsed.summary || "",
        education: [],
        experience: [],
        skills: [],
        projects: [],
      };

      if (parsed.sections?.education?.length) {
        const edu = parsed.sections.education;
        formattedResume.education.push({
          degree: edu[2] || "",
          universityName: edu[0] || "",
          major: edu[2] || "",
          startDate: edu[1] || "",
          endDate: "",
          description: edu.slice(4).join(" "),
        });
      }

      if (parsed.sections?.experience?.length) {
        const expArr = parsed.sections.experience;
        const chunks = [];
        let current = [];

        expArr.forEach((line) => {
          if (line.startsWith("•") && current.length) {
            chunks.push([...current]);
            current = [];
          }
          current.push(line);
        });

        if (current.length) chunks.push(current);

        formattedResume.experience = chunks.map((chunk) => ({
          title: chunk.find((l) => l.includes("Developer")) || "",
          companyName:
            chunk.find((l) => l.includes(".com") || l.includes("PYOP")) || "",
          city:
            chunk.find((l) =>
              ["Delhi", "Bangalore", "Mumbai"].includes(l)
            ) || "",
          state: "",
          startDate:
            chunk.find((l) => l.includes("–"))?.split("–")[0]?.trim() || "",
          endDate:
            chunk.find((l) => l.includes("–"))?.split("–")[1]?.trim() || "",
          worksummary: chunk.filter((l) => l.startsWith("•")).join(" "),
        }));
      }

      if (parsed.sections?.skills?.length) {
        formattedResume.skills = parsed.sections.skills
          .filter((line) => line && !line.includes("Social"))
          .map((line) => ({ name: line, rating: 4 }));
      }

      if (parsed.sections?.projects?.length) {
        const projLines = parsed.sections.projects;
        let projects = [];
        let current = [];

        projLines.forEach((line) => {
          if (line.includes("|") && current.length) {
            projects.push([...current]);
            current = [];
          }
          current.push(line);
        });

        if (current.length) projects.push(current);

        formattedResume.projects = projects.map((proj) => ({
          title: proj[0] || "",
          description: proj.slice(1).join(" "),
        }));
      }

      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedResume),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("SAVE ERROR:", errorText);
        throw new Error("Failed to save resume");
      }

      const savedResume = await res.json();
      router.push(`/builder/${savedResume._id}`);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to save and open in builder.");
    } finally {
      setSaving(false);
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
            Parse Your Resume Instantly
          </motion.h1>
          <motion.p
            className="text-center text-gray-600 dark:text-[#9a9a9e] text-lg"
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
                <p className="text-sm text-gray-500 dark:text-[#9a9a9e] mt-1">
                  PDF or DOCX up to 5MB
                </p>
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
              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
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
              <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
          </motion.div>

          {parsed && !loading && (
            <motion.div variants={fadeUp} className="space-y-6">
              <Result data={parsed} />
              <div className="flex justify-center">
                <Button
                  onClick={handleSaveAndOpen}
                  disabled={saving}
                  className="px-10 py-3 text-lg font-semibold shadow-md hover:scale-105 transition bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  {!isSignedIn && <Lock size={18} />}
                  {saving
                    ? "Saving..."
                    : isSignedIn
                    ? "Open in Builder"
                    : "Sign in to Continue"}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>
    </>
  );
}

