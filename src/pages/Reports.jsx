import { useMemo } from 'react';
import { ClipboardList, Activity, CheckCircle2, Gauge } from 'lucide-react';
import StatCard from '../components/StatCard';
import { computeTaskStats, countByPriority } from '../data/taskStats';
import './pages.css';
import './pages-extras.css';

function Donut({ completed, remaining }) {
  const total = completed + remaining;
  const pct = total === 0 ? 0 : (completed / total) * 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const filled = (pct / 100) * circumference;

  return (
    <div className="donut" role="img" aria-label={`${Math.round(pct)} percent of tasks completed`}>
      <svg viewBox="0 0 140 140" width="170" height="170">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--gray-100)" strokeWidth="16" />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--green-500)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          transform="rotate(-90 70 70)"
        />
        <text x="70" y="66" textAnchor="middle" className="donut__value">
          {Math.round(pct)}%
        </text>
        <text x="70" y="86" textAnchor="middle" className="donut__label">
          completed
        </text>
      </svg>
      <p className="donut__caption">
        {completed} completed vs {remaining} remaining
      </p>
    </div>
  );
}

export default function Reports({ tasks }) {
  const stats = useMemo(() => computeTaskStats(tasks), [tasks]);
  const priorities = useMemo(() => countByPriority(tasks), [tasks]);

  const total = stats.total;
  const remaining = stats.pending;

  const insights = [];
  if (total === 0) {
    insights.push('No tasks yet — create a few in My Tasks to unlock productivity insights.');
  } else {
    if (stats.percentage >= 70) {
      insights.push(`Strong momentum: ${stats.percentage}% of all tasks are completed. Keep it up!`);
    } else if (stats.percentage >= 40) {
      insights.push(`You are ${stats.percentage}% of the way through your board. Steady progress.`);
    } else {
      insights.push(`Only ${stats.percentage}% of tasks are completed so far — pick one high-priority item and finish it today.`);
    }
    if (priorities.High > 0 && stats.completed < priorities.High) {
      insights.push(`${priorities.High} high-priority task${priorities.High === 1 ? '' : 's'} exist${priorities.High === 1 ? 's' : ''} on the board. Clear these first for the biggest impact.`);
    }
    if (stats.inProgress > 5) {
      insights.push(`${stats.inProgress} tasks are in progress at once. Finishing one before starting another keeps quality high.`);
    }
    if (stats.toDo > 0 && stats.inProgress === 0) {
      insights.push('Nothing is currently in progress. Move one "To do" task forward to build momentum.');
    }
  }

  return (
    <div className="pages">
      <div className="page-heading">
        <div>
          <h1 className="page-heading__title">Reports</h1>
          <p className="page-heading__subtitle">
            Productivity analytics calculated live from your task board.
          </p>
        </div>
      </div>

      <section aria-label="Report statistics">
        <div className="stat-grid">
          <StatCard label="Total Tasks" value={stats.total} icon={ClipboardList} tone="total" />
          <StatCard label="In Progress" value={stats.inProgress} icon={Activity} tone="progress" />
          <StatCard label="Completed" value={stats.completed} icon={CheckCircle2} tone="completed" />
          <StatCard
            label="Completion Percentage"
            value={`${stats.percentage}%`}
            icon={Gauge}
            tone="percentage"
            hint={stats.percentage}
          />
        </div>
      </section>

      <div className="stat-grid stat-grid--two" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <section className="panel" aria-label="Status distribution">
          <div className="panel__heading">
            <h2 className="panel__title">Status distribution</h2>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">To do</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill bar-row__fill--todo"
                style={{ width: `${total ? (stats.toDo / total) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-row__value">{stats.toDo}</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">In progress</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill bar-row__fill--inprogress"
                style={{ width: `${total ? (stats.inProgress / total) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-row__value">{stats.inProgress}</span>
          </div>
          <div className="bar-row">
            <span className="bar-row__label">Completed</span>
            <div className="bar-row__track">
              <div
                className="bar-row__fill bar-row__fill--completed"
                style={{ width: `${total ? (stats.completed / total) * 100 : 0}%` }}
              />
            </div>
            <span className="bar-row__value">{stats.completed}</span>
          </div>

          <div className="panel__heading" style={{ marginTop: 20 }}>
            <h2 className="panel__title">Priority distribution</h2>
          </div>
          {['Low', 'Medium', 'High'].map((priority) => (
            <div className="bar-row" key={priority}>
              <span className="bar-row__label">{priority}</span>
              <div className="bar-row__track">
                <div
                  className={`bar-row__fill bar-row__fill--${priority.toLowerCase()}`}
                  style={{ width: `${total ? (priorities[priority] / total) * 100 : 0}%` }}
                />
              </div>
              <span className="bar-row__value">{priorities[priority]}</span>
            </div>
          ))}
        </section>

        <section className="panel" aria-label="Completed versus remaining">
          <div className="panel__heading">
            <h2 className="panel__title">Completed vs remaining</h2>
          </div>
          <Donut completed={stats.completed} remaining={remaining} />
        </section>
      </div>

      <section className="panel" aria-label="Task completion insights">
        <div className="panel__heading">
          <h2 className="panel__title">Insights</h2>
        </div>
        <ul className="insights-list">
          {insights.map((insight) => (
            <li key={insight} className="insights-item">
              {insight}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
