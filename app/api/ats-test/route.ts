// app/api/ats-test/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  // Forward request to FastAPI
  const res = await fetch("http://localhost:8000/ats-test`" , {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}
