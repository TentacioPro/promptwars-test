# Skill Hub — Setup & Deployment Guide

## 🌐 Live Production URL

**https://skill-hub-844764849784.asia-south1.run.app**

---

## 📋 Project Credentials & Configuration

### GCP Project
| Key | Value |
|-----|-------|
| **Project Name** | Promptwars |
| **Project ID** | `promptwars-8a7cc` |
| **Project Number** | `844764849784` |
| **Region** | `asia-south1` (Mumbai) |
| **Billing Account** | `0122D5-FFD327-156FFF` (Trial) |

### Firebase
| Key | Value |
|-----|-------|
| **API Key** | `AIzaSyAZUm1apq27gRJ6D_WuS2aJ1if-xItP5GU` |
| **Auth Domain** | `promptwars-8a7cc.firebaseapp.com` |
| **Project ID** | `promptwars-8a7cc` |
| **Storage Bucket** | `promptwars-8a7cc.firebasestorage.app` |
| **Messaging Sender ID** | `844764849784` |
| **App ID** | `1:844764849784:web:997e831822a2dba3652f8d` |
| **Measurement ID** | `G-TK6WBFBMNP` |
| **Firestore Region** | `asia-southeast1` |

### GCP Services Enabled
| Service | Purpose |
|---------|---------|
| Cloud Run | Container hosting |
| Artifact Registry | Docker image storage |
| Cloud Build | Remote Docker builds |
| Secret Manager | Firebase SA key storage |
| IAM & IAM Credentials | Service account management |
| Firestore | Database |
| Firebase Auth | User authentication |
| Firebase Storage | File attachments |

### Cloud Run Service
| Key | Value |
|-----|-------|
| **Service Name** | `skill-hub` |
| **Image** | `asia-south1-docker.pkg.dev/promptwars-8a7cc/skill-hub/app:latest` |
| **Memory** | 512 Mi |
| **CPU** | 1 vCPU |
| **Port** | 8080 |
| **Auth** | Allow unauthenticated (public) |

### Secrets (GCP Secret Manager)
| Secret Name | Description |
|-------------|-------------|
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Admin SDK service account key (JSON) |

---

## 🖥️ Local Development Setup

### Prerequisites
- Node.js 22+
- Git
- Firebase service account JSON file (placed at project root)

### 1. Clone & Install

```bash
git clone https://github.com/TentacioPro/promptwars-test.git skill-hub
cd skill-hub

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=8080
GCLOUD_PROJECT=promptwars-8a7cc
FIREBASE_PROJECT_ID=promptwars-8a7cc
FIREBASE_STORAGE_BUCKET=promptwars-8a7cc.firebasestorage.app
GOOGLE_APPLICATION_CREDENTIALS=../promptwars-8a7cc-firebase-adminsdk-fbsvc-4ea0e88cec.json
GEMINI_API_KEY=            # Optional — for AI features
```

**Frontend** (`frontend/.env`):
```env
VITE_FIREBASE_API_KEY=AIzaSyAZUm1apq27gRJ6D_WuS2aJ1if-xItP5GU
VITE_FIREBASE_AUTH_DOMAIN=promptwars-8a7cc.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=promptwars-8a7cc
VITE_FIREBASE_STORAGE_BUCKET=promptwars-8a7cc.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=844764849784
VITE_FIREBASE_APP_ID=1:844764849784:web:997e831822a2dba3652f8d
VITE_FIREBASE_MEASUREMENT_ID=G-TK6WBFBMNP
```

### 3. Start Development Servers

```bash
# Terminal 1 — Backend (start FIRST)
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- Vite proxies `/api/*` requests to the backend automatically.

### 4. Verify the Flow

```bash
# Health check
curl http://localhost:8080/api/health

# List tasks
curl http://localhost:8080/api/tasks

# Create a task
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Hello world"}'
```

---

## 🐳 Docker Setup

### Local Docker Build & Run

```bash
# Build
docker build \
  --build-arg VITE_FIREBASE_API_KEY=AIzaSyAZUm1apq27gRJ6D_WuS2aJ1if-xItP5GU \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=promptwars-8a7cc.firebaseapp.com \
  --build-arg VITE_FIREBASE_PROJECT_ID=promptwars-8a7cc \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=promptwars-8a7cc.firebasestorage.app \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=844764849784 \
  --build-arg VITE_FIREBASE_APP_ID=1:844764849784:web:997e831822a2dba3652f8d \
  --build-arg VITE_FIREBASE_MEASUREMENT_ID=G-TK6WBFBMNP \
  -t skill-hub:latest .

# Run
docker run -p 8080:8080 \
  -e GCLOUD_PROJECT=promptwars-8a7cc \
  -e FIREBASE_STORAGE_BUCKET=promptwars-8a7cc.firebasestorage.app \
  -e FIREBASE_SERVICE_ACCOUNT_JSON="$(cat promptwars-8a7cc-firebase-adminsdk-*.json)" \
  skill-hub:latest
```

### Cloud Build (Remote Build & Push)

```bash
gcloud builds submit \
  --config=cloudbuild.yaml \
  --project=promptwars-8a7cc \
  --region=asia-south1 .
```

---

## ☁️ Cloud Run Deployment

### Manual Deploy

```bash
gcloud run deploy skill-hub \
  --image=asia-south1-docker.pkg.dev/promptwars-8a7cc/skill-hub/app:latest \
  --region=asia-south1 \
  --project=promptwars-8a7cc \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --set-env-vars="NODE_ENV=production,GCLOUD_PROJECT=promptwars-8a7cc,FIREBASE_STORAGE_BUCKET=promptwars-8a7cc.firebasestorage.app" \
  --set-secrets="FIREBASE_SERVICE_ACCOUNT_JSON=FIREBASE_SERVICE_ACCOUNT_JSON:latest"
```

### CI/CD (GitHub Actions)
The `.github/workflows/deploy.yml` pipeline automatically builds and deploys on every push to `main`.

**Required GitHub Secrets** (set in repo Settings → Secrets):
| Secret | Value |
|--------|-------|
| `GCP_PROJECT_ID` | `promptwars-8a7cc` |
| `WIF_PROVIDER` | Workload Identity Federation provider |
| `WIF_SERVICE_ACCOUNT` | GCP service account email |
| `VITE_FIREBASE_API_KEY` | `AIzaSyAZUm1apq27gRJ6D_WuS2aJ1if-xItP5GU` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `promptwars-8a7cc.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `promptwars-8a7cc` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `promptwars-8a7cc.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `844764849784` |
| `VITE_FIREBASE_APP_ID` | `1:844764849784:web:997e831822a2dba3652f8d` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-TK6WBFBMNP` |

---

## 🏗️ Architecture Overview

```
┌─────────────┐      ┌──────────────┐      ┌───────────────┐
│   Browser   │─────▶│  Cloud Run   │─────▶│   Firestore   │
│  React SPA  │      │  Express API │      │  (Database)   │
└─────────────┘      │  + Static    │      └───────────────┘
                     │    Files     │      ┌───────────────┐
                     │              │─────▶│ Firebase Auth │
                     └──────────────┘      └───────────────┘
                            │              ┌───────────────┐
                            └─────────────▶│ Firebase      │
                                           │ Storage       │
                                           └───────────────┘
```

**Single-container strategy**: Express serves both the API and the built React SPA from `/frontend/dist`.

---

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | List all tasks |
| `GET` | `/api/tasks/:id` | Get single task |
| `POST` | `/api/tasks` | Create task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `PATCH` | `/api/tasks/:id/status` | Update task status |
| `POST` | `/api/tasks/:id/comments` | Add comment |
| `GET` | `/api/dashboard/stats` | Dashboard statistics |
| `GET` | `/api/dashboard/activity` | Activity feed |
| `POST` | `/api/auth/register` | Register user |
| `GET` | `/api/auth/me` | Get current user |
| `GET/POST` | `/api/teams/*` | Team CRUD |
| `GET/PUT` | `/api/profile` | User profile |
| `GET/PATCH` | `/api/notifications/*` | Notifications |
| `POST` | `/api/ai/suggest-assignee` | AI skill matcher |
| `GET` | `/api/ai/standup/:teamId` | Auto standup |
| `GET` | `/api/ai/burnout/:teamId` | Burnout radar |
| `GET` | `/api/ai/forecast/:teamId` | Sprint forecaster |
| `POST` | `/api/upload` | File upload |

---

## 🛡️ Security Notes

- Firebase service account key is **never committed** to git (`.gitignore` + `.dockerignore`).
- In production, credentials are injected via **GCP Secret Manager**.
- The `authenticate` middleware is currently in **dev-mode** (passthrough when no token). Switch to `requireAuth` for production enforcement.
- All API inputs are validated via **Zod schemas**.

---

## 📊 Useful Commands

```bash
# View Cloud Run logs
gcloud run services logs read skill-hub --project=promptwars-8a7cc --region=asia-south1

# View Cloud Run service details
gcloud run services describe skill-hub --project=promptwars-8a7cc --region=asia-south1

# List Artifact Registry images
gcloud artifacts docker images list asia-south1-docker.pkg.dev/promptwars-8a7cc/skill-hub

# Access Secret Manager
gcloud secrets versions access latest --secret=FIREBASE_SERVICE_ACCOUNT_JSON --project=promptwars-8a7cc
```
