import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const res = await fetch("http://localhost:8000/parse", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}
