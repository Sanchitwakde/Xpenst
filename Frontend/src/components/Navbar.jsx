import { Bell, ChevronDown, Menu, MoonStar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';

const pageMeta = {
    '/dashboard': {
        title: 'Financial Command Center',
        subtitle: 'A clean view of your money, spending behavior, and progress.',
    },
    '/expenses': {
        title: 'All Expenses',
        subtitle: 'Track every transaction with filters, sorting, and quick actions.',
    },
    '/categories': {
        title: 'Categories',
        subtitle: 'See where your money goes and which areas need attention.',
    },
    '/budgets': {
        title: 'Budgets',
        subtitle: 'Keep monthly limits visible before spending runs ahead.',
    },
    '/goals': {
        title: 'Goals',
        subtitle: 'Turn savings targets into measurable milestones.',
    },
    '/analytics': {
        title: 'Analytics',
        subtitle: 'Compare trends across monthly, weekly, and yearly views.',
    },
    '/settings': {
        title: 'Settings',
        subtitle: 'Manage profile, security, preferences, and exports.',
    },
};

export default function Navbar({ onMenuToggle }) {
    const location = useLocation();
    const [query, setQuery] = useState('');

    const meta = useMemo(
        () => pageMeta[location.pathname] || pageMeta['/dashboard'],
        [location.pathname]
    );

    return (
        <header className="navbar">
            <div className="navbar__left">
                <button type="button" className="btn-icon navbar__menu" onClick={onMenuToggle} aria-label="Open menu">
                    <Menu size={18} />
                </button>

                <div>
                    <h2 className="navbar__title">{meta.title}</h2>
                    <p className="navbar__subtitle">{meta.subtitle}</p>
                </div>
            </div>

            <div className="navbar__right">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    placeholder="Search expenses, budgets, goals..."
                    className="navbar__search"
                />

                <button type="button" className="btn-icon has-dot" aria-label="Notifications">
                    <Bell size={18} />
                    <span className="notification-dot" />
                </button>

                <button type="button" className="btn-icon" aria-label="Dark mode toggle coming soon">
                    <MoonStar size={18} />
                </button>

                <button type="button" className="profile-chip">
                    <span className="profile-chip__avatar">RS</span>
                    <span className="profile-chip__meta">
            <strong>Sanz</strong>
            <small>Premium Plan</small>
          </span>
                    <ChevronDown size={16} />
                </button>
            </div>
        </header>
    );
}
