# Skill Hub — Final Implementation Plan (Approved)

## Decisions Locked

| Decision | Answer |
|----------|--------|
| **AI Stack** | 🎯 Skill-Task Matcher + 🤖 Auto-Standup + 🔥 Burnout Radar + 📊 Sprint Forecaster |
| Real-time Updates | ✅ Firestore `onSnapshot` listeners for live task/comment updates |
| Notification Delivery | ✅ In-app only (Firestore writes) |
| Team Invitations | ✅ Generate invite links/codes |
| Kanban DnD | ✅ Include `@dnd-kit` library |
| File Attachments | ✅ Firebase Storage for task attachments |

---

## Existing Foundation (Already Built)

| Layer | What Exists |
|-------|-------------|
| Backend | `server.js`, `lib/firebase.js`, `middleware/errorHandler.js`, `routes/tasks.js` (basic CRUD) |
| Frontend | `App.jsx` (task list UI), `index.css` (full Glassmorphism tokens), `firebaseConfig.js` |
| Infra | Dockerfile, CI/CD pipeline, Firebase project, Cloud Run config |

---

## Part 1 — Backend Architecture

### Directory Structure (Target)

```
backend/
├── server.js                         # Express app entry (EXISTS)
├── lib/
│   ├── firebase.js                   # Admin SDK init (EXISTS)
│   └── gemini.js                     # [NEW] Gemini API client
├── middleware/
│   ├── errorHandler.js               # Zod error handler (EXISTS)
│   ├── authenticate.js               # [NEW] Firebase token verification
│   └── validate.js                   # [NEW] Zod validation wrapper
├── schemas/
│   ├── task.schema.js                # [NEW] Task Zod schemas
│   ├── team.schema.js                # [NEW] Team Zod schemas
│   ├── user.schema.js                # [NEW] User/profile Zod schemas
│   ├── notification.schema.js        # [NEW] Notification schemas
│   └── invite.schema.js              # [NEW] Invite code schemas
├── controllers/
│   ├── auth.controller.js            # [NEW] Register, getCurrentUser
│   ├── dashboard.controller.js       # [NEW] Stats, activity feed
│   ├── task.controller.js            # [NEW] Full task CRUD (replaces route logic)
│   ├── team.controller.js            # [NEW] Team CRUD + membership
│   ├── profile.controller.js         # [NEW] Profile read/update
│   ├── notification.controller.js    # [NEW] Notification CRUD
│   ├── ai.controller.js              # [NEW] Skill matching, standup gen
│   └── upload.controller.js          # [NEW] File attachment handling
├── routes/
│   ├── auth.routes.js                # [NEW]
│   ├── dashboard.routes.js           # [NEW]
│   ├── tasks.js                      # [MODIFY] Refactor to use controller
│   ├── team.routes.js                # [NEW]
│   ├── profile.routes.js             # [NEW]
│   ├── notification.routes.js        # [NEW]
│   ├── ai.routes.js                  # [NEW] AI feature endpoints
│   └── upload.routes.js              # [NEW] File upload endpoints
└── utils/
    └── response.js                   # [NEW] Standardized JSON helpers
```

### Route Definitions

#### Auth — `/api/auth`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `POST` | `/register` | ✅ | `registerSchema` | Create user doc on first login |
| `GET` | `/me` | ✅ | — | Return current user profile |

#### Dashboard — `/api/dashboard`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `GET` | `/stats` | ✅ | — | Task counts by status, team count, velocity |
| `GET` | `/activity` | ✅ | — | Last 20 activity log entries |
| `GET` | `/health-map` | ✅ | — | 🔥 Burnout Radar — team workload heatmap |
| `GET` | `/standup` | ✅ | — | 🤖 Auto-generated daily standup digest |

#### Tasks — `/api/tasks`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `GET` | `/` | ✅ | — | List tasks (filter by status, assignee, team, sprint) |
| `GET` | `/:id` | ✅ | — | Single task + comments + attachments |
| `POST` | `/` | ✅ | `createTaskSchema` | Create task |
| `PUT` | `/:id` | ✅ | `updateTaskSchema` | Update task fields |
| `DELETE` | `/:id` | ✅ | — | Soft-delete task |
| `POST` | `/:id/comments` | ✅ | `commentSchema` | Add comment |
| `PATCH` | `/:id/status` | ✅ | `statusSchema` | Transition status (logs to activity) |
| `POST` | `/:id/attachments` | ✅ | multipart | Upload file attachment |

#### Teams — `/api/teams`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `GET` | `/` | ✅ | — | List user's teams |
| `GET` | `/:id` | ✅ | — | Team detail + members |
| `POST` | `/` | ✅ | `createTeamSchema` | Create team |
| `PUT` | `/:id` | ✅ | `updateTeamSchema` | Update team |
| `DELETE` | `/:id` | ✅ | — | Delete team (owner only) |
| `POST` | `/:id/invite` | ✅ | — | Generate invite code |
| `POST` | `/join/:code` | ✅ | — | Join team via invite code |
| `DELETE` | `/:id/members/:uid` | ✅ | — | Remove member |

#### Profile — `/api/profile`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `GET` | `/` | ✅ | — | Get own profile |
| `PUT` | `/` | ✅ | `updateProfileSchema` | Update profile + skills |

#### Notifications — `/api/notifications`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `GET` | `/` | ✅ | — | List notifications (paginated) |
| `PATCH` | `/:id/read` | ✅ | — | Mark one read |
| `PATCH` | `/read-all` | ✅ | — | Mark all read |

#### AI Features — `/api/ai`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `POST` | `/suggest-assignee` | ✅ | `suggestSchema` | 🎯 Skill-match: suggest top assignees for a task |
| `GET` | `/standup/:teamId` | ✅ | — | 🤖 Generate standup for a team |
| `GET` | `/burnout/:teamId` | ✅ | — | 🔥 Team workload intensity scores |
| `GET` | `/forecast/:teamId` | ✅ | — | 📊 Sprint completion probability |

#### Upload — `/api/upload`
| Method | Path | Auth? | Schema | Description |
|--------|------|:-----:|--------|-------------|
| `POST` | `/` | ✅ | multipart | Upload file to Firebase Storage |
| `DELETE` | `/:fileId` | ✅ | — | Delete uploaded file |

---

### Zod Schemas

#### `task.schema.js`
```js
createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  assigneeId: z.string().optional(),
  teamId: z.string(),
  sprintId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string()).max(10).optional(),
  requiredSkills: z.array(z.string()).max(10).optional(), // For AI skill matching
});
updateTaskSchema = createTaskSchema.partial();
statusSchema = z.object({ status: z.enum(['todo', 'in_progress', 'review', 'done']) });
commentSchema = z.object({ text: z.string().min(1).max(1000) });
```

#### `team.schema.js`
```js
createTeamSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});
updateTeamSchema = createTeamSchema.partial();
```

#### `user.schema.js`
```js
registerSchema = z.object({
  displayName: z.string().min(1).max(100),
  email: z.string().email(),
});
updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  skills: z.array(z.string().max(50)).max(20).optional(), // Core skill profile
  avatarUrl: z.string().url().optional(),
  role: z.string().max(100).optional(),
});
```

#### `invite.schema.js`
```js
joinTeamSchema = z.object({ code: z.string().length(8) });
```

---

### Firestore Collections

#### `users/{uid}`
```json
{
  "uid": "firebase-auth-uid",
  "email": "user@example.com",
  "displayName": "Jane Doe",
  "bio": "Full-stack developer",
  "role": "Frontend Engineer",
  "skills": ["React", "TypeScript", "CSS", "Node.js"],
  "avatarUrl": "https://...",
  "teamIds": ["team1", "team2"],
  "velocityHistory": [          // For Sprint Forecaster
    { "sprintId": "s1", "planned": 8, "completed": 6, "date": "..." }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### `teams/{teamId}`
```json
{
  "name": "Engineering",
  "description": "Core product team",
  "ownerId": "uid",
  "members": [
    { "uid": "user1", "role": "owner", "joinedAt": "..." },
    { "uid": "user2", "role": "member", "joinedAt": "..." }
  ],
  "inviteCode": "A7Xk9mQ2",
  "inviteCodeExpiry": "2026-06-01T...",
  "currentSprintId": "sprint1",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### `tasks/{taskId}`
```json
{
  "title": "Build login page",
  "description": "...",
  "status": "in_progress",
  "priority": "high",
  "creatorId": "uid",
  "assigneeId": "uid",
  "teamId": "team1",
  "sprintId": "sprint1",
  "dueDate": "2026-05-15T...",
  "tags": ["frontend", "auth"],
  "requiredSkills": ["React", "Firebase Auth"],
  "attachments": [
    { "name": "mockup.png", "url": "gs://...", "uploadedBy": "uid", "uploadedAt": "..." }
  ],
  "completedAt": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### `tasks/{taskId}/comments/{commentId}`
```json
{
  "text": "Looks good, approved!",
  "authorId": "uid",
  "createdAt": "..."
}
```

#### `notifications/{notificationId}`
```json
{
  "recipientId": "uid",
  "type": "task_assigned | status_changed | comment_added | team_invite | burnout_alert",
  "message": "You were assigned to 'Build login page'",
  "referenceId": "taskId",
  "referenceType": "task | team",
  "read": false,
  "createdAt": "..."
}
```

#### `activityLog/{logId}`
```json
{
  "actorId": "uid",
  "action": "task_created | task_status_changed | comment_added | member_joined",
  "entityType": "task | team",
  "entityId": "taskId",
  "teamId": "team1",
  "metadata": { "from": "todo", "to": "in_progress" },
  "createdAt": "..."
}
```

#### `sprints/{sprintId}`
```json
{
  "teamId": "team1",
  "name": "Sprint 12",
  "startDate": "2026-05-01T...",
  "endDate": "2026-05-15T...",
  "taskIds": ["t1", "t2", "t3"],
  "status": "active",
  "forecast": {
    "completionProbability": 0.73,
    "optimistic": "2026-05-13",
    "realistic": "2026-05-15",
    "pessimistic": "2026-05-18"
  },
  "createdAt": "..."
}
```

#### `standupDigests/{digestId}`
```json
{
  "teamId": "team1",
  "date": "2026-05-02",
  "summaries": [
    {
      "uid": "user1",
      "displayName": "Abishek",
      "completed": ["Login page UI (#42)"],
      "inProgress": ["API auth middleware (#38)"],
      "blocked": ["Waiting on Firebase config (#41)"],
      "velocity": "on_track"
    }
  ],
  "generatedAt": "..."
}
```

---

## Part 2 — Frontend Screens

### Screen Inventory (14 Screens)

| # | Screen | Route | Layout Type | Key Components |
|---|--------|-------|-------------|----------------|
| 1 | **Login** | `/login` | Centered card | Email/password inputs, Google OAuth btn, register link |
| 2 | **Register** | `/register` | Centered card | Name, email, password, skills multi-select, terms |
| 3 | **Dashboard** | `/` | Bento grid | Stat cards, activity feed, health heatmap, standup digest, sprint progress |
| 4 | **Kanban Board** | `/tasks` | 4-col kanban | DnD columns (Todo/InProgress/Review/Done), task cards, filter bar |
| 5 | **Task List** | `/tasks?view=list` | Data table | Sortable columns, filters, search, bulk actions |
| 6 | **Task Detail** | `/tasks/:id` | Side panel | Full info, comments thread, attachments, AI assignee suggestion, status controls |
| 7 | **Create/Edit Task** | Modal | Form | All fields + AI skill-match suggestion |
| 8 | **Teams List** | `/teams` | Card grid | Team cards with member count, role badge, invite code |
| 9 | **Team Detail** | `/teams/:id` | Split layout | Team info + members + team tasks + bus factor mini-badge |
| 10 | **Create/Edit Team** | Modal | Form | Name, description |
| 11 | **Profile** | `/profile` | Card layout | Avatar, name, bio, skill tags (editable), velocity chart |
| 12 | **Notifications** | `/notifications` | List | Notification items with icon, message, time, read/unread |
| 13 | **AI Insights Panel** | `/insights` | Bento grid | 🔥 Burnout heatmap, 📊 Sprint forecast chart, 🤖 Standup feed, 🎯 Skill gaps |
| 14 | **Settings** | `/settings` | Form | Team management, invite codes, notification preferences |

### Shared Components (12)

| Component | Description |
|-----------|-------------|
| `Navbar` | Top bar — logo, nav links, notification bell (with unread count), user avatar dropdown |
| `Sidebar` | Collapsible desktop nav — Dashboard, Tasks, Teams, Insights, Profile |
| `GlassCard` | Reusable glassmorphism panel |
| `Modal` | Accessible overlay (ESC close, focus trap, backdrop click) |
| `StatusBadge` | Color-coded status pills |
| `PriorityBadge` | Priority indicator with icon |
| `Avatar` | User avatar with fallback initials |
| `SkillTag` | Editable skill chip/tag |
| `EmptyState` | Friendly empty states |
| `Toast` | Success/error notification toasts |
| `Skeleton` | Loading skeletons |
| `HealthIndicator` | Green/Yellow/Orange/Red circle for burnout radar |

---

## Part 3 — Google Stitch Design System & Screens

### Design System Tokens

| Token | Value |
|-------|-------|
| **Primary Color** | `#6c63ff` (Indigo) |
| **Font Family** | Inter |
| **Corner Roundness** | Large (16px) |
| **Appearance** | Dark mode — `#0a0a14` background |
| **Saturation** | Medium-High |
| **Design MD** | Glassmorphism panels, bento-grid layouts, translucent cards with backdrop blur, subtle gradient accents, WCAG accessible |

### Screen Generation Order

1. Login + Register (auth flow)
2. Dashboard (bento grid with AI widgets)
3. Kanban Board (4-column DnD)
4. Task Detail (side panel with comments + AI suggestion)
5. Teams List + Team Detail
6. Profile (skill tags + velocity chart)
7. AI Insights (burnout heatmap + sprint forecast)
8. Notifications
9. Settings

---

## Verification Plan

### Automated
- All Zod schemas: unit tests via Vitest
- All shared components: render tests via Vitest + Testing Library
- Auth middleware: mock token verification test
- API integration: health check + CRUD smoke tests

### Manual
- `npm run dev` both frontend + backend
- Verify all API routes via browser DevTools / Postman
- Review Stitch screens for responsiveness + design consistency
- WCAG compliance check (focus states, ARIA, contrast)
