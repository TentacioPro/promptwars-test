# Technical Stack (Google-Native)

## Frontend
* **Core:** React 18, Vite
* **State & Rendering:** Client-Side Rendering (CSR), local `useState`
* **Authentication:** Firebase Client SDK (Email/Password, Google Auth)
* **Database (Client):** Firebase Client SDK (Firestore)
* **Styling:** Custom Theme tokens/color hooks (Glassmorphism design system)
* **Testing:** Vitest for component self-validation

## Backend
* **Core:** Node.js, Express Server
* **Database (Admin):** Firebase Admin SDK (Firestore NoSQL)
* **Validation:** Zod schemas for all incoming request bodies
* **Security:** Firebase ID token verification middleware via Express

## Deployment
* **Platform:** Google Cloud Run (Containerized Express + React)
* **Containerization:** Multi-stage Dockerfile
* **CI/CD:** GitHub Actions `.github/workflows/deploy.yml`
* **Infrastructure Note:** Firebase is utilized strictly for **Auth** and **Firestore**. Hosting is managed by Google Cloud Run to provide a unified single-container deployment.