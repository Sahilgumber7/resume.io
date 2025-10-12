from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from parser import pdf_parser, docx_parser
import tempfile, os, json

# ---------------------------
# Initialize FastAPI
# ---------------------------
app = FastAPI(title="ATS Resume Parser & Analyzer", version="1.0")

# CORS setup (allow all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Initialize Groq Client
# ---------------------------
GROQ_API_KEY = "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"
if not GROQ_API_KEY:
    raise ValueError("❌ Missing GROQ_API_KEY environment variable.")
client = Groq(api_key=GROQ_API_KEY)


# ---------------------------
# Helper — Call Groq LLM
# ---------------------------
def generate_response(
    prompt: str,
    system_prompt: str,
    temperature: float = 0.5,
    max_tokens: int = 1024
) -> str:
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8B-Instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt},
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            stream=False,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error while generating response: {e}"


# ---------------------------
# 1️⃣ Resume Parser Endpoint
# ---------------------------
@app.post("/parse")
async def parse_resume(resume: UploadFile = File(...)):
    """Parses PDF or DOCX resumes into structured JSON."""
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
# 2️⃣ ATS Analyzer Endpoint
# ---------------------------
@app.post("/ats-test")
async def ats_test(
    resume: UploadFile = File(...),
    job_desc: str = Form(""),
    with_job_description: bool = Form(True),
    temperature: float = Form(0.5),
    max_tokens: int = Form(1024),
):
    """Analyzes a resume using Groq's LLM for ATS scoring."""
    # Step 1: Parse Resume
    parsed_resume = await parse_resume(resume)

    if "error" in parsed_resume:
        return parsed_resume

    # Step 2: Extract resume text (handles both structured + raw)
    resume_text = (
        parsed_resume.get("raw_text", "")
        or parsed_resume.get("parsed_text", "")
    )

    # If structured JSON (like your parser output), flatten it for LLM
    if not resume_text:
        resume_text = json.dumps(parsed_resume, indent=2)

    if not resume_text.strip():
        return {"error": "No readable text extracted from resume."}

    # Step 3: Build LLM Prompt
    if with_job_description and job_desc.strip():
        prompt = f"""
You are an expert ATS (Applicant Tracking System) evaluator.
Analyze the following resume against the provided job description.

Provide a professional, structured report with:
1. Match percentage
2. Missing or weak keywords
3. Final summary (3 lines)
4. Recommendations (3–4 specific improvements)

Job Description:
{job_desc}

Resume Data:
{resume_text}
"""
    else:
        prompt = f"""
You are an expert ATS resume evaluator.
Analyze the following resume without a specific job description.

Provide a structured report including:
1. Overall resume quality score (0–10)
2. Evaluation based on Impact, Clarity, Structure, and Skills Relevance
3. Summary (2–3 lines)
4. Actionable improvement suggestions (3–4 points)

Resume Data:
{resume_text}
"""

    # Step 4: Generate AI Analysis
    analysis = generate_response(
        prompt,
        system_prompt="You are an expert ATS resume analyzer. Respond in clear, structured markdown.",
        temperature=temperature,
        max_tokens=max_tokens,
    )

    # Step 5: Return Combined Output
    return {
        "ats_analysis": analysis,
        "parsed_resume": parsed_resume,
    }


# ---------------------------
# Root Endpoint
# ---------------------------
@app.get("/")
async def root():
    return {
        "message": "✅ Welcome to the ATS Resume Analyzer API",
        "routes": {
            "/parse": "Parse PDF or DOCX resume into structured JSON.",
            "/ats-test": "Analyze resume using Groq ATS model.",
        },
    }
