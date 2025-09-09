import pdf from "pdf-parse/lib/pdf-parse.js"; 
import mammoth from "mammoth";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

// --- Section parser ---
function autoParseSections(text: string) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const sections: Record<string, string[]> = {};
  let currentSection = "GENERAL";

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

// --- Contact info extraction ---
function extractContactInfo(text: string) {
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || null;
  const phone = text.match(/(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/)?.[0] || null;
  const linkedin = text.match(/linkedin\.com\/[a-zA-Z0-9-_/]+/i)?.[0] || null;
  return { email, phone, linkedin };
}

// --- Name extraction ---
function extractName(text: string) {
  const firstLine = text.split("\n").map(l => l.trim()).filter(Boolean)[0];
  if (firstLine && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(firstLine)) {
    return firstLine;
  }
  return null;
}

// --- Full resume parser ---
function parseResume(text: string) {
  const sections = autoParseSections(text);
  const contact = extractContactInfo(text);
  const name = extractName(text);

  return {
    name,
    ...contact,
    sections,
    education: sections["EDUCATION"] || [],
    experience: sections["EXPERIENCE"] || [],
    skills: sections["SKILLS"] || []
  };
}

// --- API ---
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File;

    if (!file) return Response.json({ error: "No file uploaded" }, { status: 400 });

    const tempDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(tempDir, { recursive: true });

    const filePath = path.join(tempDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    let extractedText = "";
    const ext = path.extname(file.name).toLowerCase();

    if (ext === ".pdf") {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      extractedText = data.value;
    } else {
      await fs.unlink(filePath);
      return Response.json({ error: "Unsupported file type" }, { status: 400 });
    }

    await fs.unlink(filePath);

    const resume = parseResume(extractedText);

    return Response.json({ resume }, { status: 200 });
  } catch (error: unknown) {
    console.error(error);
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
