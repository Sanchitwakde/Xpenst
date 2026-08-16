import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const defaultKeys = [
    { key: 'expense', color: '#60A5FA', name: 'Expenses' },
    { key: 'income', color: '#5EEAD4', name: 'Income' },
];

const axisFormatter = (value) => {
    if (value >= 100000) return `₹${Math.round(value / 1000)}k`;
    if (value >= 1000) return `₹${Math.round(value / 1000)}k`;
    return `₹${value}`;
};

export default function MonthlyChart({
                                         title = 'Monthly Trends',
                                         subtitle = 'A clean overview of movement over time.',
                                         data = [],
                                         variant = 'bar',
                                         dataKeys = defaultKeys,
                                     }) {
    const Chart = variant === 'line' ? LineChart : BarChart;

    return (
        <section className="panel chart-card">
            <div className="section-header">
                <div>
                    <h3 className="section-title">{title}</h3>
                    <p className="section-subtitle">{subtitle}</p>
                </div>
            </div>

            <div className="chart">
                <ResponsiveContainer width="100%" height={320}>
                    <Chart data={data}>
                        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
                        <XAxis dataKey="label" tickLine={false} axisLine={false} stroke="#7B93B4" />
                        <YAxis tickFormatter={axisFormatter} tickLine={false} axisLine={false} stroke="#7B93B4" />
                        <Tooltip
                            formatter={(value) =>
                                new Intl.NumberFormat('en-IN', {
                                    style: 'currency',
                                    currency: 'INR',
                                    maximumFractionDigits: 0,
                                }).format(Number(value))
                            }
                            contentStyle={{
                                background: 'rgba(9, 16, 28, 0.96)',
                                border: '1px solid rgba(255,255,255,.08)',
                                borderRadius: '16px',
                            }}
                        />
                        <Legend />

                        {variant === 'line'
                            ? dataKeys.map((item) => (
                                <Line
                                    key={item.key}
                                    type="monotone"
                                    dataKey={item.key}
                                    stroke={item.color}
                                    strokeWidth={3}
                                    dot={{ r: 3 }}
                                    activeDot={{ r: 6 }}
                                    name={item.name}
                                />
                            ))
                            : dataKeys.map((item) => (
                                <Bar
                                    key={item.key}
                                    dataKey={item.key}
                                    fill={item.color}
                                    radius={[12, 12, 0, 0]}
                                    name={item.name}
                                />
                            ))}
                    </Chart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}