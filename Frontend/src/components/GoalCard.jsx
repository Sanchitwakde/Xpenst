const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function GoalCard({ goal }) {
    const current = Number(goal.current || 0);
    const target = Number(goal.target || 0);
    const progress = target ? Math.min(100, Math.round((current / target) * 100)) : 0;

    return (
        <article className="goal-card">
            <div className="goal-card__head">
                <div>
                    <h3>{goal.title}</h3>
                    <p>{goal.category || 'Savings goal'}</p>
                </div>

                <span className="chip">{progress}%</span>
            </div>

            <div className="goal-card__numbers">
                <strong>{formatCurrency(current)}</strong>
                <span>of {formatCurrency(target)}</span>
            </div>

            <div className="progress">
                <span className="progress__bar" style={{ width: `${progress}%` }} />
            </div>

            <div className="goal-card__foot">
                <span>Deadline</span>
                <strong>{goal.deadline || 'Flexible'}</strong>
            </div>
        </article>
    );
}