import { NextResponse } from "next/server";

const DEFAULT_PARSER_API_BASE = "https://resume-io-1-x1nq.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const incoming = await req.formData();
    const payload = new FormData();

    for (const [key, value] of incoming.entries()) {
      payload.append(key, value);
    }

    if (!payload.has("job_desc") && payload.has("job_description")) {
      const jobDescription = payload.get("job_description");
      if (typeof jobDescription === "string") payload.append("job_desc", jobDescription);
    }

    const parserApiBase =
      process.env.PARSER_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      DEFAULT_PARSER_API_BASE;
    const backendUrl = `${parserApiBase.replace(/\/$/, "")}/linkedin-analyze`;

    const res = await fetch(backendUrl, {
      method: "POST",
      body: payload,
    });

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await res.json() : { detail: await res.text() };
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    console.error("LinkedIn analyze API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
