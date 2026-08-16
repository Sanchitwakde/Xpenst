import { Search } from 'lucide-react';

export default function SearchBar({
                                      value,
                                      onChange,
                                      placeholder = 'Search...',
                                      className = '',
                                  }) {
    return (
        <label className={`searchbar ${className}`.trim()}>
            <Search size={16} />
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
            />
        </label>
    );
}