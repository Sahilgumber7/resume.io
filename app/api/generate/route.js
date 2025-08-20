import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req) {
  try {
    const { prompt } = await req.json()

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    return new Response(JSON.stringify({ output: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Gemini API Error:", error)
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
