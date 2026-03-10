import { NextResponse } from "next/server";

const DEFAULT_PARSER_API_BASE = "https://resume-io-1-x1nq.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const incoming = await req.formData();
    const payload = new FormData();

    const resumeText = incoming.get("resume_text");
    const jobDesc = incoming.get("job_desc") ?? incoming.get("job_description");
    const companyName = incoming.get("company_name");
    const hiringManager = incoming.get("hiring_manager");
    const tone = incoming.get("tone");
    const temperature = incoming.get("temperature");

    if (typeof resumeText === "string") payload.append("resume_text", resumeText);
    if (typeof jobDesc === "string") payload.append("job_desc", jobDesc);
    if (typeof companyName === "string") payload.append("company_name", companyName);
    if (typeof hiringManager === "string") payload.append("hiring_manager", hiringManager);
    if (typeof tone === "string") payload.append("tone", tone);
    if (typeof temperature === "string") payload.append("temperature", temperature);

    const parserApiBase =
      process.env.PARSER_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      DEFAULT_PARSER_API_BASE;
    const backendUrl = `${parserApiBase.replace(/\/$/, "")}/cover-letter`;

    const res = await fetch(backendUrl, {
      method: "POST",
      body: payload,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json() : { detail: await res.text() };
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    console.error("Cover letter API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
