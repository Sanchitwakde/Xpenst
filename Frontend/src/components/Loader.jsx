export default function Loader({ variant = 'card', count = 4 }) {
    return (
        <div className={`loader loader--${variant}`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="loader__item" />
            ))}
        </div>
    );
}