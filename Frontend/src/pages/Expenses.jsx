export default function Expenses() {
    return (
        <section className="page">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Expenses</p>
                    <h2>Track spending</h2>
                </div>

                <button className="primary-btn">Add Expense</button>
            </div>

            <div className="card">
                <p className="muted">Expense list will go here.</p>
            </div>
        </section>
    );
}