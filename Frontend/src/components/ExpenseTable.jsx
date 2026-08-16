import { ArrowUpDown, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

const formatDate = (value) =>
    new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));

const sortValue = (item, key) => {
    const value = item[key];

    if (key === 'date') return new Date(value).getTime();
    if (key === 'amount') return Number(value || 0);
    return String(value || '').toLowerCase();
};

export default function ExpenseTable({
                                         expenses = [],
                                         rowsPerPage = 8,
                                         showPagination = true,
                                         onEdit,
                                         onDelete,
                                     }) {
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [page, setPage] = useState(1);

    const sortedExpenses = useMemo(() => {
        const cloned = [...expenses];

        return cloned.sort((a, b) => {
            const aValue = sortValue(a, sortConfig.key);
            const bValue = sortValue(b, sortConfig.key);

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [expenses, sortConfig]);

    const totalPages = Math.max(1, Math.ceil(sortedExpenses.length / rowsPerPage));

    const paginated = useMemo(() => {
        if (!showPagination) return sortedExpenses.slice(0, rowsPerPage);

        const start = (page - 1) * rowsPerPage;
        return sortedExpenses.slice(start, start + rowsPerPage);
    }, [page, rowsPerPage, showPagination, sortedExpenses]);

    const requestSort = (key) => {
        setPage(1);
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const renderHead = (label, key) => (
        <button type="button" className="sortable" onClick={() => requestSort(key)}>
            {label}
            <ArrowUpDown size={14} />
        </button>
    );

    if (!expenses.length) {
        return <div className="empty-state">No transactions found for the selected filters.</div>;
    }

    return (
        <div className="table-wrap">
            <div className="table-scroll">
                <table className="table">
                    <thead>
                    <tr>
                        <th>{renderHead('Date', 'date')}</th>
                        <th>{renderHead('Title', 'title')}</th>
                        <th>{renderHead('Category', 'category')}</th>
                        <th>{renderHead('Payment Method', 'paymentMethod')}</th>
                        <th>{renderHead('Amount', 'amount')}</th>
                        <th>{renderHead('Status', 'status')}</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {paginated.map((expense) => (
                        <tr key={expense.id}>
                            <td>{formatDate(expense.date)}</td>
                            <td>
                                <div className="table__title">
                                    <strong>{expense.title}</strong>
                                    {expense.description ? <span>{expense.description}</span> : null}
                                </div>
                            </td>
                            <td>{expense.category}</td>
                            <td>{expense.paymentMethod}</td>
                            <td className="amount-cell">{formatCurrency(expense.amount)}</td>
                            <td>
                  <span className={`status-badge status-badge--${String(expense.status || 'paid').toLowerCase()}`}>
                    {expense.status || 'Paid'}
                  </span>
                            </td>
                            <td>
                                <div className="table-actions">
                                    <button type="button" className="btn-icon" onClick={() => onEdit?.(expense)} aria-label="Edit expense">
                                        <Pencil size={16} />
                                    </button>

                                    <button type="button" className="btn-icon" onClick={() => onDelete?.(expense.id)} aria-label="Delete expense">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showPagination ? (
                <div className="pagination">
                    <p>
                        Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                    </p>

                    <div className="pagination__actions">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={page === 1}
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <button
                            type="button"
                            className="btn btn-ghost"
                            disabled={page === totalPages}
                            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}