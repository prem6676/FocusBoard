import './StatCard.css';

export default function StatCard({ label, value, icon: Icon, tone, hint }) {
  return (
    <article className="stat-card" aria-label={`${label}: ${value}`}>
      <span className={`stat-card__icon stat-card__icon--${tone}`} aria-hidden="true">
        <Icon size={20} />
      </span>
      <div>
        <p className="stat-card__value">{value}</p>
        <p className="stat-card__label">{label}</p>
        {hint && (
          <div
            className="stat-card__track"
            role="progressbar"
            aria-valuenow={hint}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${label} progress`}
          >
            <div className="stat-card__fill" style={{ width: `${hint}%` }} />
          </div>
        )}
      </div>
    </article>
  );
}
