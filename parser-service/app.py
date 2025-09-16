from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from parser import pdf_parser, docx_parser
import os, tempfile

app = FastAPI()

# CORS (allow all for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Base Resume Parser
# ---------------------------
@app.post("/parse")
async def parse_resume(resume: UploadFile = File(...)):
    suffix = os.path.splitext(resume.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await resume.read())
        tmp_path = tmp.name

    try:
        if suffix == ".pdf":
            parsed = pdf_parser.parse(tmp_path)
        elif suffix == ".docx":
            parsed = docx_parser.parse(tmp_path)
        else:
            parsed = {"error": "Unsupported file format"}
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    return parsed


# ---------------------------
# ATS Tester
# ---------------------------
@app.post("/ats-test")
async def ats_test(resume: UploadFile = File(...), job_desc: str = Form(...)):
    # Step 1: Parse resume
    parsed_resume = await parse_resume(resume)

    if "error" in parsed_resume:
        return parsed_resume

    resume_text = parsed_resume.get("raw_text", "").lower()
    job_tokens = set(job_desc.lower().split())
    resume_tokens = set(resume_text.split())
    matched = resume_tokens & job_tokens

    # Step 2: Section detection
    ats_sections = ["summary", "objective", "experience", "education", "skills", "projects", "certifications"]
    sections_detected = {sec: (sec in resume_text) for sec in ats_sections}

    # Step 3: Scoring
    section_score = sum(sections_detected.values()) * 10
    keyword_score = len(matched) / max(len(job_tokens), 1) * 50
    ats_score = round(min(100, section_score + keyword_score), 2)

    # Step 4: Suggestions
    suggestions = []
    for sec, present in sections_detected.items():
        if not present:
            suggestions.append(f"Add a {sec.capitalize()} section for better ATS readability.")

    missing_keywords = job_tokens - resume_tokens
    if missing_keywords:
        suggestions.append(f"Consider adding keywords: {', '.join(list(missing_keywords)[:5])}.")

    return {
        "ats_score": ats_score,
        "sections_detected": sections_detected,
        "keyword_match": {
            "match_percent": round(len(matched) / max(len(job_tokens), 1) * 100, 2),
            "matched_keywords": sorted(matched),
        },
        "improvements": suggestions,
        "parsed_resume": parsed_resume,  # still return full parsed info
    }
