import os
import tempfile
from typing import Tuple

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.services import ai_service, ats_service, parser_service

router = APIRouter()
SUPPORTED_FILE_SUFFIXES = {".pdf", ".docx"}


async def _save_upload_to_tempfile(upload: UploadFile) -> Tuple[str, str]:
    suffix = os.path.splitext(upload.filename or "")[1].lower()
    if suffix not in SUPPORTED_FILE_SUFFIXES:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await upload.read())
        return tmp.name, suffix


def _remove_file_if_exists(file_path: str) -> None:
    if os.path.exists(file_path):
        os.remove(file_path)


@router.post("/parse")
async def parse_resume(
    file: UploadFile = File(None),
    resume: UploadFile = File(None),
):
    upload = file or resume
    if upload is None:
        raise HTTPException(status_code=422, detail="Field required: file or resume")

    tmp_path, _ = await _save_upload_to_tempfile(upload)

    try:
        result = parser_service.parse_file(tmp_path)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    finally:
        _remove_file_if_exists(tmp_path)


@router.post("/ats-test")
async def ats_test(
    resume: UploadFile = File(...),
    job_desc: str = Form(""),
    use_ai: bool = Form(True)
):
    tmp_path, _ = await _save_upload_to_tempfile(resume)

    try:
        parsed_data = parser_service.parse_file(tmp_path)
        if "error" in parsed_data:
            raise HTTPException(status_code=500, detail=parsed_data["error"])
        
        resume_text = parsed_data.get("raw_text", "")
        
        # Calculate scores
        heuristic_results = ats_service.calculate_ats_score(resume_text, job_desc)
        
        response = {
            "filename": resume.filename,
            "heuristic_analysis": heuristic_results,
            "parsed_data": {k: v for k, v in parsed_data.items() if k != "raw_text"}
        }
        
        if use_ai:
            ai_analysis = ai_service.analyze_resume(resume_text, job_desc)
            response["ai_analysis"] = ai_analysis
        
        return response
    finally:
        _remove_file_if_exists(tmp_path)


@router.post("/analyze")
async def analyze_text(
    resume_text: str = Form(...),
    job_desc: str = Form(None),
    temperature: float = Form(0.3)
):
    analysis = ai_service.analyze_resume(resume_text, job_desc, temperature)
    return {"analysis": analysis}


@router.post("/rephrase")
async def rephrase(text: str = Form(...)):
    prompt = f"Rephrase the following resume bullet point to be more impact-oriented and ATS-friendly: {text}"
    result = ai_service.generate_ai_response(prompt, "You are a professional resume writer.")
    return {"rephrased_text": result}
