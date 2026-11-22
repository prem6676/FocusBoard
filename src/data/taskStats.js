export function computeTaskStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === 'Completed').length;
  const inProgress = tasks.filter((task) => task.status === 'In progress').length;
  const toDo = tasks.filter((task) => task.status === 'To do').length;
  const pending = toDo + inProgress;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, inProgress, toDo, pending, percentage };
}

export function countByPriority(tasks) {
  return ['Low', 'Medium', 'High'].reduce(
    (acc, priority) => ({ ...acc, [priority]: tasks.filter((task) => task.priority === priority).length }),
    {}
  );
}

export function isOverdue(task, todayIso) {
  return task.status !== 'Completed' && task.dueDate < todayIso;
}

export function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
