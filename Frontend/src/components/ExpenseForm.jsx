import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';

const getDefaultState = () => ({
    title: '',
    amount: '',
    category: '',
    paymentMethod: 'UPI',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    status: 'Paid',
});

export default function ExpenseForm({
                                        isOpen,
                                        onClose,
                                        onSubmit,
                                        initialValues,
                                        categories = [],
                                        loading = false,
                                    }) {
    const [form, setForm] = useState(getDefaultState());
    const [errors, setErrors] = useState({});

    const categoryOptions = useMemo(
        () =>
            categories.map((item) => (typeof item === 'string' ? item : item.name)).filter(Boolean),
        [categories]
    );

    useEffect(() => {
        if (!isOpen) return;

        if (initialValues) {
            setForm({
                title: initialValues.title || '',
                amount: initialValues.amount || '',
                category: initialValues.category || '',
                paymentMethod: initialValues.paymentMethod || 'UPI',
                date: initialValues.date ? String(initialValues.date).slice(0, 10) : getDefaultState().date,
                description: initialValues.description || '',
                status: initialValues.status || 'Paid',
            });
        } else {
            setForm(getDefaultState());
        }

        setErrors({});
    }, [initialValues, isOpen]);

    const validate = () => {
        const nextErrors = {};

        if (!form.title.trim()) nextErrors.title = 'Title is required.';
        if (!form.amount || Number(form.amount) <= 0) nextErrors.amount = 'Enter a valid amount.';
        if (!form.category.trim()) nextErrors.category = 'Category is required.';
        if (!form.date) nextErrors.date = 'Date is required.';

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) return;

        await onSubmit({
            ...form,
            amount: Number(form.amount),
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={initialValues ? 'Edit Expense' : 'Add Expense'}
            description="Capture the transaction details clearly so your dashboard stays accurate."
            size="lg"
            footer={
                <>
                    <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </button>

                    <button type="submit" form="expense-form" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Expense'}
                    </button>
                </>
            }
        >
            <form id="expense-form" className="form-grid" onSubmit={handleSubmit}>
                <label className="field">
                    <span>Title</span>
                    <input
                        type="text"
                        name="title"
                        placeholder="Groceries at Nature's Basket"
                        value={form.title}
                        onChange={handleChange}
                    />
                    {errors.title ? <small className="field__error">{errors.title}</small> : null}
                </label>

                <label className="field">
                    <span>Amount</span>
                    <input
                        type="number"
                        name="amount"
                        min="0"
                        step="0.01"
                        placeholder="2500"
                        value={form.amount}
                        onChange={handleChange}
                    />
                    {errors.amount ? <small className="field__error">{errors.amount}</small> : null}
                </label>

                <label className="field">
                    <span>Category</span>
                    <input
                        type="text"
                        name="category"
                        list="category-options"
                        placeholder="Food & Dining"
                        value={form.category}
                        onChange={handleChange}
                    />
                    <datalist id="category-options">
                        {categoryOptions.map((category) => (
                            <option key={category} value={category} />
                        ))}
                    </datalist>
                    {errors.category ? <small className="field__error">{errors.category}</small> : null}
                </label>

                <label className="field">
                    <span>Payment Method</span>
                    <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Wallet">Wallet</option>
                    </select>
                </label>

                <label className="field">
                    <span>Date</span>
                    <input type="date" name="date" value={form.date} onChange={handleChange} />
                    {errors.date ? <small className="field__error">{errors.date}</small> : null}
                </label>

                <label className="field">
                    <span>Status</span>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Scheduled</option>
                    </select>
                </label>

                <label className="field field--full">
                    <span>Description</span>
                    <textarea
                        name="description"
                        rows="4"
                        placeholder="Optional notes for future reference."
                        value={form.description}
                        onChange={handleChange}
                    />
                </label>
            </form>
        </Modal>
    );
}