import { useEffect, useMemo, useState } from 'react';
import { getGoals } from '../api/expenses';
import GoalCard from '../components/GoalCard';
import Loader from '../components/Loader';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadGoals = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getGoals();
                setGoals(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadGoals();
    }, []);

    const summary = useMemo(() => {
        return goals.reduce(
            (acc, goal) => {
                acc.current += Number(goal.current || 0);
                acc.target += Number(goal.target || 0);
                return acc;
            },
            { current: 0, target: 0 }
        );
    }, [goals]);

    if (loading) return <Loader variant="card" count={4} />;

    return (
        <div className="stack">
            <section className="panel">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Goals</h1>
                        <p className="section-subtitle">
                            Keep long-term targets visible so savings progress stays deliberate.
                        </p>
                    </div>
                </div>

                {error ? <div className="error-banner">{error}</div> : null}

                <div className="summary-strip">
                    <div className="info-tile">
                        <span>Total saved</span>
                        <strong>{formatCurrency(summary.current)}</strong>
                    </div>
                    <div className="info-tile">
                        <span>Total target</span>
                        <strong>{formatCurrency(summary.target)}</strong>
                    </div>
                    <div className="info-tile">
                        <span>Completion</span>
                        <strong>
                            {summary.target ? Math.round((summary.current / summary.target) * 100) : 0}%
                        </strong>
                    </div>
                </div>
            </section>

            <section className="card-grid">
                {goals.map((goal) => (
                    <GoalCard key={goal.id || goal.title} goal={goal} />
                ))}
            </section>

            <section className="panel">
                <div className="section-header">
                    <div>
                        <h3 className="section-title">Goal Timeline</h3>
                        <p className="section-subtitle">A compact list of target dates and completion progress.</p>
                    </div>
                </div>

                <div className="widget-list">
                    {goals.map((goal) => {
                        const progress = goal.target
                            ? Math.round((Number(goal.current || 0) / Number(goal.target || 0)) * 100)
                            : 0;

                        return (
                            <div className="widget-item" key={`timeline-${goal.id || goal.title}`}>
                                <div>
                                    <strong>{goal.title}</strong>
                                    <span>{goal.deadline || 'No deadline set'}</span>
                                </div>
                                <strong>{progress}%</strong>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}