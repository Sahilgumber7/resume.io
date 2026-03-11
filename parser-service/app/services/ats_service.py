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

def _mean_pool_to_vector(value) -> np.ndarray:
    """
    Normalize HF feature extraction output into a single 1D sentence vector.
    Handles token-level matrices by mean-pooling across token axis.
    """
    arr = np.asarray(value, dtype=np.float32)
    if arr.size == 0:
        return np.zeros((1,), dtype=np.float32)
    while arr.ndim > 1:
        arr = arr.mean(axis=0)
    return arr.astype(np.float32, copy=False)

def _normalize_hf_embeddings(raw_vectors, sentence_count: int) -> np.ndarray:
    """
    Convert varying HF output shapes into a stable [num_sentences, embedding_dim] matrix.
    """
    # Fast path: already numeric 2D with one row per sentence.
    try:
        arr = np.asarray(raw_vectors, dtype=np.float32)
        if arr.ndim == 2 and arr.shape[0] == sentence_count:
            return arr
        if arr.ndim == 1 and sentence_count == 1:
            return arr.reshape(1, -1)
    except Exception:
        pass

    # Common path: list where each item may be 1D (sentence embedding) or 2D (token embeddings).
    if isinstance(raw_vectors, list):
        if sentence_count == 1:
            return _mean_pool_to_vector(raw_vectors).reshape(1, -1)
        if len(raw_vectors) == sentence_count:
            pooled = [_mean_pool_to_vector(item) for item in raw_vectors]
            dims = [vec.shape[0] for vec in pooled]
            if len(set(dims)) != 1:
                raise RuntimeError(
                    f"Inconsistent embedding dimensions from HF: {dims[:10]}"
                )
            return np.vstack(pooled).astype(np.float32)

    raise RuntimeError("Unexpected HF embedding response shape.")

def _encode_sentences(sentences):
    if not sentences:
        return np.zeros((0, 1), dtype=np.float32)

    backend = (settings.EMBEDDING_BACKEND or "hf").lower()
    if backend == "hf":
        client = _get_hf_client()
        # HF inference may return sentence-level or token-level nested outputs.
        # Normalize all variants into consistent sentence embeddings.
        try:
            vectors = client.feature_extraction(sentences, model=settings.EMBEDDING_MODEL)
            return _normalize_hf_embeddings(vectors, len(sentences))
        except Exception:
            # Fallback: request embeddings per sentence and normalize each response.
            pooled = []
            for sentence in sentences:
                vec = client.feature_extraction(sentence, model=settings.EMBEDDING_MODEL)
                pooled.append(_mean_pool_to_vector(vec))
            dims = [vec.shape[0] for vec in pooled]
            if len(set(dims)) != 1:
                raise RuntimeError(
                    f"Inconsistent embedding dimensions across sentences: {dims[:10]}"
                )
            return np.vstack(pooled).astype(np.float32)

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


def _keyword_density_score(resume_text: str, matched_keywords: set) -> float:
    if not resume_text:
        return 0.0
    total_tokens = len(re.findall(r"\b\w+\b", resume_text))
    if total_tokens == 0:
        return 0.0
    hit_count = sum(resume_text.count(keyword) for keyword in matched_keywords)
    density = (hit_count / total_tokens) * 100
    # Soft cap to avoid over-weighting keyword stuffing.
    return float(min(density * 10, 100))


def _action_verb_score(resume_text: str) -> float:
    action_verbs = {
        "built", "delivered", "designed", "implemented", "led", "optimized",
        "improved", "created", "developed", "launched", "scaled", "reduced",
        "increased", "automated", "managed", "analyzed",
    }
    lines = [line.strip() for line in resume_text.splitlines() if line.strip()]
    if not lines:
        return 0.0
    verb_hits = 0
    for line in lines:
        first_word = re.findall(r"\b[a-z]+\b", line.lower())
        if first_word and first_word[0] in action_verbs:
            verb_hits += 1
    return float((verb_hits / len(lines)) * 100)


def _length_score(resume_text: str) -> float:
    words = re.findall(r"\b\w+\b", resume_text)
    count = len(words)
    if 350 <= count <= 900:
        return 100.0
    if 250 <= count < 350:
        return 80.0
    if 900 < count <= 1200:
        return 75.0
    if 150 <= count < 250:
        return 60.0
    return 40.0


def _build_recommendations(results: dict) -> list:
    recommendations = []
    if results.get("keyword_match_percent", 0) < 55:
        missing = results.get("missing_keywords", [])
        if missing:
            recommendations.append(
                f"Add role-specific keywords naturally in experience bullets (for example: {', '.join(missing[:8])})."
            )
        else:
            recommendations.append("Increase overlap with job-description terminology.")
    if results.get("section_coverage_percent", 0) < 80:
        recommendations.append("Add clear section headers for summary, experience, education, skills, and projects.")
    if results.get("semantic_similarity_percent", 0) < 65:
        recommendations.append("Align project and impact statements more closely with the role responsibilities.")
    if results.get("action_verb_percent", 0) < 35:
        recommendations.append("Start bullets with strong action verbs and include measurable outcomes.")
    if results.get("length_score_percent", 0) < 70:
        recommendations.append("Target a concise one-page resume with 350-900 words for better ATS readability.")
    return recommendations[:6]

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
    density_score = _keyword_density_score(resume_text, matched)

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
    action_verb_percent = _action_verb_score(resume_text)
    length_score_percent = _length_score(resume_text)

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
    # Weightage: semantic fit + basics + writing quality.
    final_score = (
        (keyword_score * 0.2)
        + (section_score * 0.15)
        + (semantic_similarity * 100 * 0.45)
        + (density_score * 0.1)
        + (action_verb_percent * 0.05)
        + (length_score_percent * 0.05)
    )

    # Missing Keywords recommendations
    missing_keywords = sorted(list(job_tokens - resume_tokens))[:15]

    results = {
        "ats_score": round(final_score, 2),
        "keyword_match_percent": round(keyword_score, 2),
        "section_coverage_percent": round(section_score, 2),
        "semantic_similarity_percent": round(semantic_similarity * 100, 2),
        "keyword_density_percent": round(density_score, 2),
        "action_verb_percent": round(action_verb_percent, 2),
        "length_score_percent": round(length_score_percent, 2),
        "sections_detected": sections_detected,
        "matched_keywords": sorted(list(matched)),
        "missing_keywords": missing_keywords
    }
    results["improvements"] = _build_recommendations(results)
    return results
