import { useEffect, useMemo, useState } from 'react';
import { getBudgets } from '../api/expenses';
import BudgetCard from '../components/BudgetCard';
import Loader from '../components/Loader';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadBudgets = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getBudgets();
                setBudgets(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBudgets();
    }, []);

    const totals = useMemo(() => {
        return budgets.reduce(
            (acc, item) => {
                acc.spent += Number(item.spent || 0);
                acc.limit += Number(item.limit || 0);
                return acc;
            },
            { spent: 0, limit: 0 }
        );
    }, [budgets]);

    if (loading) return <Loader variant="card" count={4} />;

    return (
        <div className="stack">
            <section className="panel">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Budgets</h1>
                        <p className="section-subtitle">
                            Keep category limits visible and spot overspending before it compounds.
                        </p>
                    </div>
                </div>

                {error ? <div className="error-banner">{error}</div> : null}

                <div className="summary-strip">
                    <div className="info-tile">
                        <span>Total budget</span>
                        <strong>{formatCurrency(totals.limit)}</strong>
                    </div>
                    <div className="info-tile">
                        <span>Total spent</span>
                        <strong>{formatCurrency(totals.spent)}</strong>
                    </div>
                    <div className="info-tile">
                        <span>Remaining</span>
                        <strong>{formatCurrency(Math.max(0, totals.limit - totals.spent))}</strong>
                    </div>
                </div>
            </section>

            <section className="card-grid">
                {budgets.map((budget) => (
                    <BudgetCard key={budget.id || budget.name} budget={budget} />
                ))}
            </section>

            <section className="panel">
                <div className="section-header">
                    <div>
                        <h3 className="section-title">Budget Summary</h3>
                        <p className="section-subtitle">A quick list for comparing each category limit.</p>
                    </div>
                </div>

                <div className="insight-grid">
                    {budgets.map((budget) => (
                        <article className="info-tile info-tile--wide" key={`summary-${budget.id || budget.name}`}>
                            <div>
                                <strong>{budget.name}</strong>
                                <p>{budget.period || 'Monthly budget'}</p>
                            </div>

                            <div className="info-tile__meta">
                                <strong>{formatCurrency(budget.spent)}</strong>
                                <span>of {formatCurrency(budget.limit)}</span>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}