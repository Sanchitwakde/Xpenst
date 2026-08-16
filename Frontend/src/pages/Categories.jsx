import { useEffect, useMemo, useState } from 'react';
import { getCategories } from '../api/expenses';
import CategoryChart from '../components/CategoryChart';
import Loader from '../components/Loader';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getCategories();
                setCategories(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    const totalSpend = useMemo(
        () => categories.reduce((sum, item) => sum + Number(item.value || item.amount || 0), 0),
        [categories]
    );

    const topCategory = useMemo(() => {
        return [...categories].sort(
            (a, b) => Number(b.value || b.amount || 0) - Number(a.value || a.amount || 0)
        )[0];
    }, [categories]);

    if (loading) return <Loader variant="card" count={4} />;

    return (
        <div className="stack">
            <section className="panel">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Category Insights</h1>
                        <p className="section-subtitle">
                            Understand where money moves most and which categories need stricter control.
                        </p>
                    </div>
                </div>

                {error ? <div className="error-banner">{error}</div> : null}

                <div className="summary-strip">
                    <div className="info-tile">
                        <span>Total category spend</span>
                        <strong>{formatCurrency(totalSpend)}</strong>
                    </div>
                    <div className="info-tile">
                        <span>Top category</span>
                        <strong>{topCategory?.name || 'No data'}</strong>
                    </div>
                    <div className="info-tile">
                        <span>Category count</span>
                        <strong>{categories.length}</strong>
                    </div>
                </div>
            </section>

            <section className="chart-grid chart-grid--wide">
                <CategoryChart
                    title="Expense Category Distribution"
                    subtitle="An allocation view of how your categories compare."
                    data={categories.map((item) => ({
                        ...item,
                        value: item.value || item.amount || 0,
                    }))}
                />

                <section className="panel">
                    <div className="section-header">
                        <div>
                            <h3 className="section-title">Category Performance</h3>
                            <p className="section-subtitle">A detailed look at transaction volume and allocation.</p>
                        </div>
                    </div>

                    <div className="insight-grid">
                        {categories.map((item) => {
                            const amount = Number(item.value || item.amount || 0);
                            const share = totalSpend ? Math.round((amount / totalSpend) * 100) : 0;

                            return (
                                <article className="info-tile info-tile--wide" key={item.name}>
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p>{item.transactions || 0} transactions</p>
                                    </div>

                                    <div className="info-tile__meta">
                                        <strong>{formatCurrency(amount)}</strong>
                                        <span>{share}% share</span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            </section>
        </div>
    );
}