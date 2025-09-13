from fastapi import FastAPI, UploadFile, File
from parser import pdf_parser, docx_parser
import os, tempfile

app = FastAPI()

@app.post("/parse")
async def parse_resume(resume: UploadFile = File(...)):
    suffix = os.path.splitext(resume.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await resume.read())
        tmp_path = tmp.name

    if suffix == ".pdf":
        parsed = pdf_parser.parse(tmp_path)
    elif suffix == ".docx":
        parsed = docx_parser.parse(tmp_path)
    else:
        parsed = {"error": "Unsupported file format"}

    return parsed
