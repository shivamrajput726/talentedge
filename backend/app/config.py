import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "TalentEdge API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/talentedge")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")
    GITHUB_TOKEN: str = os.getenv("GITHUB_TOKEN")

settings = Settings()
