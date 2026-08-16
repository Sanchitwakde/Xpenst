import { Pencil, Trash2 } from 'lucide-react';

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

export default function ExpenseCard({ expense, onEdit, onDelete }) {
    return (
        <article className="expense-card">
            <div className="expense-card__top">
                <div>
                    <h4>{expense.title}</h4>
                    <p>{expense.category}</p>
                </div>

                <div className="expense-card__amount">
                    <strong>{formatCurrency(expense.amount)}</strong>
                    <span
                        className={`status-badge status-badge--${String(
                            expense.status || 'paid'
                        ).toLowerCase()}`}
                    >
            {expense.status || 'Paid'}
          </span>
                </div>
            </div>

            <div className="expense-card__meta">
                <span>{formatDate(expense.date)}</span>
                <span>{expense.paymentMethod}</span>
            </div>

            {expense.description ? (
                <p className="expense-card__description">{expense.description}</p>
            ) : null}

            <div className="expense-card__actions">
                <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => onEdit?.(expense)}
                >
                    <Pencil size={16} />
                    Edit
                </button>

                <button
                    type="button"
                    className="btn btn-ghost btn-danger"
                    onClick={() => onDelete?.(expense.id)}
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </article>
    );
}