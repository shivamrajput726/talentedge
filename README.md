# 🚀 TalentEdge: AI-Powered Capability Mapper

![Main Screen Mockup](https://raw.githubusercontent.com/shivamrajput726/AccuKnox-_problem1/main/assets/hero.png)

[![Backend CI](https://github.com/shivamrajput726/AccuKnox-_problem1/actions/workflows/ci.yml/badge.svg)](https://github.com/shivamrajput726/AccuKnox-_problem1/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker)](https://www.docker.com/)

**TalentEdge** is a premium, full-stack application designed to decode technical depth from GitHub repositories. Using AI (LangChain + GPT-4), it provides recruiters with an interactive capability map, skill heatmaps, and a technical summary that goes far beyond a traditional resume.

---

## ✨ Key Features

- 🤖 **AI Deep Analysis**: Scans repo structure, code quality, and documentation to map skills.
- 🎨 **Premium UI/UX**: Built with Vite, React, and Tailwind CSS for a sleek, glassmorphic look.
- 📊 **Recruiter Dashboard**: Interactive skill scorecards and technical summaries.
- 🐳 **Enterprise Ready**: Fully dockerized with multi-stage builds and internal networking.
- 🚀 **CI/CD Integration**: Automated testing and build pipelines via GitHub Actions.

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, LangChain, OpenAI GPT-4.
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion.
- **DevOps**: Docker, Docker Compose, GitHub Actions.

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- OpenAI API Key

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/shivamrajput726/AccuKnox-_problem1.git
   cd AccuKnox-_problem1
   ```
2. Create a `.env` file:
   ```env
   OPENAI_API_KEY=your_key_here
   DATABASE_URL=postgresql://user:password@db:5432/talentedge
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

---

## 📂 Project Structure

```text
├── .github/workflows/  # CI/CD Pipelines
├── backend/            # FastAPI Project
│   ├── app/
│   │   ├── api/        # Endpoints
│   │   ├── services/   # AI Logic (LangChain)
│   │   └── models/     # DB Schemas
├── frontend/           # React/Vite Project
│   ├── src/            # Components & Logic
├── Dockerfile          # Multi-stage production build
└── docker-compose.yml  # Orchestration
```

---

## 📌 Implementation Details

### AI Capability Mapping
TalentEdge uses a tailored LangChain prompt to parse repository metadata and README contents. It calculates a "Technical Confidence Score" for various domains based on the density and complexity of code found.

### Production Readiness
The project includes:
- **Environment specific configs**
- **Efficient multi-stage Docker builds**
- **Automated CI workflows for every PR**
- **Robust error handling and schema validation**

---

Built with ❤️ by [Shivam Rajput](https://github.com/shivamrajput726)
