export default function FilterDropdown({
                                           label,
                                           value,
                                           onChange,
                                           options = [],
                                           className = '',
                                       }) {
    return (
        <label className={`filter-select ${className}`.trim()}>
            {label ? <span>{label}</span> : null}
            <select value={value} onChange={(event) => onChange(event.target.value)}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    );
}