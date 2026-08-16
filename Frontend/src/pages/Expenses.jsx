import { Download, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
    createExpense,
    deleteExpense,
    getCategories,
    getExpenses,
    updateExpense,
} from '../api/expenses';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import FilterDropdown from '../components/FilterDropDown';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';


export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const [sortBy, setSortBy] = useState('newest');

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [expenseData, categoryData] = await Promise.all([
                getExpenses(),
                getCategories(),
            ]);

            setExpenses(Array.isArray(expenseData) ? expenseData : expenseData.content || []);
            setCategories(Array.isArray(categoryData) ? categoryData : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const categoryOptions = useMemo(() => {
        const base = categories.map((item) => ({
            value: item.name,
            label: item.name,
        }));

        return [{ value: 'all', label: 'All Categories' }, ...base];
    }, [categories]);

    const filteredExpenses = useMemo(() => {
        let next = [...expenses];

        if (search) {
            const term = search.toLowerCase();
            next = next.filter(
                (expense) =>
                    expense.title?.toLowerCase().includes(term) ||
                    expense.category?.toLowerCase().includes(term) ||
                    expense.paymentMethod?.toLowerCase().includes(term)
            );
        }

        if (category !== 'all') {
            next = next.filter((expense) => expense.category === category);
        }

        if (dateFrom) {
            next = next.filter((expense) => new Date(expense.date) >= new Date(dateFrom));
        }

        if (dateTo) {
            next = next.filter((expense) => new Date(expense.date) <= new Date(dateTo));
        }

        if (minAmount) {
            next = next.filter((expense) => Number(expense.amount) >= Number(minAmount));
        }

        if (maxAmount) {
            next = next.filter((expense) => Number(expense.amount) <= Number(maxAmount));
        }

        switch (sortBy) {
            case 'oldest':
                next.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'highest':
                next.sort((a, b) => Number(b.amount) - Number(a.amount));
                break;
            case 'lowest':
                next.sort((a, b) => Number(a.amount) - Number(b.amount));
                break;
            default:
                next.sort((a, b) => new Date(b.date) - new Date(a.date));
        }

        return next;
    }, [category, dateFrom, dateTo, expenses, maxAmount, minAmount, search, sortBy]);

    const resetForm = () => {
        setSelectedExpense(null);
        setModalOpen(false);
    };

    const handleSaveExpense = async (payload) => {
        try {
            setSaving(true);

            if (selectedExpense?.id) {
                await updateExpense(selectedExpense.id, payload);
            } else {
                await createExpense(payload);
            }

            await loadData();
            resetForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExpense = async (id) => {
        const confirmed = window.confirm('Delete this expense permanently?');
        if (!confirmed) return;

        try {
            await deleteExpense(id);
            await loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleExport = () => {
        const headers = ['Date', 'Title', 'Category', 'Payment Method', 'Amount', 'Status', 'Description'];
        const rows = filteredExpenses.map((expense) => [
            expense.date,
            expense.title,
            expense.category,
            expense.paymentMethod,
            expense.amount,
            expense.status,
            expense.description || '',
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'xpensto-expenses.csv';
        link.click();

        URL.revokeObjectURL(url);
    };

    return (
        <div className="stack">
            <section className="panel">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Expense Ledger</h1>
                        <p className="section-subtitle">
                            Search, filter, export, and manage your transactions in one place.
                        </p>
                    </div>

                    <div className="page-actions">
                        <button type="button" className="btn btn-ghost" onClick={handleExport}>
                            <Download size={16} />
                            Export
                        </button>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                setSelectedExpense(null);
                                setModalOpen(true);
                            }}
                        >
                            <Plus size={16} />
                            Add Expense
                        </button>
                    </div>
                </div>

                {error ? <div className="error-banner">{error}</div> : null}

                <div className="filter-bar">
                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search title, category or payment method..."
                    />

                    <FilterDropdown
                        value={category}
                        onChange={setCategory}
                        options={categoryOptions}
                    />

                    <FilterDropdown
                        value={sortBy}
                        onChange={setSortBy}
                        options={[
                            { value: 'newest', label: 'Newest first' },
                            { value: 'oldest', label: 'Oldest first' },
                            { value: 'highest', label: 'Highest amount' },
                            { value: 'lowest', label: 'Lowest amount' },
                        ]}
                    />

                    <label className="field field--compact">
                        <span>From</span>
                        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    </label>

                    <label className="field field--compact">
                        <span>To</span>
                        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    </label>

                    <label className="field field--compact">
                        <span>Min</span>
                        <input type="number" placeholder="0" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
                    </label>

                    <label className="field field--compact">
                        <span>Max</span>
                        <input type="number" placeholder="10000" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
                    </label>
                </div>
            </section>

            {loading ? (
                <Loader variant="card" count={5} />
            ) : (
                <>
                    <section className="panel desktop-only">
                        <ExpenseTable
                            expenses={filteredExpenses}
                            onEdit={(expense) => {
                                setSelectedExpense(expense);
                                setModalOpen(true);
                            }}
                            onDelete={handleDeleteExpense}
                        />
                    </section>

                    <section className="mobile-expense-list mobile-only">
                        {filteredExpenses.length ? (
                            filteredExpenses.map((expense) => (
                                <ExpenseCard
                                    key={expense.id}
                                    expense={expense}
                                    onEdit={(item) => {
                                        setSelectedExpense(item);
                                        setModalOpen(true);
                                    }}
                                    onDelete={handleDeleteExpense}
                                />
                            ))
                        ) : (
                            <div className="empty-state">No expenses match the current filters.</div>
                        )}
                    </section>
                </>
            )}

            <button
                type="button"
                className="mobile-fab"
                onClick={() => {
                    setSelectedExpense(null);
                    setModalOpen(true);
                }}
                aria-label="Add expense"
            >
                <Plus size={20} />
            </button>

            <ExpenseForm
                isOpen={modalOpen}
                onClose={resetForm}
                onSubmit={handleSaveExpense}
                initialValues={selectedExpense}
                categories={categories}
                loading={saving}
            />
        </div>
    );
}