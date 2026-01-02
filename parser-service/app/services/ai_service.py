from groq import Groq
from app.core.config import get_settings

settings = get_settings()
client = Groq(api_key=settings.GROQ_API_KEY)

def generate_ai_response(prompt: str, system_prompt: str, temperature: float = 0.5, max_tokens: int = 1500):
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
