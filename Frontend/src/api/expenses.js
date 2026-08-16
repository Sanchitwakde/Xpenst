import client from './client';

const unwrap = ({ data }) => data;

// Adjust these endpoints in one place if your Spring Boot routes differ.
export const getDashboard = () => client.get('/api/dashboard').then(unwrap);

export const getExpenses = (params = {}) =>
    client.get('/api/expenses', { params }).then(unwrap);

export const getExpenseById = (id) =>
    client.get(`/api/expenses/${id}`).then(unwrap);

export const createExpense = (payload) =>
    client.post('/api/expenses', payload).then(unwrap);

export const updateExpense = (id, payload) =>
    client.put(`/api/expenses/${id}`, payload).then(unwrap);

export const deleteExpense = (id) =>
    client.delete(`/api/expenses/${id}`).then(unwrap);

export const exportExpenses = (params = {}) =>
    client.get('/api/expenses/export', {
        params,
        responseType: 'blob',
    });

export const getCategories = () =>
    client.get('/api/categories/summary').then(unwrap);

export const getAnalytics = (range = 'monthly') =>
    client.get('/api/analytics', { params: { range } }).then(unwrap);

export const getBudgets = () =>
    client.get('/api/budgets').then(unwrap);

export const getGoals = () =>
    client.get('/api/goals').then(unwrap);