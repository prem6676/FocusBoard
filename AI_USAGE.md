# AI Usage

## AI tools used

- Bolt.new was used to scaffold and generate the initial React application and page layouts.
- ChatGPT was used during manual review to inspect the generated source, identify missing wiring (global search, header navigation actions, and the Settings default-priority preference), and suggest targeted code corrections. All generated changes should be reviewed and tested by the developer before submission.

## Representative prompts

1. "Build a professional task management dashboard named FocusBoard with React, Vite and plain CSS: dark navy sidebar, white content area, green primary actions, four dynamic statistic cards, a three-slide Focus Notes carousel, and a task list with status and priority badges."
2. "Add create, edit and delete functionality for tasks using a reusable TaskForm component in a modal, with validation that rejects empty or whitespace-only titles, and a confirmation dialog before deleting."
3. "Persist the complete task dataset to localStorage under the key focusboard_tasks using a reusable useLocalStorage hook, loading sample data only when nothing is saved and handling invalid JSON safely."
4. "Make search (case-insensitive, partial match, while typing), status tabs and a priority dropdown filter together using derived data, and make the layout responsive at 1440px, 768px and 390px with a collapsible sidebar on mobile."

## AI-assisted implementation areas

- Overall component architecture and folder structure (reusable `StatCard`, `TaskForm`, `ConfirmDialog`, `FilterTabs`).
- The `useLocalStorage` hook, including the safe-JSON fallback that prevents overwriting valid saved data with sample data.
- Derived data with `useMemo` for filtered tasks and statistics instead of duplicated state.
- Per-component CSS organization, badge system, focus states, and responsive breakpoints.
- Accessibility details: labelled controls, `aria-invalid` / `role="alert"` on form errors, `role="dialog"` and `role="alertdialog"` on modals, and screen-reader-only labels.

## Reviewed or corrected suggestion

The assistant initially suggested persisting the visible (filtered) task list to localStorage so the UI would "restore exactly what the user saw." This was reviewed and rejected: persisting filtered results can silently drop tasks from storage whenever a filter is active, violating the requirement to keep the complete dataset. The correction was to persist the full task array only and treat search, status and priority filters as purely derived view state, recomputed on every render from the saved data.

## Manual review and corrections

- Connected the header search to the My Tasks view so searching from another page opens the filtered task list.
- Connected the header New Task action to open the task creation dialog.
- Connected the header notification and profile controls to Inbox and Settings.
- Wired the saved default-priority preference into newly created tasks.
- Ensured the header stylesheet is imported by the active App component.
