import puppeteer from "puppeteer"
import ResumePreview from "@/components/ResumePreview"
import { ResumeInfoContext } from "@/components/ResumeInfoContext"
import { renderToString } from "react-dom/server"

export async function GET(req, { params }) {
  const { resumeId } = params

  // Fetch resume data from DB (mock example)
  const resumeInfo = {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    // ... other fields
  }

  // Convert ResumePreview → HTML string
  const html = renderToString(
    <ResumeInfoContext.Provider value={{ resumeInfo }}>
      <ResumePreview />
    </ResumeInfoContext.Provider>
  )

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: "networkidle0" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  })

  await browser.close()

  return new Response(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="resume-${resumeId}.pdf"`,
    },
  })
}
