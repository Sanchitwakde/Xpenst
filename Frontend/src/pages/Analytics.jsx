import { CalendarRange, Landmark, PiggyBank, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAnalytics } from '../api/expenses';
import CategoryChart from '../components/CategoryChart';
import Loader from '../components/Loader';
import MonthlyChart from '../components/MonthlyChart';
import StatCard from '../components/StatCard';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function Analytics() {
    const [range, setRange] = useState('monthly');
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getAnalytics(range);
                setAnalytics(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, [range]);

    if (loading) return <Loader variant="card" count={4} />;

    const summary = analytics?.summary || {};

    return (
        <div className="stack">
            <section className="panel">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Analytics Overview</h1>
                        <p className="section-subtitle">
                            Compare performance across time windows and identify spending patterns faster.
                        </p>
                    </div>

                    <div className="range-switch">
                        {['monthly', 'weekly', 'yearly'].map((item) => (
                            <button
                                key={item}
                                type="button"
                                className={`btn btn-pill ${range === item ? 'btn-pill--active' : ''}`}
                                onClick={() => setRange(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {error ? <div className="error-banner">{error}</div> : null}
            </section>

            <section className="stats-grid">
                <StatCard
                    icon={CalendarRange}
                    title="Monthly Summary"
                    value={formatCurrency(summary.monthlySpend)}
                    change={summary.monthlyChange || '+0% vs prior period'}
                    trend={summary.monthlyTrend || 'up'}
                />
                <StatCard
                    icon={Sparkles}
                    title="Highest Category"
                    value={summary.highestCategory || 'No data'}
                    change={summary.highestCategoryShare || '0% of total'}
                    trend="up"
                    tone="secondary"
                />
                <StatCard
                    icon={Landmark}
                    title="Average Daily Spend"
                    value={formatCurrency(summary.averageDailySpend)}
                    change={summary.averageChange || '+0%'}
                    trend={summary.averageTrend || 'down'}
                />
                <StatCard
                    icon={PiggyBank}
                    title="Savings Rate"
                    value={summary.savingsRate || '0%'}
                    change={summary.savingsChange || '+0%'}
                    trend={summary.savingsTrend || 'up'}
                    tone="secondary"
                />
            </section>

            <section className="chart-grid chart-grid--wide">
                <MonthlyChart
                    title="Spend Trend"
                    subtitle={`Your ${range} expense movement at a glance.`}
                    data={analytics?.trend || []}
                    variant="bar"
                    dataKeys={[{ key: 'expense', color: '#60A5FA', name: 'Expenses' }]}
                />

                <CategoryChart
                    title="Category Mix"
                    subtitle="Which categories dominate in this selected range."
                    data={analytics?.categoryDistribution || []}
                />
            </section>

            <section className="chart-grid">
                <MonthlyChart
                    title="Income vs Expense"
                    subtitle="See whether your inflow stays ahead of spending."
                    data={analytics?.comparison || []}
                    variant="line"
                    dataKeys={[
                        { key: 'income', color: '#5EEAD4', name: 'Income' },
                        { key: 'expense', color: '#60A5FA', name: 'Expenses' },
                    ]}
                />
            </section>
        </div>
    );
}