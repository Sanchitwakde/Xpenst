import {
    BarChart3,
    FileSpreadsheet,
    Goal,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    ReceiptText,
    Settings,
    Target,
    WalletCards,
    X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/expenses', label: 'All Expenses', icon: ReceiptText },
    { to: '/categories', label: 'Categories', icon: Goal },
    { to: '/budgets', label: 'Budgets', icon: WalletCards },
    { to: '/goals', label: 'Goals', icon: Target },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
];

const utilityItems = [
    { label: 'Reports', icon: FileSpreadsheet },
    { label: 'Help', icon: HelpCircle },
];

export default function Sidebar({ isOpen, onClose, onUtilityClick }) {
    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'is-visible' : ''}`}
                onClick={onClose}
                aria-hidden={!isOpen}
            />

            <aside className={`sidebar ${isOpen ? 'is-open' : ''}`}>
                <div className="sidebar__header">
                    <div className="sidebar__brand">
                        <div className="sidebar__logo">X</div>

                        <div>
                            <h1>Xpensto</h1>
                            <p>Track smarter. Spend better.</p>
                        </div>
                    </div>

                    <button type="button" className="btn-icon sidebar__close" onClick={onClose} aria-label="Close menu">
                        <X size={18} />
                    </button>
                </div>

                <nav className="sidebar__nav" aria-label="Primary navigation">
                    <div className="sidebar__group">
                        {navItems.map(({ to, label, icon: Icon }) => (
                            <NavLink
                                key={to}
                                to={to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                                }
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                            </NavLink>
                        ))}
                    </div>

                    <div className="sidebar__group">
                        {utilityItems.map(({ label, icon: Icon }) => (
                            <button
                                key={label}
                                type="button"
                                className="sidebar__link sidebar__link--muted"
                                onClick={() => onUtilityClick?.(label)}
                            >
                                <Icon size={18} />
                                <span>{label}</span>
                                <span className="chip">Soon</span>
                            </button>
                        ))}

                        <NavLink
                            to="/settings"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
                            }
                        >
                            <Settings size={18} />
                            <span>Settings</span>
                        </NavLink>
                    </div>
                </nav>

                <div className="sidebar__footer">
                    <button type="button" className="sidebar__link sidebar__link--logout">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}