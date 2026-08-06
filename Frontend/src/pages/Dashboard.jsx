export default function Dashboard() {
    return (
        <section className="page">
            <div className="hero">
                <p className="eyebrow">Finance dashboard</p>
                <h2>Take control of every rupee you spend.</h2>
                <p className="muted">
                    Track expenses, analyze spending habits, and make smarter financial decisions - all in one place
                </p>
            </div>

            <div className="card-grid">
                <div className="card">
                    <h3>Total Balance</h3>
                    <p className="big">₹ 12,480</p>
                </div>

                <div className="card">
                    <h3>This Month</h3>
                    <p className="big">₹ 2,340</p>
                </div>

                <div className="card">
                    <h3>Pending</h3>
                    <p className="big">8 items</p>
                </div>
            </div>
        </section>
    );
}