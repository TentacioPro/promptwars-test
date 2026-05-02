# Global AI Instructions & Conventions

As an agent operating in this workspace, you must adhere strictly to these rules:

## 1. Intent Over Syntax (Vibe Coding)
Prioritize fulfilling the functional intent over over-engineering. If a standard pattern exists (like standard Express routing), use it. Do not invent complex abstractions unless explicitly requested.

## 2. Design Constraints
* **Style:** Implement Glassmorphism (translucent backgrounds, subtle borders, background blur) and Bento-grid layouts.
* **Accessibility:** All UI components (especially Buttons and Inputs) MUST have ARIA labels, clear focus states, and be usable via keyboard only.

## 3. Code Quality & Validation
* **Backend:** EVERY controller must validate incoming data using a Zod schema. Wrap route handlers in a global error-handling middleware that catches Zod errors and returns standardized 400 responses.
* **Frontend:** Write a Vitest test for every core reusable UI component you generate.
* **Firebase:** Never expose the Firebase Admin SDK private keys in the codebase. Always use environment variables.

## 4. Communication
When asked to implement a feature, complete the implementation fully before requesting human review. If you encounter an ambiguity in the architecture, stop and ask a clarifying question.