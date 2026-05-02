# System Architecture

## Monorepo Structure
We are using a single repository containing both client and server code, deployed as a single container to Google Cloud Run.

/ (Root)
├── /frontend          # Vite React application
│   ├── /src
│   │   ├── /components
│   │   ├── /views
│   │   └── firebaseConfig.js
│   └── package.json
├── /backend           # Express Node.js API
│   ├── /controllers
│   ├── /middleware
│   ├── /routes
│   ├── server.js
│   └── package.json
├── /docs              # Ground truth and AI context files
├── Dockerfile         # Multi-stage build
└── .github/
    └── workflows/
        └── deploy.yml # Cloud Run CI/CD

## Deployment Strategy
1. **Frontend Build:** Vite builds static assets into `frontend/dist`.
2. **Backend Server:** Express serves `frontend/dist` as static files and handles all `/api/*` routes.
3. **Cloud Run:** The entire app is deployed as a single container.
4. **Firebase:** Used exclusively for **Auth** and **Firestore** (Database). Firebase Hosting is **not** used.

## Data Flow
1. User authenticates via React frontend using Firebase Client SDK.
2. React fetches data from Express `/api/*` endpoints, attaching the Firebase ID token in the Authorization header.
3. Express validates the token using Firebase Admin SDK.
4. Express validates the request payload using Zod.
5. Express reads/writes to Firestore and returns standard JSON responses.