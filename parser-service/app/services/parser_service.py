import os
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
