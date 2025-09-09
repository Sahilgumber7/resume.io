import pdf from "pdf-parse/lib/pdf-parse.js"; // ✅ Fix: avoids ENOENT issue
import mammoth from "mammoth";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs"; // ✅ ensures Node.js runtime, not edge

// --- Helper: Split resume into sections ---
function autoParseSections(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {};
  let currentSection = "General";

  for (const line of lines) {
    const words = line.split(" ");
    const isHeading =
      words.length <= 4 &&
      ((line === line.toUpperCase()) || /^[A-Z][a-z]+/.test(line)) &&
      !line.match(/\d/) &&
      !line.includes(",");

    if (isHeading) {
      currentSection = line.toUpperCase();
      sections[currentSection] = [];
    } else {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  return sections;
}

// --- API Route ---
export async function POST(req: Request) {
  try {
    const parsedData = await req.formData();
    const file = parsedData.get("resume") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save uploaded file temporarily
    const tempDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(tempDir, { recursive: true });

    const filePath = path.join(tempDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Parse text based on extension
    const ext = path.extname(file.name).toLowerCase();
    let extractedText = "";

    if (ext === ".pdf") {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      extractedText = data.value;
    } else {
      await fs.unlink(filePath); // cleanup
      return Response.json({ error: "Unsupported file type" }, { status: 400 });
    }

    // Auto-parse into sections
    const sections = autoParseSections(extractedText);

    // Cleanup uploaded file
    await fs.unlink(filePath);

    return Response.json({ sections }, { status: 200 });
  } catch (error: unknown) {
    console.error("Parser error:", error);
    return Response.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
