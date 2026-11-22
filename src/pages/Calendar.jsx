import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { toIsoDate } from '../data/taskStats';
import { formatDueDate } from '../data/taskUtils';
import './pages.css';
import './pages-extras.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function statusBadge(status) {
  if (status === 'Completed') return 'badge--completed';
  if (status === 'In progress') return 'badge--inprogress';
  return 'badge--todo';
}

function priorityBadge(priority) {
  if (priority === 'High') return 'badge--high';
  if (priority === 'Medium') return 'badge--medium';
  return 'badge--low';
}

export default function Calendar({ tasks }) {
  const todayIso = toIsoDate(new Date());
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(todayIso);

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (!map[task.dueDate]) map[task.dueDate] = [];
      map[task.dueDate].push(task);
    });
    return map;
  }, [tasks]);

  const { firstWeekday, daysInMonth } = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const last = new Date(viewYear, viewMonth + 1, 0);
    return { firstWeekday: first.getDay(), daysInMonth: last.getDate() };
  }, [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const goPreviousMonth = () => {
    const date = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  };

  const goNextMonth = () => {
    const date = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth());
  };

  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedTasks = tasksByDate[selectedDate] || [];

  return (
    <div className="pages">
      <div className="page-heading">
        <div>
          <h1 className="page-heading__title">Calendar</h1>
          <p className="page-heading__subtitle">Tasks appear on their due dates. Click a date to see its tasks.</p>
        </div>
        <div className="calendar-nav">
          <button type="button" className="calendar-nav__button" onClick={goPreviousMonth} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <span className="calendar-nav__label" aria-live="polite">{monthLabel}</span>
          <button type="button" className="calendar-nav__button" onClick={goNextMonth} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="panel" aria-label="Monthly calendar">
          <div className="calendar-grid" role="grid">
            {WEEKDAYS.map((weekday) => (
              <div key={weekday} className="calendar-grid__weekday" role="columnheader">
                {weekday}
              </div>
            ))}
            {cells.map((iso, index) => {
              if (iso === null) {
                return <div key={`empty-${index}`} className="calendar-grid__cell calendar-grid__cell--blank" />;
              }
              const dayTasks = tasksByDate[iso] || [];
              const dayNumber = Number(iso.slice(-2));
              const isToday = iso === todayIso;
              const isSelected = iso === selectedDate;
              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  aria-label={`${dayNumber} ${monthLabel}, ${dayTasks.length} task${dayTasks.length === 1 ? '' : 's'}`}
                  className={`calendar-grid__cell${isSelected ? ' calendar-grid__cell--selected' : ''}${
                    isToday ? ' calendar-grid__cell--today' : ''
                  }`}
                  onClick={() => setSelectedDate(iso)}
                >
                  <span className="calendar-grid__day">{dayNumber}</span>
                  {dayTasks.length > 0 && (
                    <span className="calendar-grid__dots" aria-hidden="true">
                      {dayTasks.slice(0, 3).map((task) => (
                        <span
                          key={task.id}
                          className={`calendar-grid__dot calendar-grid__dot--${
                            task.priority === 'High' ? 'high' : task.priority === 'Medium' ? 'medium' : 'low'
                          }`}
                        />
                      ))}
                    </span>
                  )}
                  {dayTasks.length > 3 && (
                    <span className="calendar-grid__more">+{dayTasks.length - 3}</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="panel calendar-side" aria-label={`Tasks for ${formatDueDate(selectedDate)}`}>
          <div className="panel__heading">
            <h2 className="panel__title">{formatDueDate(selectedDate)}</h2>
            {selectedDate === todayIso && <span className="panel__count">Today</span>}
          </div>
          {selectedTasks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon" aria-hidden="true">
                <CalendarDays size={22} />
              </span>
              <h3 className="empty-state__title">Nothing scheduled</h3>
              <p>No tasks are due on this date. Pick another day or add one in My Tasks.</p>
            </div>
          ) : (
            <ul className="calendar-task-list">
              {selectedTasks.map((task) => (
                <li key={task.id} className="calendar-task">
                  <p className="calendar-task__title">{task.title}</p>
                  <div className="calendar-task__badges">
                    <span className={`badge ${statusBadge(task.status)}`}>
                      <span className="badge-dot" aria-hidden="true" />
                      {task.status}
                    </span>
                    <span className={`badge ${priorityBadge(task.priority)}`}>
                      <span className="badge-dot" aria-hidden="true" />
                      {task.priority}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
