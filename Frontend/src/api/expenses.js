import client from './client';
import {
    createExpenseRecord,
    deleteExpenseRecord,
    getAppState,
    listExpenses,
    updateExpenseRecord,
} from './localData';

const useLocalData = import.meta.env.VITE_USE_LOCAL_DATA !== 'false';

const unwrap = ({ data }) => data;

const withFallback = async (remoteCall, localCall) => {
    if (useLocalData) return localCall();

    try {
        return await remoteCall();
    } catch (error) {
        const status = error.response?.status;
        const shouldFallback = !status || status >= 500 || status === 404;

        if (shouldFallback) {
            return localCall();
        }

        throw error;
    }
};

const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value}%`;

const round = (value) => Math.round(Number(value || 0));

const getMonthKey = (value) => {
    const date = new Date(value);
    return `${date.getFullYear()}-${date.getMonth()}`;
};

const getMonthLabel = (date) =>
    date.toLocaleString('en-IN', {
        month: 'short',
    });

const isSameMonth = (value, date = new Date()) => getMonthKey(value) === getMonthKey(date);

const monthOffsetDate = (offset) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() + offset);
    return date;
};

const summarizeByCategory = (expenses) => {
    const categories = new Map();

    expenses.forEach((expense) => {
        const current = categories.get(expense.category) || {
            name: expense.category,
            value: 0,
            amount: 0,
            transactions: 0,
        };

        current.value += Number(expense.amount || 0);
        current.amount = current.value;
        current.transactions += 1;
        categories.set(expense.category, current);
    });

    return [...categories.values()].sort((a, b) => b.value - a.value);
};

const buildMonthlyTrend = (expenses, incomeBase) => {
    const buckets = Array.from({ length: 6 }, (_, index) => {
        const date = monthOffsetDate(index - 5);
        const key = getMonthKey(date);
        return {
            key,
            label: getMonthLabel(date),
            expense: 0,
            income: round(incomeBase * (0.92 + index * 0.015)),
        };
    });

    const lookup = new Map(buckets.map((bucket) => [bucket.key, bucket]));

    expenses.forEach((expense) => {
        const bucket = lookup.get(getMonthKey(expense.date));
        if (bucket) {
            bucket.expense += Number(expense.amount || 0);
        }
    });

    return buckets;
};

const buildBudgetSummary = (budgets, expenses) =>
    budgets.map((budget) => {
        const spent = expenses
            .filter((expense) => isSameMonth(expense.date) && expense.category === budget.name)
            .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

        return {
            ...budget,
            spent,
        };
    });

const calculateChange = (current, previous) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
};

const getLocalDashboard = () => {
    const state = getAppState();
    const expenses = listExpenses();
    const budgets = buildBudgetSummary(state.budgets, expenses);
    const monthlyTrend = buildMonthlyTrend(expenses, state.profile.monthlyIncome);
    const currentMonthExpenses = expenses
        .filter((expense) => isSameMonth(expense.date))
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const previousMonthExpenses = expenses
        .filter((expense) => isSameMonth(expense.date, monthOffsetDate(-1)))
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const categoryDistribution = summarizeByCategory(
        expenses.filter((expense) => isSameMonth(expense.date))
    );
    const totalBudget = budgets.reduce((sum, item) => sum + Number(item.limit || 0), 0);
    const totalSpentBudget = budgets.reduce((sum, item) => sum + Number(item.spent || 0), 0);
    const savings = Math.max(0, state.profile.monthlyIncome - currentMonthExpenses);
    const previousSavings = Math.max(0, state.profile.monthlyIncome - previousMonthExpenses);
    const goalsProgress = state.goals.length
        ? Math.round(
            state.goals.reduce((sum, goal) => {
                const target = Number(goal.target || 0);
                const current = Number(goal.current || 0);
                return sum + (target ? Math.min(100, Math.round((current / target) * 100)) : 0);
            }, 0) / state.goals.length
        )
        : 0;
    const topCategory = categoryDistribution[0] || null;
    const totalCurrentMonthCategorySpend = categoryDistribution.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
    );

    return {
        summary: {
            balance: state.profile.accountBalance + savings,
            balanceChange: formatPercent(calculateChange(savings, previousSavings)),
            balanceTrend: savings >= previousSavings ? 'up' : 'down',
            expenses: currentMonthExpenses,
            expenseChange: formatPercent(calculateChange(currentMonthExpenses, previousMonthExpenses)),
            expenseTrend: currentMonthExpenses <= previousMonthExpenses ? 'down' : 'up',
            income: state.profile.monthlyIncome,
            incomeChange: '+4%',
            incomeTrend: 'up',
            savings,
            savingsChange: formatPercent(calculateChange(savings, previousSavings)),
            savingsTrend: savings >= previousSavings ? 'up' : 'down',
            budgetRemaining: Math.max(0, totalBudget - totalSpentBudget),
            budgetChange: `${Math.max(0, 100 - Math.round((totalSpentBudget / Math.max(totalBudget, 1)) * 100))}%`,
            budgetTrend: totalSpentBudget <= totalBudget ? 'up' : 'down',
            investments: state.profile.investmentBalance,
            investmentChange: '+3%',
            investmentTrend: 'up',
            goalsProgress,
            goalsChange: `${state.goals.length} active`,
            goalsTrend: 'up',
            savingsRate: `${Math.round((savings / Math.max(state.profile.monthlyIncome, 1)) * 100)}%`,
        },
        monthlyTrend,
        categoryDistribution,
        recentTransactions: expenses.slice(0, 5),
        recentBills: expenses
            .filter((expense) => expense.status === 'Pending')
            .slice(0, 3)
            .map((expense) => ({
                title: expense.title,
                dueDate: expense.date,
                amount: expense.amount,
            })),
        upcomingPayments: expenses
            .filter((expense) => expense.status === 'Scheduled' || expense.status === 'Pending')
            .slice(0, 4)
            .map((expense) => ({
                title: expense.title,
                dueDate: expense.date,
                amount: expense.amount,
            })),
        goal: state.goals[0] || null,
        topCategory: topCategory
            ? {
                name: topCategory.name,
                amount: topCategory.value,
                share: `${Math.round((topCategory.value / Math.max(totalCurrentMonthCategorySpend, 1)) * 100)}%`,
            }
            : null,
    };
};

const buildRangeDates = (range) => {
    if (range === 'weekly') {
        return Array.from({ length: 8 }, (_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (7 * (7 - index)));
            return {
                key: `${date.getFullYear()}-w${index}`,
                label: `W${index + 1}`,
                start: new Date(date),
                end: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 6),
            };
        });
    }

    if (range === 'yearly') {
        return Array.from({ length: 5 }, (_, index) => {
            const year = new Date().getFullYear() - (4 - index);
            return {
                key: `${year}`,
                label: `${year}`,
                start: new Date(year, 0, 1),
                end: new Date(year, 11, 31),
            };
        });
    }

    return Array.from({ length: 6 }, (_, index) => {
        const date = monthOffsetDate(index - 5);
        return {
            key: getMonthKey(date),
            label: getMonthLabel(date),
            start: new Date(date.getFullYear(), date.getMonth(), 1),
            end: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        };
    });
};

const getLocalAnalytics = (range) => {
    const state = getAppState();
    const expenses = listExpenses();
    const periods = buildRangeDates(range);
    const trend = periods.map((period, index) => {
        const expense = expenses
            .filter((item) => {
                const date = new Date(item.date);
                return date >= period.start && date <= period.end;
            })
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

        return {
            label: period.label,
            expense,
            income: round(state.profile.monthlyIncome * (0.9 + index * 0.02)),
        };
    });

    const totalExpense = trend.reduce((sum, item) => sum + item.expense, 0);
    const previousExpense = trend.slice(0, -1).reduce((sum, item) => sum + item.expense, 0);
    const categoryDistribution = summarizeByCategory(expenses);

    return {
        summary: {
            monthlySpend: trend[trend.length - 1]?.expense || 0,
            monthlyChange: formatPercent(calculateChange(totalExpense, previousExpense)),
            monthlyTrend: totalExpense <= previousExpense ? 'down' : 'up',
            highestCategory: categoryDistribution[0]?.name || 'No data',
            highestCategoryShare: categoryDistribution[0]
                ? `${Math.round((categoryDistribution[0].value / Math.max(totalExpense, 1)) * 100)}% of total`
                : '0% of total',
            averageDailySpend: round(totalExpense / Math.max(range === 'weekly' ? 56 : 30, 1)),
            averageChange: '+2%',
            averageTrend: 'up',
            savingsRate: `${Math.round(((state.profile.monthlyIncome - (trend[trend.length - 1]?.expense || 0)) / Math.max(state.profile.monthlyIncome, 1)) * 100)}%`,
            savingsChange: '+1%',
            savingsTrend: 'up',
        },
        trend,
        comparison: trend,
        categoryDistribution,
    };
};

export const getDashboard = () =>
    withFallback(() => client.get('/api/dashboard').then(unwrap), getLocalDashboard);

export const getExpenses = (params = {}) =>
    withFallback(() => client.get('/api/expenses', { params }).then(unwrap), listExpenses);

export const getExpenseById = (id) =>
    withFallback(
        () => client.get(`/api/expenses/${id}`).then(unwrap),
        () => listExpenses().find((expense) => expense.id === id) || null
    );

export const createExpense = (payload) =>
    withFallback(() => client.post('/api/expenses', payload).then(unwrap), () =>
        createExpenseRecord(payload)
    );

export const updateExpense = (id, payload) =>
    withFallback(() => client.put(`/api/expenses/${id}`, payload).then(unwrap), () =>
        updateExpenseRecord(id, payload)
    );

export const deleteExpense = (id) =>
    withFallback(() => client.delete(`/api/expenses/${id}`).then(unwrap), () =>
        deleteExpenseRecord(id)
    );

export const exportExpenses = (params = {}) =>
    client.get('/api/expenses/export', {
        params,
        responseType: 'blob',
    });

export const getCategories = () =>
    withFallback(() => client.get('/api/categories/summary').then(unwrap), () =>
        summarizeByCategory(listExpenses())
    );

export const getAnalytics = (range = 'monthly') =>
    withFallback(
        () => client.get('/api/analytics', { params: { range } }).then(unwrap),
        () => getLocalAnalytics(range)
    );

export const getBudgets = () =>
    withFallback(() => client.get('/api/budgets').then(unwrap), () => {
        const state = getAppState();
        return buildBudgetSummary(state.budgets, listExpenses());
    });

export const getGoals = () =>
    withFallback(() => client.get('/api/goals').then(unwrap), () => getAppState().goals);
