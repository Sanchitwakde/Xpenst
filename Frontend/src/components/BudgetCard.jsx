const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function BudgetCard({ budget }) {
    const spent = Number(budget.spent || 0);
    const limit = Number(budget.limit || 0);
    const progress = limit ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
    const remaining = Math.max(0, limit - spent);

    return (
        <article className="budget-card">
            <div className="budget-card__head">
                <div>
                    <h3>{budget.name}</h3>
                    <p>{budget.period || 'Current cycle'}</p>
                </div>

                <span className={`status-badge status-badge--${progress >= 90 ? 'overdue' : 'paid'}`}>
          {progress}% used
        </span>
            </div>

            <div className="budget-card__numbers">
                <strong>{formatCurrency(spent)}</strong>
                <span>of {formatCurrency(limit)}</span>
            </div>

            <div className="progress">
                <span className="progress__bar" style={{ width: `${progress}%` }} />
            </div>

            <div className="budget-card__foot">
                <span>Remaining</span>
                <strong>{formatCurrency(remaining)}</strong>
            </div>
        </article>
    );
}