import {
    ArrowDownCircle,
    ArrowUpCircle,
    Landmark,
    PiggyBank,
    ShieldDollar,
    Target,
    Wallet,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getDashboard } from '../api/expenses';
import CategoryChart from '../components/CategoryChart';
import ExpenseTable from '../components/ExpenseTable';
import GoalCard from '../components/GoalCard';
import Loader from '../components/Loader';
import MonthlyChart from '../components/MonthlyChart';
import StatCard from '../components/StatCard';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

export default function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getDashboard();
                setDashboard(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const summaryCards = useMemo(() => {
        const summary = dashboard?.summary || {};

        return [
            {
                icon: Wallet,
                title: 'Account Balance',
                value: formatCurrency(summary.balance),
                change: `${summary.balanceChange || '+0%'} this month`,
                trend: summary.balanceTrend || 'up',
                tone: 'primary',
            },
            {
                icon: ArrowDownCircle,
                title: 'Monthly Expenses',
                value: formatCurrency(summary.expenses),
                change: `${summary.expenseChange || '+0%'} vs last month`,
                trend: summary.expenseTrend || 'down',
                tone: 'secondary',
            },
            {
                icon: ArrowUpCircle,
                title: 'Monthly Income',
                value: formatCurrency(summary.income),
                change: `${summary.incomeChange || '+0%'} growth`,
                trend: summary.incomeTrend || 'up',
                tone: 'primary',
            },
            {
                icon: PiggyBank,
                title: 'Savings',
                value: formatCurrency(summary.savings),
                change: `${summary.savingsChange || '+0%'} progress`,
                trend: summary.savingsTrend || 'up',
                tone: 'secondary',
            },
            {
                icon: ShieldDollar,
                title: 'Budget Remaining',
                value: formatCurrency(summary.budgetRemaining),
                change: `${summary.budgetChange || '+0%'} remaining`,
                trend: summary.budgetTrend || 'up',
                tone: 'primary',
            },
            {
                icon: Landmark,
                title: 'Investments',
                value: formatCurrency(summary.investments),
                change: `${summary.investmentChange || '+0%'} this month`,
                trend: summary.investmentTrend || 'up',
                tone: 'secondary',
            },
            {
                icon: Target,
                title: 'Goals Progress',
                value: `${summary.goalsProgress || 0}%`,
                change: `${summary.goalsChange || '+0%'} completed`,
                trend: summary.goalsTrend || 'up',
                tone: 'primary',
            },
        ];
    }, [dashboard]);

    if (loading) {
        return (
            <div className="stack">
                <Loader variant="card" count={4} />
                <Loader variant="card" count={3} />
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <section className="dashboard-main">
                <article className="hero">
                    <div>
                        <span className="badge">Premium finance dashboard</span>
                        <h1>Take control of every rupee you spend.</h1>
                        <p>
                            Track expenses, analyze spending patterns, and make smarter financial
                            decisions with Xpensto.
                        </p>
                    </div>

                    <div className="hero__glow">
                        <div className="hero__stat">
                            <span>Net worth outlook</span>
                            <strong>{formatCurrency(dashboard?.summary?.balance)}</strong>
                        </div>
                        <div className="hero__stat">
                            <span>Savings rate</span>
                            <strong>{dashboard?.summary?.savingsRate || '0%'} </strong>
                        </div>
                    </div>
                </article>

                {error ? <div className="error-banner">{error}</div> : null}

                <section className="stats-grid">
                    {summaryCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </section>

                <section className="chart-grid chart-grid--wide">
                    <MonthlyChart
                        title="Monthly Expense Flow"
                        subtitle="Track monthly expense performance across the current year."
                        data={dashboard?.monthlyTrend || []}
                        variant="bar"
                        dataKeys={[{ key: 'expense', color: '#60A5FA', name: 'Expenses' }]}
                    />

                    <CategoryChart
                        title="Expense Category Distribution"
                        subtitle="Your top categories and spending allocation."
                        data={dashboard?.categoryDistribution || []}
                    />
                </section>

                <section className="chart-grid">
                    <MonthlyChart
                        title="Income vs Expense"
                        subtitle="See cash movement and margin across the same timeline."
                        data={dashboard?.monthlyTrend || []}
                        variant="line"
                        dataKeys={[
                            { key: 'income', color: '#5EEAD4', name: 'Income' },
                            { key: 'expense', color: '#60A5FA', name: 'Expenses' },
                        ]}
                    />
                </section>

                <section className="panel">
                    <div className="section-header">
                        <div>
                            <h3 className="section-title">Recent Transactions</h3>
                            <p className="section-subtitle">Latest activity flowing into your ledger.</p>
                        </div>
                    </div>

                    <ExpenseTable
                        expenses={dashboard?.recentTransactions || []}
                        rowsPerPage={5}
                        showPagination={false}
                    />
                </section>
            </section>

            <aside className="dashboard-side">
                <section className="panel widget-card">
                    <div className="section-header">
                        <h3 className="section-title">Recent Bills</h3>
                    </div>

                    <div className="widget-list">
                        {(dashboard?.recentBills || []).map((bill) => (
                            <div className="widget-item" key={`${bill.title}-${bill.dueDate}`}>
                                <div>
                                    <strong>{bill.title}</strong>
                                    <span>{bill.dueDate}</span>
                                </div>
                                <strong>{formatCurrency(bill.amount)}</strong>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="panel widget-card">
                    <div className="section-header">
                        <h3 className="section-title">Upcoming Payments</h3>
                    </div>

                    <div className="widget-list">
                        {(dashboard?.upcomingPayments || []).map((payment) => (
                            <div className="widget-item" key={`${payment.title}-${payment.dueDate}`}>
                                <div>
                                    <strong>{payment.title}</strong>
                                    <span>{payment.dueDate}</span>
                                </div>
                                <strong>{formatCurrency(payment.amount)}</strong>
                            </div>
                        ))}
                    </div>
                </section>

                {dashboard?.goal ? <GoalCard goal={dashboard.goal} /> : null}

                <section className="panel widget-card">
                    <div className="section-header">
                        <h3 className="section-title">Top Spending Category</h3>
                    </div>

                    <div className="top-category">
                        <strong>{dashboard?.topCategory?.name || 'No data'}</strong>
                        <p>{formatCurrency(dashboard?.topCategory?.amount)}</p>
                        <span>{dashboard?.topCategory?.share || '0%'} of total expenses</span>
                    </div>
                </section>

                <section className="panel widget-card">
                    <div className="section-header">
                        <h3 className="section-title">Quick Actions</h3>
                    </div>

                    <div className="quick-actions">
                        <button type="button" className="btn btn-primary">Add Expense</button>
                        <button type="button" className="btn btn-secondary">Add Income</button>
                        <button type="button" className="btn btn-ghost">Export Report</button>
                    </div>
                </section>
            </aside>
        </div>
    );
}