from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    GROQ_API_KEY: str = ""
    MODEL_NAME: str = "llama-3.1-8B-Instant"
    EMBEDDING_MODEL: str = "BAAI/bge-large-en"
    EMBEDDING_BACKEND: str = "hf"  # "hf" (recommended for Render) or "local"
    HF_API_TOKEN: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings():
    return Settings()
