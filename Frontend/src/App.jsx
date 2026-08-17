import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Analytics from './pages/Analytics';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

function AppShell(){
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleUtilityClick = (label) => {
        console.info(`${label} is not connected yet.`);
    }
    return (
        <div className="app-shell">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                onUtilityClick={handleUtilityClick}
            />

        <div className="app-main">
            <Navbar onMenuToggle ={() => setSidebarOpen(true)} />

            <main className="app-content">
                <div key={location.pathname} className = "page-shell page-fade">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace/>} />
                        <Route path = "/dashboard" element={<Dashboard />} />
                        <Route path = "/expenses" element={<Expenses />} />
                        <Route path = "/categories" element={<Categories />}  />
                        <Route path = "/budgets" element={<Budgets />} />
                        <Route path = "/goals" element={<Goals />} />
                        <Route path = "/analytics" element={<Analytics />} />
                        <Route path = "/settings" element = {<Settings />} />
                    </Routes>
                </div>
            </main>
        </div>
        </div>
            );
}
export default function App(){
            return <AppShell />;
        }