# Skill Hub — Frontend Screen Specification

## Design Philosophy
- **Glassmorphism & Bento-Grid**: Translucent panels with backdrop blur, structured grid layouts
- **Dark Mode First**: Background `#0a0a14`, glass surfaces `rgba(255,255,255,0.04)`
- **Accent**: Indigo `#6c63ff` with pink gradient `#ff6ec7`
- **Typography**: Inter, 700 headings / 400 body
- **Responsive**: Desktop-first with mobile breakpoints at 768px and 480px
- **Accessibility**: WCAG AA compliant — ARIA labels, focus states, keyboard navigable

---

## Screen 1: Login
- **Route**: `/login`
- **Layout**: Centered card on dark background with subtle radial gradients
- **Elements**:
  - App logo + title "Skill Hub"
  - Email input field
  - Password input field
  - "Sign In" primary button
  - "Sign in with Google" OAuth button (with Google icon)
  - "Don't have an account? Register" link
- **Responsive**: Card becomes full-width on mobile with extra padding

## Screen 2: Register
- **Route**: `/register`
- **Layout**: Centered card (slightly taller than login)
- **Elements**:
  - App logo + title
  - Display Name input
  - Email input
  - Password input + Confirm Password input
  - Skills multi-select / tag input (e.g., React, Node.js, Python)
  - "Create Account" primary button
  - "Already have an account? Sign In" link
- **Responsive**: Single column stack on mobile

## Screen 3: Dashboard
- **Route**: `/` (authenticated)
- **Layout**: Bento-grid (2×3 on desktop, 1-col on mobile)
- **Widgets**:
  1. **Stat Cards Row** (4 mini cards): Total Tasks, In Progress, Completed, Teams
  2. **🤖 AI Standup Digest**: Today's auto-generated standup summaries per team member
  3. **📊 Sprint Progress**: Circular progress ring + forecast probability badge
  4. **🔥 Team Health Heatmap**: Grid of member avatars with green/yellow/orange/red glow indicators
  5. **Recent Activity Feed**: Scrollable list of recent actions (task created, status changed, etc.)
  6. **Quick Actions**: "New Task" + "New Team" buttons
- **Responsive**: Cards stack vertically on mobile

## Screen 4: Kanban Board
- **Route**: `/tasks`
- **Layout**: 4-column horizontal scroll with drag-and-drop
- **Columns**: Todo | In Progress | Review | Done
- **Each Column**:
  - Column header with task count badge
  - Droppable zone (via @dnd-kit)
  - "+" button to quick-add task to that column
- **Task Card** (draggable):
  - Title (truncated to 2 lines)
  - Priority badge (color-coded dot)
  - Assignee avatar (small circle)
  - Due date (if set)
  - Tags (max 2 shown + "+N")
  - 🎯 AI suggestion indicator (sparkle icon if AI-suggested assignee)
- **Filter Bar** (top):
  - Search input
  - Filter by: Assignee, Priority, Tags, Sprint
  - View toggle: Kanban | List
- **Responsive**: Columns become swipeable horizontal tabs on mobile

## Screen 5: Task List View
- **Route**: `/tasks?view=list`
- **Layout**: Full-width data table
- **Columns**: Checkbox | Title | Status | Priority | Assignee | Due Date | Tags
- **Features**:
  - Sortable column headers (click to sort)
  - Search + filter bar (same as kanban)
  - Bulk status update (select multiple → change status)
  - Pagination or infinite scroll
- **Responsive**: Horizontal scroll with sticky first column on mobile

## Screen 6: Task Detail
- **Route**: `/tasks/:id` (renders as side panel overlay)
- **Layout**: Right-side slide-out panel (60% width desktop, full-width mobile)
- **Sections**:
  - **Header**: Title, status dropdown, priority dropdown, close button
  - **Meta**: Assignee avatar + name, creator, team, sprint, due date, created date
  - **🎯 AI Suggestion Banner**: "AI recommends: Priya (92% skill match)" with accept/dismiss
  - **Description**: Rich text area (editable inline)
  - **Tags**: Editable tag chips
  - **Attachments**: File list with upload button, preview thumbnails
  - **Comments Thread**: Chronological comment list with author avatar, text, timestamp + "Add comment" input at bottom
  - **Activity Log**: Mini timeline of status changes
- **Responsive**: Full-screen modal on mobile

## Screen 7: Create / Edit Task Modal
- **Route**: Modal overlay (no route change)
- **Layout**: Centered modal with backdrop
- **Fields**:
  - Title (text input, required)
  - Description (textarea)
  - Status (dropdown: todo/in_progress/review/done)
  - Priority (dropdown: low/medium/high/urgent)
  - Assignee (user search/select with avatar)
  - Team (dropdown)
  - Sprint (dropdown)
  - Due Date (date picker)
  - Tags (multi-input chips)
  - Required Skills (multi-input chips — for AI matching)
  - File Attachments (drag-drop zone)
- **AI Feature**: After filling "Required Skills", show 🎯 "Suggested Assignees" section
- **Actions**: "Create Task" / "Save Changes" primary button, "Cancel" secondary

## Screen 8: Teams List
- **Route**: `/teams`
- **Layout**: Card grid (3-col desktop, 2-col tablet, 1-col mobile)
- **Each Team Card**:
  - Team name (bold)
  - Description (truncated)
  - Member count + stacked member avatars (max 4 shown)
  - Your role badge (Owner/Member)
  - Created date
- **Actions**: "Create Team" floating action button
- **Responsive**: Cards fill available width

## Screen 9: Team Detail
- **Route**: `/teams/:id`
- **Layout**: Split — top section info, bottom section tabs
- **Top Section**:
  - Team name + description
  - Invite code badge (click to copy) + "Regenerate" button
  - Owner actions: Edit, Delete
- **Tab Bar**: Members | Tasks | Insights
- **Members Tab**:
  - Member list with avatar, name, role badge, joined date
  - Owner: Remove member button per row
- **Tasks Tab**:
  - Filtered kanban/list showing only this team's tasks
- **Insights Tab**:
  - 🔥 Mini burnout heatmap for this team
  - 🧠 Bus factor summary
- **Responsive**: Tabs become full-width stacked on mobile

## Screen 10: Create / Edit Team Modal
- **Route**: Modal overlay
- **Fields**:
  - Team name (text input)
  - Description (textarea)
- **Actions**: "Create Team" / "Save" + "Cancel"

## Screen 11: Profile
- **Route**: `/profile`
- **Layout**: Card-based — profile card + stats card side by side
- **Profile Card**:
  - Large avatar (with edit/upload option)
  - Display name (editable)
  - Email (read-only)
  - Bio (editable textarea)
  - Role/Title (editable)
  - Skills (editable tag chips — add/remove)
- **Stats Card**:
  - Tasks completed (all time)
  - Current active tasks
  - Teams joined
  - Velocity trend chart (mini line chart — last 5 sprints)
- **Responsive**: Cards stack vertically on mobile

## Screen 12: Notifications
- **Route**: `/notifications`
- **Layout**: Full-width list
- **Each Notification Item**:
  - Icon (by type: task assigned = 📋, status changed = 🔄, comment = 💬, invite = 👥, burnout alert = 🔥)
  - Message text
  - Timestamp (relative: "2 hours ago")
  - Read/unread indicator (blue dot)
  - Click → navigates to referenced entity
- **Actions**: "Mark all read" button at top
- **Responsive**: Full-width, compact items on mobile

## Screen 13: AI Insights
- **Route**: `/insights`
- **Layout**: Bento grid (2×2 desktop)
- **Widgets**:
  1. **🔥 Burnout Radar**: Team health heatmap — each member as a card with their workload intensity (green/yellow/orange/red), task count, velocity trend
  2. **📊 Sprint Forecaster**: Probability gauge (73% likely to complete), optimistic/realistic/pessimistic dates, bar chart of tasks remaining vs. capacity
  3. **🤖 Standup History**: Last 7 days of auto-generated standups, expandable per day
  4. **🎯 Skill Coverage**: Team skill matrix — which skills are covered, which are single-person (bus factor warning)
- **Responsive**: Single column on mobile

## Screen 14: Settings
- **Route**: `/settings`
- **Layout**: Stacked sections
- **Sections**:
  - **Account**: Change display name, update avatar
  - **Notification Preferences**: Toggle per notification type
  - **Team Management**: List teams, leave team
  - **Danger Zone**: Delete account
- **Responsive**: Full-width sections

---

## Shared Components

| Component | Used In |
|-----------|---------|
| `Navbar` | All authenticated screens |
| `Sidebar` | All authenticated screens (desktop) |
| `BottomNav` | All authenticated screens (mobile) |
| `GlassCard` | Dashboard, Teams, Profile, Insights |
| `Modal` | Create/Edit Task, Create/Edit Team |
| `StatusBadge` | Kanban, Task List, Task Detail |
| `PriorityBadge` | Kanban, Task List, Task Detail |
| `Avatar` | Everywhere with user references |
| `SkillTag` | Profile, Task Detail, Register |
| `EmptyState` | Any empty list/grid |
| `Toast` | Success/error feedback across app |
| `Skeleton` | Loading states across app |
| `HealthIndicator` | Dashboard heatmap, Insights, Team Detail |
| `SparkleIcon` | AI suggestion indicators |
