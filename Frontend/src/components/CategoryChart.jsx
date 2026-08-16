import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const palette = ['#5EEAD4', '#60A5FA', '#38BDF8', '#F59E0B', '#A78BFA', '#FB7185'];

export default function CategoryChart({
                                          title = 'Category Distribution',
                                          subtitle = 'Where most of your spending is concentrated.',
                                          data = [],
                                      }) {
    return (
        <section className="panel chart-card">
            <div className="section-header">
                <div>
                    <h3 className="section-title">{title}</h3>
                    <p className="section-subtitle">{subtitle}</p>
                </div>
            </div>

            <div className="chart chart--pie">
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={78}
                            outerRadius={118}
                            paddingAngle={4}
                        >
                            {data.map((entry, index) => (
                                <Cell key={entry.name} fill={entry.color || palette[index % palette.length]} />
                            ))}
                        </Pie>

                        <Tooltip
                            contentStyle={{
                                background: 'rgba(9, 16, 28, 0.96)',
                                border: '1px solid rgba(255,255,255,.08)',
                                borderRadius: '16px',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="category-list">
                {data.map((item, index) => (
                    <div className="category-list__item" key={item.name}>
                        <div className="category-list__meta">
              <span
                  className="category-list__dot"
                  style={{ background: item.color || palette[index % palette.length] }}
              />
                            <strong>{item.name}</strong>
                        </div>
                        <span>{item.value}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}