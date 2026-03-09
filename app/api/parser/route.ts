import { NextResponse } from "next/server";

const DEFAULT_PARSER_API_BASE = "https://resume-io-1-x1nq.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const incomingFormData = await req.formData();
    const formData = new FormData();
    for (const [key, value] of incomingFormData.entries()) {
      formData.append(key, value);
    }
    if (!formData.has("file") && formData.has("resume")) {
      const resume = formData.get("resume");
      if (resume) formData.append("file", resume);
    }
    const parserApiBase =
      process.env.PARSER_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      DEFAULT_PARSER_API_BASE;
    const backendUrl = `${parserApiBase.replace(/\/$/, "")}/parse`;

    const response = await fetch(backendUrl, {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson
      ? await response.json()
      : { detail: await response.text() };

    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Parser API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
