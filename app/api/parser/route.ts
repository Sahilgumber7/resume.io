import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/parse`;

    const response = await fetch(backendUrl, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Parser API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
