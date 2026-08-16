import { TrendingDown, TrendingUp } from 'lucide-react';

export default function StatCard({
                                     icon: Icon,
                                     title,
                                     value,
                                     change,
                                     trend = 'up',
                                     tone = 'primary',
                                 }) {
    const TrendIcon = trend === 'down' ? TrendingDown : TrendingUp;

    return (
        <article className={`stat-card stat-card--${tone}`}>
            <div className="stat-card__head">
                <div className="stat-card__icon">
                    <Icon size={20} />
                </div>

                <span className={`trend trend--${trend}`}>
          <TrendIcon size={14} />
                    {change}
        </span>
            </div>

            <div className="stat-card__body">
                <p className="stat-card__label">{title}</p>
                <h3 className="stat-card__value">{value}</h3>
            </div>
        </article>
    );
}