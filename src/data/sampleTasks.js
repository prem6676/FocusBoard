import { toInputDate } from './taskUtils';

function dueDateFromToday(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return toInputDate(date);
}

export const sampleTasks = [
  {
    id: 'task-001',
    title: 'Finish onboarding flow copy',
    description:
      'Write and review the copy for the three-step onboarding flow so new users understand each screen before launch.',
    category: 'Content',
    status: 'In progress',
    priority: 'High',
    dueDate: dueDateFromToday(2),
  },
  {
    id: 'task-002',
    title: 'Design settings page mockups',
    description:
      'Create desktop and mobile mockups for the account settings page, including profile, password and notification sections.',
    category: 'Design',
    status: 'To do',
    priority: 'Medium',
    dueDate: dueDateFromToday(5),
  },
  {
    id: 'task-003',
    title: 'Fix mobile navigation overlap',
    description:
      'The hamburger menu overlaps the page content on screens under 400px wide. Reproduce the bug and ship a CSS fix.',
    category: 'Bug',
    status: 'To do',
    priority: 'High',
    dueDate: dueDateFromToday(1),
  },
  {
    id: 'task-004',
    title: 'Prepare weekly team report',
    description:
      'Summarize sprint progress, open blockers and next week priorities for the Monday team meeting.',
    category: 'Reporting',
    status: 'In progress',
    priority: 'Low',
    dueDate: dueDateFromToday(4),
  },
  {
    id: 'task-005',
    title: 'Update landing page hero',
    description:
      'Replace the headline, supporting paragraph and call-to-action button on the landing page hero section.',
    category: 'Marketing',
    status: 'Completed',
    priority: 'Medium',
    dueDate: dueDateFromToday(-2),
  },
  {
    id: 'task-006',
    title: 'Review pull requests',
    description:
      'Review the two open pull requests from the frontend team and leave actionable feedback before end of day.',
    category: 'Engineering',
    status: 'Completed',
    priority: 'High',
    dueDate: dueDateFromToday(-1),
  },
  {
    id: 'task-007',
    title: 'Plan Q3 content calendar',
    description:
      'Draft the first version of the Q3 content calendar covering blog posts, newsletters and social media campaigns.',
    category: 'Marketing',
    status: 'To do',
    priority: 'Low',
    dueDate: dueDateFromToday(9),
  },
  {
    id: 'task-008',
    title: 'Audit accessibility of dashboard',
    description:
      'Run the dashboard through keyboard-only navigation and a screen reader, then log any accessibility issues found.',
    category: 'Quality',
    status: 'In progress',
    priority: 'Medium',
    dueDate: dueDateFromToday(7),
  },
];
