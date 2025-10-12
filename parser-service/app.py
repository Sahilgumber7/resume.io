import io
from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from parser import pdf_parser, docx_parser
import os, tempfile
from groq import Groq
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from docx import Document
import re
from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse

load_dotenv("../.env.local")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

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
    contents = await resume.read()
    suffix = os.path.splitext(resume.filename)[1].lower()
    if suffix == ".pdf":
        from PyPDF2 import PdfReader
        reader = PdfReader(io.BytesIO(contents))
        resume_text = "".join([page.extract_text() or "" for page in reader.pages]).lower()
    elif suffix == ".docx":
        from docx import Document
        doc = Document(io.BytesIO(contents))
        resume_text = "\n".join([para.text for para in doc.paragraphs]).lower()
    else:
        return {"error": "Unsupported file format"}
# Step 2: Prepare job tokens
    # --------------------------
    job_tokens = set(re.findall(r"\b\w+\b", job_desc.lower()))
    resume_tokens = set(re.findall(r"\b\w+\b", resume_text))
    matched = resume_tokens & job_tokens


    # Step 2: Section detection
    ats_sections = {
    "summary": ["summary", "profile", "overview", "professional summary"],
    "objective": ["objective", "career objective"],
    "experience": ["experience", "work experience", "employment", "professional experience"],
    "education": ["education", "qualifications", "academics", "academic background"],
    "skills": ["skills", "technical skills", "expertise", "competencies"],
    "projects": ["projects", "work samples", "portfolio", "personal projects"],
    "certifications": ["certifications", "licenses", "achievements", "awards"]
    }

    sections_detected = {sec: any(k.lower() in resume_text for k in kws) for sec, kws in ats_sections.items()}


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
         "resume_text": resume_text  # still return full parsed info
    }

def generate_response(message: str, system_prompt: str, temperature: float, max_tokens: int):
    conversation = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": message}
    ]

    response = client.chat.completions.create(
        model="llama-3.1-8B-Instant",
        messages=conversation,
        temperature=temperature,
        max_tokens=max_tokens,
        stream=False
    )

    return response.choices[0].message.content

@app.post("/analyze-resume")
async def analyze_resume_endpoint(
    resume_text: str = Form(...),
    job_description: str = Form(...),
    with_job_description: bool = Form(True),
    temperature: float = Form(0.3),
    max_tokens: int = Form(500)
):
    

    if with_job_description and job_description:
        prompt = f"""
        Please analyze the following resume in the context of the job description provided...
        Job Description: {job_description}
        Resume: {resume_text}
        """
    else:
        prompt = f"""
        Please analyze the following resume without a specific job description...
        Resume: {resume_text}
        """

    ai_output = generate_response(prompt, "You are an expert ATS resume analyzer.", temperature, max_tokens)

    return JSONResponse(content={"ai_analysis": ai_output})
