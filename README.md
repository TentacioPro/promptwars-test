# Skill Hub — Team Coordination Platform

Skill Hub is a streamlined, accessible platform designed to improve team coordination and communication through simplified workflows and enhanced task visibility.

Built with a **Google-Native** stack and a modern **Glassmorphism** design aesthetic.

## 🚀 Quick Start (Local Development)

This repository is a monorepo containing both the frontend and backend. 

### 1. Prerequisites
- **Node.js**: Version 20 or higher
- **GCloud CLI**: Authenticated and set to project `promptwars-8a7cc`

### 2. Frontend Setup (Vite + React)
The frontend lives in the `/frontend` directory.

```bash
cd frontend
npm install
npm run dev
```
- **URL**: `http://localhost:5173`
- **Auth/DB**: Connected to Firebase project `promptwars-8a7cc`

### 3. Backend Setup (Express + Firebase Admin)
The backend lives in the `/backend` directory.

```bash
cd backend
npm install
npm run dev
```
- **URL**: `http://localhost:8080`
- **Services**: Uses Firebase Admin SDK for Firestore and Auth.

---

## 🏗️ Architecture & Stack

### Tech Stack
- **Frontend**: React 18, Vite, Firebase Client SDK (Auth, Analytics)
- **Backend**: Node.js, Express, Firebase Admin SDK (Firestore), Zod
- **Styling**: Vanilla CSS with Glassmorphism tokens and Bento-grid layouts
- **Deployment**: **Google Cloud Run** (Single-container strategy)
- **Note on Hosting**: We use Firebase for **Authentication** and **Database (Firestore)**, but we **ignore Firebase Hosting**. The entire application (React + Express) is served via Google Cloud Run.

### Monorepo Structure
```text
/
├── frontend/          # Vite + React 18 application
├── backend/           # Express Node.js API
├── .github/           # CI/CD workflows
└── Dockerfile         # Multi-stage build for production
```

---

## 🐳 Docker & Production

To build and run the production container locally:

```bash
docker build -t skill-hub .
docker run -p 8080:8080 skill-hub
```

The Dockerfile uses a multi-stage build:
1. **Stage 1 (Build)**: Compiles the React frontend using Vite.
2. **Stage 2 (Production)**: Sets up the Node.js Express server and copies the built frontend into it. The server serves the React app as static files.

---

## 🎨 Design Philosophy
- **Glassmorphism**: Translucent panels, subtle borders, and background blur.
- **Bento-Grid**: Structured, clean, and modern grid layouts.
- **Accessibility**: WCAG compliant with ARIA labels and strict keyboard navigability.

## 👤 Author
**Abishek Maharajan** — AI-Fullstack Engineer
- **LinkedIn**: [abishek-m-477125234](https://www.linkedin.com/in/abishek-m-477125234/)
- **Instagram**: [_abishek.m_](https://www.instagram.com/_abishek.m_)
