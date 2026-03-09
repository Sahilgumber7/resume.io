import { NextResponse } from "next/server";

const DEFAULT_PARSER_API_BASE = "https://resume-io-1-x1nq.onrender.com/api/v1";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const parserApiBase =
      process.env.PARSER_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      DEFAULT_PARSER_API_BASE;
    const backendUrl = `${parserApiBase.replace(/\/$/, "")}/ats-test`;

    const response = await fetch(backendUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("FastAPI Error Response:", errText);
      return NextResponse.json({ error: "Backend error occurred" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("ATS Tester API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
