export const TASK_STATUSES = ['To do', 'In progress', 'Completed'];

export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

export const STATUS_OPTIONS = TASK_STATUSES.map((status) => ({
  value: status,
  label: status,
}));

export const PRIORITY_OPTIONS = TASK_PRIORITIES.map((priority) => ({
  value: priority,
  label: priority,
}));
