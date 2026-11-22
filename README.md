
# FocusBoard

FocusBoard is a professional, fully functional task management dashboard built as a frontend developer technical assignment. It demonstrates React fundamentals, reusable components, state management, CRUD operations, filtering, search, localStorage persistence, responsive design, and clean code architecture.

## Features

- **Task CRUD** — create, edit and delete tasks through a reusable, validated form; deletion requires explicit confirmation.
- **Status management** — change any task's status inline (To do, In progress, Completed).
- **Statistics** — Total Tasks, In Progress, Completed, and Completion Percentage, all computed dynamically from the task data (safe with zero tasks).
- **Search** — case-insensitive, partial-match title search that filters while typing, with a clear button and dedicated empty state.
- **Filtering** — status tabs (All / To do / In progress / Completed) and a priority dropdown (All / Low / Medium / High) that combine with search via derived data.
- **Focus Notes carousel** — three slides with Previous/Next arrows, three clickable indicators with active highlighting, and circular navigation.
- **localStorage persistence** — tasks survive page refreshes; sample data is only used when nothing is saved; invalid JSON is handled safely.
- **Responsive design** — sidebar + content on desktop, adjusted grids on tablet, collapsible sidebar and stacked cards on mobile.
- **Accessibility** — semantic HTML, labelled form fields, accessible button names, visible focus states, keyboard-friendly modals, and status communicated with text plus color.
- **Dashboard** — live task and priority summaries, recent tasks, and upcoming deadlines.
- **Inbox** — automatically generated overdue, due-today, upcoming, and recently completed notifications.
- **Calendar** — month navigation, selectable dates, and tasks grouped by due date.
- **Reports** — live status and priority distributions plus completion progress.
- **Settings** — editable display name, light/dark theme, default task priority, and confirmed reset/clear actions.

## Technology stack

- React.js (functional components + hooks)
- Vite
- JavaScript ES6+
- Plain CSS3 (organized per-component CSS files)
- Lucide React (icons)
- Browser localStorage (persistence)

No backend, database, or authentication.

## Folder structure

```
src/
  components/
    Sidebar.jsx / Sidebar.css       # Dark navy navigation (collapsible on mobile)
    Header.jsx / Header.css         # Search, notifications, profile, New Task button
    StatCard.jsx / StatCard.css     # Reusable statistic card
    FocusNotes.jsx / FocusNotes.css # Three-slide carousel
    TaskList.jsx / TaskList.css     # Task list + empty states
    TaskCard.jsx                    # Single task row (badges, actions, inline status)
    badges.css                      # Shared status/priority/category badge styles
    FilterTabs.jsx / FilterTabs.css # Status tab group
    TaskForm.jsx / modals.css       # Reusable create/edit form modal
    ConfirmDialog.jsx               # Delete confirmation modal
    utilities.css                   # Screen-reader-only helper
  data/
    sampleTasks.js                  # Initial sample dataset (8 tasks)
    taskOptions.js                  # Status/priority option lists
    taskUtils.js                    # ID generation + date helpers
  hooks/
    useLocalStorage.js              # Reusable localStorage state hook
  App.jsx / App.css                 # Layout, state, derived data, CRUD handlers
  main.jsx                          # Entry point
  index.css                         # Design tokens + global styles
```

## Installation

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## State management

All task data lives in a single `useState` inside the `useLocalStorage` hook, held by `App.jsx` and passed down through props. State updates are immutable (`map`, `filter`, spread). There is no Redux and no duplicate filtered state — visible tasks are derived with `useMemo` from `tasks + search + statusFilter + priorityFilter`, and statistics are derived from `tasks` alone, so the dashboard can never drift out of sync.

## localStorage

- Storage key: `focusboard_tasks`.
- On startup, the `useLocalStorage` hook reads the key; if it is empty, the sample dataset is used, and if the stored value is invalid JSON, it falls back safely (never overwriting valid data).
- Every change to the task array is serialized back to localStorage via a `useEffect`, so refreshing the browser preserves all creates, edits, deletes and status changes.
- The complete task dataset is persisted, never a filtered subset.

## Deployment

Build the production bundle:

```bash
npm run build
```

The output in `dist/` is a static site. Deploy it to any static host (Vercel, Netlify, GitHub Pages, Cloudflare Pages, etc.) by uploading the `dist/` folder or connecting the repository and running `npm run build` as the build step.

