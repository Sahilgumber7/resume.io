from groq import Groq
from app.core.config import get_settings

settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

def generate_ai_response(prompt: str, system_prompt: str, temperature: float = 0.5, max_tokens: int = 1500):
    if client is None:
        return "Error from AI Service: GROQ_API_KEY is not configured"

    try:
        response = client.chat.completions.create(
            model=settings.MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens,
            stream=False
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error from AI Service: {str(e)}"

def analyze_resume(resume_text: str, job_description: str = None, temperature: float = 0.3):
    if job_description:
        prompt = f"""
You are an expert ATS (Applicant Tracking System) evaluator.
Analyze the following resume in the context of the provided job description.
Provide:
1. Match percentage
2. Missing or weak keywords
3. Brief summary
4. Actionable recommendations

Job Description:
{job_description}

Resume:
{resume_text}
"""
    else:
        prompt = f"""
You are an expert ATS resume evaluator.
Analyze the following resume and provide:
1. Overall quality score (0-10)
2. Evaluation on Structure, Skills, and Impact
3. Improvement points

Resume:
{resume_text}
"""
    
    return generate_ai_response(
        prompt, 
        "You are an expert ATS resume analyzer. Respond in a structured format.", 
        temperature=temperature
    )


def analyze_linkedin_profile(
    profile_text: str,
    job_description: str = "",
    profile_url: str = "",
    temperature: float = 0.35
):
    prompt = f"""
You are an expert LinkedIn profile strategist.
Analyze the following LinkedIn profile content and provide:
1. Profile Strength Score (0-100)
2. Top strengths
3. Gaps in headline/about/experience/skills
4. Keyword opportunities for recruiter search
5. Concrete rewrite suggestions for headline and about section

LinkedIn URL (if provided): {profile_url}
Target Job Description (optional):
{job_description}

LinkedIn Profile Content:
{profile_text}
"""
    return generate_ai_response(
        prompt,
        "You are a LinkedIn optimization expert. Keep output structured and actionable.",
        temperature=temperature,
        max_tokens=1200,
    )


def generate_cover_letter(
    resume_text: str,
    job_description: str,
    company_name: str = "",
    hiring_manager: str = "",
    tone: str = "professional",
    temperature: float = 0.45,
):
    prompt = f"""
Write a tailored one-page cover letter using the information below.

Requirements:
- Tone: {tone}
- Mention relevant accomplishments from resume
- Align with job requirements and keywords
- Keep it concise and specific
- Use this salutation if available: {hiring_manager}
- Company name: {company_name}
- Return plain text only

Job Description:
{job_description}

Resume:
{resume_text}
"""
    return generate_ai_response(
        prompt,
        "You are an expert career coach and technical recruiter who writes strong cover letters.",
        temperature=temperature,
        max_tokens=1000,
    )
