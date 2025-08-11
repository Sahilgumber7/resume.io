import pdf from "pdf-parse";
import mammoth from "mammoth";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const parsedData = await req.formData();
    const file = parsedData.get("resume") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const tempDirectory = path.join(process.cwd(), "uploads");
    await fs.mkdir(tempDirectory, { recursive: true });

    const filePath = path.join(tempDirectory, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);
 
    //parsing by extension of the file
    const ext = path.extname(file.name).toLowerCase();
    let extractedText = "";

    if (ext === ".pdf") {
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (ext === ".docx") {
      const data = await mammoth.extractRawText({ path: filePath });
      extractedText = data.value;
    } else {
      return new Response(JSON.stringify({ error: "Unsupported file type" }), {
        status: 400,
      });
    }

    // extract email & phone
    const email =
      extractedText.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i)?.[0] ||
      "";
    const phone =
      extractedText.match(/(\+?\d[\d -]{8,}\d)/)?.[0] || "";

    // Clean up
    await fs.unlink(filePath);

    return new Response(
      JSON.stringify({
        text: extractedText,
        email,
        phone,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
