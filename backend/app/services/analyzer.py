import os
import requests
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from ..config import settings
import json

class GitHubAnalyzer:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4-turbo", 
            temperature=0, 
            openai_api_key=settings.OPENAI_API_KEY
        )
        self.github_token = settings.GITHUB_TOKEN

    def fetch_repo_details(self, repo_url: str):
        # Extract owner and repo from URL
        parts = repo_url.rstrip('/').split('/')
        owner, repo = parts[-2], parts[-1]
        
        api_url = f"https://api.github.com/repos/{owner}/{repo}"
        headers = {"Authorization": f"token {self.github_token}"} if self.github_token else {}
        
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            return response.json()
        return None

    async def analyze_skills(self, repo_data: dict, readme_content: str):
        prompt = ChatPromptTemplate.from_template("""
        Analyze the following GitHub repository information and README content.
        Extract a list of technical skills, frameworks, and languages used.
        Provide a confidence score (0-1) for each skill.
        Also provide a 2-3 sentence summary of the project's technical complexity.

        Repo Data: {repo_data}
        README: {readme_content}

        Return the result as a JSON object with keys: "skills" (dict of skill:score) and "summary" (string).
        """)
        
        chain = prompt | self.llm
        result = await chain.ainvoke({
            "repo_data": json.dumps(repo_data),
            "readme_content": (readme_content or "")[:4000] # Truncate for token limits
        })
        
        try:
            return json.loads(result.content)
        except:
            return {"skills": {}, "summary": "Analysis failed to parse."}

analyzer_service = GitHubAnalyzer()
