# ──────────────────────────────────────────────────────────
# Stage 1: Build — compile React frontend with Vite
# ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build

# Declare build-args so Vite can bake Firebase config at build time
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID

# Expose as ENV so Vite's import.meta.env picks them up
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID

WORKDIR /app/frontend

# Install dependencies first (layer caching)
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

# Copy source and build static assets
COPY frontend/ ./
RUN npm run build

# ──────────────────────────────────────────────────────────
# Stage 2: Production — lightweight Express server
# ──────────────────────────────────────────────────────────
FROM node:22-alpine AS production

WORKDIR /app/backend

# Install production dependencies only
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --omit=dev

# Copy backend source
COPY backend/ ./

# Copy built frontend from Stage 1 into the path server.js expects
COPY --from=build /app/frontend/dist /app/frontend/dist

# Cloud Run requires port 8080
EXPOSE 8080
ENV NODE_ENV=production

CMD ["node", "server.js"]
