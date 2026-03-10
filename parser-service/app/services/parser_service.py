import os
import re
from typing import Callable, Dict, Optional

import fitz  # PyMuPDF
from docx import Document
from app.utils import text_utils

def parse_pdf(file_path: str) -> Optional[str]:
    text_parts = []
    try:
        doc = fitz.open(file_path)
        for page in doc:
            page_text = page.get_text("text") or ""
            if page_text:
                text_parts.append(page_text)
        doc.close()
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return None
    return "\n".join(text_parts)


def parse_docx(file_path: str) -> Optional[str]:
    try:
        doc = Document(file_path)
        lines = [para.text.strip() for para in doc.paragraphs if para.text and para.text.strip()]
        text = "\n".join(lines)
        return text
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
        return None


PARSERS: Dict[str, Callable[[str], Optional[str]]] = {
    ".pdf": parse_pdf,
    ".docx": parse_docx,
}


COMMON_JOB_TITLE_PATTERNS = [
    r"\bsoftware engineer\b",
    r"\bfull stack (developer|engineer)\b",
    r"\bfrontend (developer|engineer)\b",
    r"\bbackend (developer|engineer)\b",
    r"\bdata (analyst|scientist|engineer)\b",
    r"\bproduct manager\b",
    r"\bproject manager\b",
    r"\bui\/ux designer\b",
    r"\bdevops engineer\b",
]

SKILL_KEYWORDS = {
    "python", "java", "javascript", "typescript", "react", "next.js", "node.js",
    "django", "flask", "fastapi", "aws", "azure", "gcp", "docker", "kubernetes",
    "mysql", "postgresql", "mongodb", "redis", "git", "linux", "graphql", "rest",
    "html", "css", "tailwind", "c++", "c#", "go", "rust", "pandas", "numpy",
    "tensorflow", "pytorch", "scikit-learn", "spark",
}


def _extract_location(text: str) -> Optional[str]:
    if not text:
        return None
    # Lightweight heuristic for common resume location lines.
    for line in text.splitlines()[:20]:
        clean = line.strip()
        if not clean or len(clean) > 80:
            continue
        if "," in clean and any(ch.isdigit() for ch in clean) is False:
            return clean
    return None


def _extract_summary(sections: Dict[str, object]) -> str:
    if not isinstance(sections, dict):
        return ""
    summary_lines = sections.get("summary")
    if isinstance(summary_lines, list) and summary_lines:
        return " ".join(summary_lines[:5]).strip()
    other_lines = sections.get("other")
    if isinstance(other_lines, list) and other_lines:
        return " ".join(other_lines[:3]).strip()
    return ""


def _extract_job_title(text: str) -> Optional[str]:
    lower_text = text.lower()
    for pattern in COMMON_JOB_TITLE_PATTERNS:
        match = re.search(pattern, lower_text)
        if match:
            return match.group(0).title().replace("Ui/Ux", "UI/UX")
    return None


def _estimate_experience_years(text: str) -> Optional[float]:
    if not text:
        return None
    years = re.findall(r"\b(19\d{2}|20\d{2})\b", text)
    parsed_years = sorted({int(y) for y in years if 1900 <= int(y) <= 2099})
    if len(parsed_years) < 2:
        explicit = re.search(r"(\d+(?:\.\d+)?)\+?\s+years?", text.lower())
        if explicit:
            try:
                return float(explicit.group(1))
            except ValueError:
                return None
        return None
    span = max(parsed_years) - min(parsed_years)
    if span < 0 or span > 45:
        return None
    return float(span)


def _extract_top_skills(parsed: Dict[str, object]) -> list:
    sections = parsed.get("sections", {})
    lines = []
    if isinstance(sections, dict):
        skills_section = sections.get("skills")
        if isinstance(skills_section, list):
            lines.extend(skills_section)
        other = sections.get("other")
        if isinstance(other, list):
            lines.extend(other[:25])

    text = " ".join(lines).lower()
    hits = []
    for skill in SKILL_KEYWORDS:
        normalized = re.escape(skill)
        if re.search(rf"\b{normalized}\b", text):
            hits.append(skill)
    return sorted(hits)[:20]


def _build_quality_flags(parsed: Dict[str, object]) -> Dict[str, bool]:
    sections = parsed.get("sections", {})
    if not isinstance(sections, dict):
        sections = {}
    return {
        "has_name": bool(parsed.get("name")),
        "has_email": bool(parsed.get("email")),
        "has_phone": bool(parsed.get("phone")),
        "has_links": bool(parsed.get("links")),
        "has_experience_section": bool(sections.get("experience")),
        "has_education_section": bool(sections.get("education")),
        "has_skills_section": bool(sections.get("skills")),
    }


def extract_resume_data(text: str, file_type: str):
    if not text:
        return {}

    normalized_text = text_utils.clean_text(text)
    sections = text_utils.split_sections(normalized_text)

    parsed = {
        "schema_version": "2.0",
        "name": text_utils.extract_name(normalized_text),
        "email": text_utils.extract_email(normalized_text),
        "phone": text_utils.extract_phone(normalized_text),
        "links": text_utils.extract_links(normalized_text),
        "location": _extract_location(normalized_text),
        "sections": sections,
        "summary": _extract_summary(sections),
        "jobTitle": _extract_job_title(normalized_text),
        "raw_text": normalized_text,
    }

    parsed["contact"] = {
        "name": parsed["name"],
        "email": parsed["email"],
        "phone": parsed["phone"],
        "location": parsed["location"],
        "links": parsed["links"],
    }
    parsed["meta"] = {
        "file_type": file_type,
        "char_count": len(normalized_text),
        "line_count": len([line for line in normalized_text.splitlines() if line.strip()]),
        "section_count": len(sections),
        "detected_section_order": list(sections.keys()),
    }
    parsed["insights"] = {
        "estimated_experience_years": _estimate_experience_years(normalized_text),
        "top_skills": _extract_top_skills(parsed),
    }
    parsed["quality"] = _build_quality_flags(parsed)

    return parsed


def parse_file(file_path: str):
    suffix = os.path.splitext(file_path)[1].lower()
    parser = PARSERS.get(suffix)
    if parser is None:
        return {"error": "Unsupported file format"}

    text = parser(file_path)
    if text is None:
        return {"error": "Failed to extract text from file"}

    return extract_resume_data(text, suffix)
