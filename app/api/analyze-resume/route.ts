import { NextResponse } from "next/server";

const DEFAULT_PARSER_API_BASE = "https://resume-io-1-x1nq.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const parserApiBase =
      process.env.PARSER_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      DEFAULT_PARSER_API_BASE;
    const backendUrl = `${parserApiBase.replace(/\/$/, "")}/analyze`;

    const payload = new FormData();
    const resumeText = formData.get("resume_text");
    const jobDesc = formData.get("job_desc") ?? formData.get("job_description");
    const temperature = formData.get("temperature");

    if (typeof resumeText === "string") {
      payload.append("resume_text", resumeText);
    }
    if (typeof jobDesc === "string") {
      payload.append("job_desc", jobDesc);
    }
    if (typeof temperature === "string") {
      payload.append("temperature", temperature);
    }

    const res = await fetch(backendUrl, {
      method: "POST",
      body: payload,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Analyze backend error:", errText);
      return NextResponse.json({ error: "Backend error occurred" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Analyze API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
