import re
import nltk
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from nltk import pos_tag
from sentence_transformers import SentenceTransformer, util
from app.core.config import get_settings

# Download necessary NLTK data
def download_nltk_data():
    try:
        nltk.download('punkt', quiet=True)
        nltk.download('averaged_perceptron_tagger', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('punkt_tab', quiet=True)
        nltk.download('averaged_perceptron_tagger_eng', quiet=True)
    except Exception as e:
        print(f"NLTK download error: {e}")

download_nltk_data()

settings = get_settings()
# Lazy loading model to avoid overhead if not used immediately
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model

def calculate_ats_score(resume_text: str, job_description: str):
    if not resume_text or not job_description:
        return {"error": "Missing input"}

    resume_text = resume_text.lower()
    job_description = job_description.lower()
    model = get_model()

    # 1. Keywords Match
    stop_words = set(stopwords.words('english'))
    job_tokens = {w for w in re.findall(r"\b\w+\b", job_description) if w not in stop_words and len(w) > 2}
    resume_tokens = {w for w in re.findall(r"\b\w+\b", resume_text) if w not in stop_words and len(w) > 2}
    matched = resume_tokens & job_tokens
    
    keyword_score = (len(matched) / max(len(job_tokens), 1)) * 100

    # 2. Section Detection
    ats_sections = {
        "summary": ["summary", "profile", "overview", "professional summary"],
        "experience": ["experience", "work experience", "employment", "professional experience"],
        "education": ["education", "qualifications", "academics", "academic background"],
        "skills": ["skills", "technical skills", "expertise", "competencies"],
        "projects": ["projects", "work samples", "portfolio", "personal projects"],
    }
    sections_detected = {sec: any(k in resume_text for k in kws) for sec, kws in ats_sections.items()}
    section_score = (sum(sections_detected.values()) / len(ats_sections)) * 100

    # 3. Semantic Similarity
    resume_sents = sent_tokenize(resume_text)
    jd_sents = sent_tokenize(job_description)
    
    resume_embeddings = model.encode(resume_sents, convert_to_tensor=True)
    jd_embeddings = model.encode(jd_sents, convert_to_tensor=True)
    
    cos_scores = util.pytorch_cos_sim(jd_embeddings, resume_embeddings)
    max_sim_per_jd = cos_scores.max(dim=1).values
    semantic_similarity = max_sim_per_jd.mean().item()
    
    # Combined Score
    # Weightage: 30% Keywords, 20% Sections, 50% Semantic
    final_score = (keyword_score * 0.3) + (section_score * 0.2) + (semantic_similarity * 100 * 0.5)

    # Missing Keywords recommendations
    missing_keywords = sorted(list(job_tokens - resume_tokens))[:15]

    return {
        "ats_score": round(final_score, 2),
        "keyword_match_percent": round(keyword_score, 2),
        "section_coverage_percent": round(section_score, 2),
        "semantic_similarity_percent": round(semantic_similarity * 100, 2),
        "sections_detected": sections_detected,
        "matched_keywords": sorted(list(matched)),
        "missing_keywords": missing_keywords
    }
