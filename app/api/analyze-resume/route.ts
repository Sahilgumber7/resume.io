// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json(); // JSON body from frontend

//     const res = await fetch("http://localhost:8000/analyze-resume", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       return NextResponse.json({ error: `FastAPI error: ${text}` });
//     }

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (err) {
//     const errorMessage = err instanceof Error ? err.message : String(err);
//     return NextResponse.json({ error: errorMessage });
//   }
// }
// app/api/analyze-resume/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();

  // Forward to FastAPI
  const res = await fetch("http://localhost:8000/analyze-resume", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data);
}
