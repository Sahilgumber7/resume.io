from pydantic_settings import BaseSettings
from functools import lru_cache
import os

class Settings(BaseSettings):
    GROQ_API_KEY: str = "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"
    MODEL_NAME: str = "llama-3.1-8B-Instant"
    EMBEDDING_MODEL: str = "BAAI/bge-large-en"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings():
    return Settings()
