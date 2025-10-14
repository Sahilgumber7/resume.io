import io, os, re, tempfile
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sentence_transformers import SentenceTransformer, util
from nltk.tokenize import sent_tokenize
from nltk import pos_tag
from nltk.corpus import stopwords
from PyPDF2 import PdfReader
from docx import Document
from dotenv import load_dotenv
from groq import Groq
from parser import pdf_parser, docx_parser
import nltk

# --------------------
# Environment & Model
# --------------------
load_dotenv("../.env.local")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)
model = SentenceTransformer('BAAI/bge-large-en')

nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')

# --------------------
# FastAPI setup
# --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Resume Parser
# --------------------
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

# --------------------
# ATS Tester
# --------------------
@app.post("/ats-test")
async def ats_test(resume: UploadFile = File(...), job_desc: str = Form(...)):
    contents = await resume.read()
    suffix = os.path.splitext(resume.filename)[1].lower()
    
    # Extract text
    if suffix == ".pdf":
        reader = PdfReader(io.BytesIO(contents))
        resume_text = "".join([page.extract_text() or "" for page in reader.pages]).lower()
    elif suffix == ".docx":
        doc = Document(io.BytesIO(contents))
        resume_text = "\n".join([para.text for para in doc.paragraphs]).lower()
    else:
        return {"error": "Unsupported file format"}

    # Tokens
    stop_words = set(stopwords.words('english')) | {
        "a", "an", "the", "in", "on", "and", "of", "to", "for", "from", "with",
        "at", "by", "this", "that", "is", "it", "as", "are", "was", "be", "or"
    }
    job_tokens = {w for w in re.findall(r"\b\w+\b", job_desc.lower()) if w not in stop_words and len(w) > 2}
    resume_tokens = {w for w in re.findall(r"\b\w+\b", resume_text.lower()) if w not in stop_words and len(w) > 2}
    matched = resume_tokens & job_tokens

    # Sections
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

    # Semantic similarity
    resume_sents = sent_tokenize(resume_text)
    jd_sents = sent_tokenize(job_desc)
    resume_embeddings = model.encode(resume_sents, convert_to_tensor=True)
    jd_embeddings = model.encode(jd_sents, convert_to_tensor=True)
    cos_scores = util.cos_sim(jd_embeddings, resume_embeddings)
    max_sim_per_jd = cos_scores.max(dim=1).values
    semantic_similarity = max_sim_per_jd.mean().item()

    # Scoring
    section_score = sum(sections_detected.values()) * 5
    keyword_score = len(matched) / max(len(job_tokens), 1) * 35
    semantic_score = semantic_similarity * 60
    if semantic_similarity < 0.6:
        semantic_score *= 0.5
    ats_score = round(min(100, section_score + keyword_score + semantic_score), 2)

    # Suggestions
    suggestions = []
    missing_keywords = list(job_tokens - resume_tokens)
    if missing_keywords:
        job_kw_embeddings = model.encode(missing_keywords, convert_to_tensor=True)
        resume_embedding = model.encode(resume_text, convert_to_tensor=True)
        sims = util.cos_sim(job_kw_embeddings, resume_embedding).squeeze()
        ranked_keywords = sorted(zip(missing_keywords, sims.tolist()), key=lambda x: x[1])
        ignore = {"high", "good", "able", "using", "based", "help", "work", "team",
                  "time", "will", "you", "your", "well", "effort", "performing",
                  "leading", "cross", "reviewing", "responsible", "ensure", "support"}
        filtered_keywords = [
            kw for kw, score in ranked_keywords
            if kw not in ignore and kw not in stop_words and pos_tag([kw])[0][1].startswith(('NN','VB','JJ'))
        ]
        top_keywords = filtered_keywords[:17]
        if top_keywords:
            suggestions.append(f"Consider adding these relevant keywords: {', '.join(top_keywords)}.")
        else:
            suggestions.append("Your resume semantically covers most of the job description well.")
    else:
        suggestions.append("No missing keywords detected.")

    return {
        "ats_score": ats_score,
        "sections_detected": sections_detected,
        "semantic_similarity": round(semantic_similarity * 100, 2),
        "keyword_match": {
            "match_percent": round(len(matched)/max(len(job_tokens),1)*100,2),
            "matched_keywords": sorted(matched),
        },
        "improvements": suggestions,
    }

# --------------------
# Groq AI Resume Analysis
# --------------------
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
        Analyze the following resume for this job description:
        Job Description: {job_description}
        Resume: {resume_text}
        Provide actionable insights, no section markers, plain text analysis.
        """
    else:
        prompt = f"Analyze the following resume without a job description:\nResume: {resume_text}"

    ai_output = generate_response(prompt, "You are an expert ATS resume analyzer.", temperature, max_tokens)
    return JSONResponse(content={"ai_analysis": ai_output})