import re
import nltk
import numpy as np
from nltk.tokenize import sent_tokenize
from nltk.corpus import stopwords
from huggingface_hub import InferenceClient
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
_model = None
_hf_client = None

def _safe_sent_tokenize(text: str):
    try:
        return sent_tokenize(text)
    except Exception:
        # Basic fallback if punkt resources are unavailable.
        return [s.strip() for s in re.split(r"[.!?]+", text) if s.strip()]

def _get_local_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
        except Exception as e:
            raise RuntimeError(
                "Local embedding backend requires sentence-transformers. "
                "Install local ML deps or set EMBEDDING_BACKEND=hf."
            ) from e
        _model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _model

def _get_hf_client():
    global _hf_client
    if _hf_client is None:
        if not settings.HF_API_TOKEN:
            raise RuntimeError("HF_API_TOKEN is required when EMBEDDING_BACKEND=hf.")
        _hf_client = InferenceClient(token=settings.HF_API_TOKEN)
    return _hf_client

def _encode_sentences(sentences):
    if not sentences:
        return np.zeros((0, 1), dtype=np.float32)

    backend = (settings.EMBEDDING_BACKEND or "hf").lower()
    if backend == "hf":
        client = _get_hf_client()
        vectors = client.feature_extraction(sentences, model=settings.EMBEDDING_MODEL)
        arr = np.asarray(vectors, dtype=np.float32)
        if arr.ndim == 1:
            arr = arr.reshape(1, -1)
        return arr

    model = _get_local_model()
    vectors = model.encode(sentences, convert_to_numpy=True, normalize_embeddings=False)
    arr = np.asarray(vectors, dtype=np.float32)
    if arr.ndim == 1:
        arr = arr.reshape(1, -1)
    return arr

def _mean_max_cosine_similarity(source_embeddings: np.ndarray, target_embeddings: np.ndarray) -> float:
    if source_embeddings.size == 0 or target_embeddings.size == 0:
        return 0.0

    a = source_embeddings / (np.linalg.norm(source_embeddings, axis=1, keepdims=True) + 1e-8)
    b = target_embeddings / (np.linalg.norm(target_embeddings, axis=1, keepdims=True) + 1e-8)
    scores = np.matmul(a, b.T)
    max_per_source = np.max(scores, axis=1)
    return float(np.mean(max_per_source))

def calculate_ats_score(resume_text: str, job_description: str):
    if not resume_text or not job_description:
        return {"error": "Missing input"}

    resume_text = resume_text.lower()
    job_description = job_description.lower()

    # 1. Keywords Match
    try:
        stop_words = set(stopwords.words('english'))
    except Exception:
        stop_words = set()
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
    resume_sents = _safe_sent_tokenize(resume_text)
    jd_sents = _safe_sent_tokenize(job_description)
    
    try:
        resume_embeddings = _encode_sentences(resume_sents)
        jd_embeddings = _encode_sentences(jd_sents)
        semantic_similarity = _mean_max_cosine_similarity(jd_embeddings, resume_embeddings)
    except Exception as e:
        return {"error": f"Embedding backend error: {str(e)}"}
    
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
