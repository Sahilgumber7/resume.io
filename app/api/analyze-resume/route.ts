// app/api/analyze-resume/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  // Forward to FastAPI
  const res = await fetch("https://resume-io-2lmq.onrender.com/analyze-resume", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}
