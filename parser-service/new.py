from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from parser import pdf_parser, docx_parser
import tempfile, os

# ---------------------------
# Initialize FastAPI
# ---------------------------
app = FastAPI(title="ATS Resume Analyzer Pro", version="2.0")

# ---------------------------
# CORS setup (allow all for dev)
# ---------------------------
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
GROQ_API_KEY = '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'
if not GROQ_API_KEY:
    raise ValueError("❌ Missing GROQ_API_KEY environment variable.")
client = Groq(api_key=GROQ_API_KEY)

# ---------------------------
# Helper — Call Groq LLM
# ---------------------------
def generate_response(prompt: str, system_prompt: str, temperature: float = 0.5, max_tokens: int = 1024) -> str:
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
# File Parsing Utilities
# ---------------------------
def parse_uploaded_file(file: UploadFile):
    suffix = os.path.splitext(file.filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file.file.read())
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
# AI-Based Analysis Functions
# ---------------------------
def analyze_resume_with_job_description(resume_text, job_description, temperature, max_tokens):
    prompt = f"""
    Analyze the resume against the job description with strict ATS standards.
    1. Match percentage
    2. Missing keywords
    3. Final thoughts (3 lines)
    4. Recommendations (3–4 actionable points)
    
    Job Description: {job_description}
    Resume: {resume_text}
    """
    return generate_response(prompt, "You are an expert ATS resume analyzer.", temperature, max_tokens)

def analyze_resume_without_job_description(resume_text, temperature, max_tokens):
    prompt = f"""
    Analyze the resume without a job description.
    1. Overall resume score (0–10)
    2. Feedback based on: Impact, Brevity, Style, Sections
    3. Overall assessment (2–3 lines)
    4. Improvement suggestions (3–4 specific points)
    
    Resume: {resume_text}
    """
    return generate_response(prompt, "You are an expert ATS resume analyzer.", temperature, max_tokens)

def rephrase_text(text, temperature, max_tokens):
    prompt = f"""
    Rephrase the following text according to ATS standards. Include measurable improvements and concise points.
    Original Text: {text}
    """
    return generate_response(prompt, "You are an expert in rephrasing for ATS optimization.", temperature, max_tokens)

def generate_cover_letter(resume_text, job_description, temperature, max_tokens):
    prompt = f"""
    Create a professional cover letter tailored to the resume and job description (250–300 words).
    Resume: {resume_text}
    Job Description: {job_description}
    """
    return generate_response(prompt, "You are an expert in writing tailored cover letters.", temperature, max_tokens)

def generate_interview_questions(job_description, temperature, max_tokens):
    prompt = f"""
    Generate 10 interview questions based on this job description, including technical, behavioral, and cultural fit questions.
    Job Description: {job_description}
    """
    return generate_response(prompt, "You are an expert in creating interview questions from job descriptions.", temperature, max_tokens)

# ---------------------------
# Endpoints
# ---------------------------

@app.post("/parse")
async def parse_resume_endpoint(resume: UploadFile = File(...)):
    return parse_uploaded_file(resume)

@app.post("/ats-test")
async def ats_test(
    resume: UploadFile = File(...),
    job_desc: str = Form(""),
    with_job_description: bool = Form(True),
    temperature: float = Form(0.5),
    max_tokens: int = Form(1024)
):
    parsed_resume = parse_uploaded_file(resume)
    if "error" in parsed_resume:
        return parsed_resume

    resume_text = parsed_resume.get("raw_text", "") or parsed_resume.get("parsed_text", "")
    if not resume_text:
        return {"error": "No readable text extracted from resume."}

    if with_job_description and job_desc.strip():
        analysis = analyze_resume_with_job_description(resume_text, job_desc, temperature, max_tokens)
    else:
        analysis = analyze_resume_without_job_description(resume_text, temperature, max_tokens)

    return {"ats_analysis": analysis, "parsed_resume": parsed_resume}

@app.post("/rephrase")
async def rephrase_endpoint(
    text: str = Form(...),
    temperature: float = Form(0.5),
    max_tokens: int = Form(1024)
):
    return {"rephrased_text": rephrase_text(text, temperature, max_tokens)}

@app.post("/cover-letter")
async def cover_letter_endpoint(
    resume: UploadFile = File(...),
    job_desc: str = Form(...),
    temperature: float = Form(0.5),
    max_tokens: int = Form(1024)
):
    parsed_resume = parse_uploaded_file(resume)
    resume_text = parsed_resume.get("raw_text", "") or parsed_resume.get("parsed_text", "")
    return {"cover_letter": generate_cover_letter(resume_text, job_desc, temperature, max_tokens)}

@app.post("/interview-questions")
async def interview_questions_endpoint(
    job_desc: str = Form(...),
    temperature: float = Form(0.5),
    max_tokens: int = Form(1024)
):
    return {"interview_questions": generate_interview_questions(job_desc, temperature, max_tokens)}

@app.get("/")
async def root():
    return {
        "message": "Welcome to the ATS Resume Analyzer Pro API",
        "routes": {
            "/parse": "Parse PDF or DOCX resume into text.",
            "/ats-test": "Analyze resume using Groq ATS model.",
            "/rephrase": "Rephrase text according to ATS standards.",
            "/cover-letter": "Generate cover letter based on resume and job description.",
            "/interview-questions": "Generate interview questions based on job description."
        }
    }
