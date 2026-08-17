const STORAGE_KEY = 'xpensto-local-data-v1';
const DATA_EVENT = 'xpensto:data-changed';

const defaultState = {
    profile: {
        fullName: 'Xpensto User',
        email: 'user@xpensto.app',
        currency: 'INR',
        theme: 'dark',
        notifications: true,
        weeklyReports: true,
        twoFactor: false,
        plan: 'Local Workspace',
        monthlyIncome: 125000,
        investmentBalance: 275000,
        accountBalance: 482000,
    },
    expenses: [
        {
            id: 'exp-1',
            title: 'Apartment Rent',
            amount: 28500,
            category: 'Housing',
            paymentMethod: 'Bank Transfer',
            date: '2026-08-02',
            description: 'Monthly apartment rent',
            status: 'Paid',
        },
        {
            id: 'exp-2',
            title: 'Groceries',
            amount: 4200,
            category: 'Food',
            paymentMethod: 'UPI',
            date: '2026-08-04',
            description: 'Weekly groceries',
            status: 'Paid',
        },
        {
            id: 'exp-3',
            title: 'Electricity Bill',
            amount: 2150,
            category: 'Utilities',
            paymentMethod: 'UPI',
            date: '2026-08-09',
            description: 'Apartment electricity bill',
            status: 'Pending',
        },
        {
            id: 'exp-4',
            title: 'Fuel',
            amount: 3200,
            category: 'Transport',
            paymentMethod: 'Card',
            date: '2026-08-11',
            description: 'Car fuel refill',
            status: 'Paid',
        },
        {
            id: 'exp-5',
            title: 'Internet Subscription',
            amount: 999,
            category: 'Utilities',
            paymentMethod: 'Card',
            date: '2026-08-14',
            description: 'Home broadband plan',
            status: 'Scheduled',
        },
        {
            id: 'exp-6',
            title: 'Dining Out',
            amount: 1850,
            category: 'Food',
            paymentMethod: 'UPI',
            date: '2026-07-26',
            description: 'Dinner with friends',
            status: 'Paid',
        },
        {
            id: 'exp-7',
            title: 'Phone Recharge',
            amount: 699,
            category: 'Utilities',
            paymentMethod: 'UPI',
            date: '2026-07-19',
            description: 'Monthly mobile plan',
            status: 'Paid',
        },
        {
            id: 'exp-8',
            title: 'Gym Membership',
            amount: 1800,
            category: 'Health',
            paymentMethod: 'Card',
            date: '2026-06-28',
            description: 'Monthly membership renewal',
            status: 'Paid',
        },
        {
            id: 'exp-9',
            title: 'Laptop EMI',
            amount: 5600,
            category: 'Debt',
            paymentMethod: 'Bank Transfer',
            date: '2026-06-10',
            description: 'Monthly EMI payment',
            status: 'Paid',
        },
        {
            id: 'exp-10',
            title: 'Flight Savings Transfer',
            amount: 7500,
            category: 'Travel',
            paymentMethod: 'Bank Transfer',
            date: '2026-05-13',
            description: 'Reserved cash for December trip',
            status: 'Paid',
        },
    ],
    budgets: [
        { id: 'bud-1', name: 'Housing', limit: 32000, period: 'Monthly' },
        { id: 'bud-2', name: 'Food', limit: 12000, period: 'Monthly' },
        { id: 'bud-3', name: 'Utilities', limit: 6000, period: 'Monthly' },
        { id: 'bud-4', name: 'Transport', limit: 7000, period: 'Monthly' },
        { id: 'bud-5', name: 'Health', limit: 5000, period: 'Monthly' },
    ],
    goals: [
        {
            id: 'goal-1',
            title: 'Emergency Fund',
            category: 'Safety Net',
            current: 180000,
            target: 300000,
            deadline: '2027-03-31',
        },
        {
            id: 'goal-2',
            title: 'Goa Trip',
            category: 'Travel',
            current: 42000,
            target: 80000,
            deadline: '2026-12-15',
        },
        {
            id: 'goal-3',
            title: 'Laptop Upgrade',
            category: 'Tech',
            current: 35000,
            target: 120000,
            deadline: '2027-06-30',
        },
    ],
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const getStorage = () => {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
};

const mergeProfile = (profile = {}) => ({
    ...defaultState.profile,
    ...profile,
});

const normalizeState = (state = {}) => ({
    profile: mergeProfile(state.profile),
    expenses: Array.isArray(state.expenses) ? state.expenses : clone(defaultState.expenses),
    budgets: Array.isArray(state.budgets) ? state.budgets : clone(defaultState.budgets),
    goals: Array.isArray(state.goals) ? state.goals : clone(defaultState.goals),
});

const emitStateChange = (state) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent(DATA_EVENT, { detail: clone(state) }));
};

export const getAppState = () => {
    const storage = getStorage();
    if (!storage) return clone(defaultState);

    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
        const fresh = clone(defaultState);
        storage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
    }

    try {
        return normalizeState(JSON.parse(raw));
    } catch {
        const fresh = clone(defaultState);
        storage.setItem(STORAGE_KEY, JSON.stringify(fresh));
        return fresh;
    }
};

export const saveAppState = (nextState) => {
    const normalized = normalizeState(nextState);
    const storage = getStorage();

    if (storage) {
        storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }

    emitStateChange(normalized);
    return clone(normalized);
};

export const subscribeToAppState = (callback) => {
    if (typeof window === 'undefined') return () => {};

    const handleDataChange = (event) => {
        callback(event.detail || getAppState());
    };

    const handleStorage = (event) => {
        if (event.key === STORAGE_KEY) {
            callback(getAppState());
        }
    };

    window.addEventListener(DATA_EVENT, handleDataChange);
    window.addEventListener('storage', handleStorage);

    return () => {
        window.removeEventListener(DATA_EVENT, handleDataChange);
        window.removeEventListener('storage', handleStorage);
    };
};

const buildId = (prefix) => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}`;
};

export const listExpenses = () =>
    [...getAppState().expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

export const createExpenseRecord = (payload) => {
    const state = getAppState();
    const expense = {
        id: buildId('exp'),
        ...payload,
    };

    return saveAppState({
        ...state,
        expenses: [expense, ...state.expenses],
    }).expenses[0];
};

export const updateExpenseRecord = (id, payload) => {
    const state = getAppState();
    const expenses = state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...payload, id } : expense
    );

    saveAppState({ ...state, expenses });
    return expenses.find((expense) => expense.id === id) || null;
};

export const deleteExpenseRecord = (id) => {
    const state = getAppState();
    const expenses = state.expenses.filter((expense) => expense.id !== id);
    saveAppState({ ...state, expenses });
    return true;
};

export const getProfile = () => getAppState().profile;

export const updateProfile = (payload) => {
    const state = getAppState();
    return saveAppState({
        ...state,
        profile: {
            ...state.profile,
            ...payload,
        },
    }).profile;
};

export const resetAppState = () => saveAppState(clone(defaultState));

export const exportAppState = () => {
    const data = getAppState();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'xpensto-local-data.json';
    link.click();

    URL.revokeObjectURL(url);
    return true;
};
