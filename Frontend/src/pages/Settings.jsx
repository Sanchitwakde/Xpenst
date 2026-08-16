import { Download, ShieldAlert, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
    const [form, setForm] = useState({
        fullName: 'Riya Sharma',
        email: 'riya@xpensto.app',
        currency: 'INR',
        theme: 'dark',
        notifications: true,
        weeklyReports: true,
        twoFactor: false,
    });
    const [message, setMessage] = useState('');

    const handleChange = ({ target }) => {
        const { name, value, type, checked } = target;
        setForm((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = (event) => {
        event.preventDefault();
        setMessage('Settings saved successfully.');
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm('Delete account action is irreversible. Continue?');
        if (!confirmed) return;
        setMessage('Delete account flow is not connected yet.');
    };

    return (
        <div className="stack">
            <form className="settings-grid" onSubmit={handleSave}>
                <section className="panel">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Profile</h2>
                            <p className="section-subtitle">Personal identity and account basics.</p>
                        </div>
                    </div>

                    <div className="form-grid">
                        <label className="field">
                            <span>Full Name</span>
                            <input name="fullName" value={form.fullName} onChange={handleChange} />
                        </label>

                        <label className="field">
                            <span>Email</span>
                            <input name="email" type="email" value={form.email} onChange={handleChange} />
                        </label>

                        <label className="field">
                            <span>Currency</span>
                            <select name="currency" value={form.currency} onChange={handleChange}>
                                <option value="INR">INR - Indian Rupee</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                            </select>
                        </label>

                        <label className="field">
                            <span>Theme</span>
                            <select name="theme" value={form.theme} onChange={handleChange}>
                                <option value="dark">Dark</option>
                            </select>
                        </label>
                    </div>
                </section>

                <section className="panel">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Notifications</h2>
                            <p className="section-subtitle">Control reminders and weekly summaries.</p>
                        </div>
                    </div>

                    <div className="toggle-list">
                        <label className="toggle-row">
                            <div>
                                <strong>Push notifications</strong>
                                <p>Get alerts for bill reminders and spending limits.</p>
                            </div>
                            <input type="checkbox" name="notifications" checked={form.notifications} onChange={handleChange} />
                        </label>

                        <label className="toggle-row">
                            <div>
                                <strong>Weekly reports</strong>
                                <p>Receive a summary of income, expenses, and savings progress.</p>
                            </div>
                            <input type="checkbox" name="weeklyReports" checked={form.weeklyReports} onChange={handleChange} />
                        </label>
                    </div>
                </section>

                <section className="panel">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Security</h2>
                            <p className="section-subtitle">Protect account access and sensitive data.</p>
                        </div>
                    </div>

                    <div className="toggle-list">
                        <label className="toggle-row">
                            <div>
                                <strong>Two-factor authentication</strong>
                                <p>Add an extra layer of sign-in protection.</p>
                            </div>
                            <input type="checkbox" name="twoFactor" checked={form.twoFactor} onChange={handleChange} />
                        </label>
                    </div>

                    <button type="button" className="btn btn-ghost">
                        <ShieldAlert size={16} />
                        Change Password
                    </button>
                </section>

                <section className="panel">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Data Controls</h2>
                            <p className="section-subtitle">Export your data or remove the account.</p>
                        </div>
                    </div>

                    <div className="page-actions">
                        <button type="button" className="btn btn-secondary">
                            <Download size={16} />
                            Export Data
                        </button>

                        <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>
                            <Trash2 size={16} />
                            Delete Account
                        </button>
                    </div>
                </section>

                <div className="page-actions">
                    <button type="submit" className="btn btn-primary">Save Settings</button>
                </div>

                {message ? <div className="badge">{message}</div> : null}
            </form>
        </div>
    );
}