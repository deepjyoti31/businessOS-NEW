/**
 * Application-wide constants
 */

// API URL from environment variables or fallback to localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// Date format for display
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

// Storage keys
export const STORAGE_KEYS = {
  AUTH_USER: 'businessos-user',
  THEME: 'businessos-theme',
  SIDEBAR_STATE: 'businessos-sidebar-state',
  ROUTE_PERSISTENCE: 'businessos-route',
};

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  DOCUMENTS: '/dashboard/documents',
  FINANCE: '/dashboard/finance',
  FINANCE_TRANSACTIONS: '/dashboard/finance/transactions',
  FINANCE_INVOICING: '/dashboard/finance/invoicing',
  FINANCE_REPORTS: '/dashboard/finance/reports',
  FINANCE_BUDGETING: '/dashboard/finance/budgeting',
  FINANCE_BUDGET_ANALYSIS: '/dashboard/finance/budget-analysis',
  FINANCE_CLIENTS: '/dashboard/finance/clients',
  FINANCE_INVOICE_CREATE: '/dashboard/finance/invoices/create',
  FINANCE_INVOICE_EDIT: '/dashboard/finance/invoices/edit',
  FINANCE_INVOICE_DETAILS: '/dashboard/finance/invoices',
  ADMIN: '/dashboard/admin',
  SETTINGS: '/dashboard/settings',
};

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  '/reset-password',
  '/forgot-password',
];

// Transaction types
export const TRANSACTION_TYPES = {
  INCOME: 'Income',
  EXPENSE: 'Expense',
};

// Default transaction categories
export const DEFAULT_TRANSACTION_CATEGORIES = [
  'Sales',
  'Services',
  'Investments',
  'Other Income',
  'Rent',
  'Utilities',
  'Salaries',
  'Marketing',
  'Software',
  'Hardware',
  'Office Supplies',
  'Travel',
  'Meals',
  'Insurance',
  'Taxes',
  'Other Expenses',
];
