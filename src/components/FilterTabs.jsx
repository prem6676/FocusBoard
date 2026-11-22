import './FilterTabs.css';

export default function FilterTabs({ options, active, onChange }) {
  return (
    <div className="filter-tabs" role="tablist" aria-label="Filter tasks by status">
      {options.map((option) => {
        const isActive = option.value === active;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`filter-tabs__tab${isActive ? ' filter-tabs__tab--active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
            {typeof option.count === 'number' && (
              <span aria-hidden="true"> ({option.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
