
import type { Category } from './types';

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>[] = [
  { name: 'Groceries', icon: '🛒', color: '#4CAF50', isDefault: true, type: 'expense' },
  { name: 'Rent', icon: '🏠', color: '#FF5722', isDefault: true, type: 'expense' },
  { name: 'Transport', icon: '🚗', color: '#2196F3', isDefault: true, type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#9C27B0', isDefault: true, type: 'expense' },
  { name: 'Utilities', icon: '💡', color: '#FFC107', isDefault: true, type: 'expense' },
  { name: 'Dining Out', icon: '🍔', color: '#E91E63', isDefault: true, type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#009688', isDefault: true, type: 'expense' },
  { name: 'Health', icon: '❤️', color: '#F44336', isDefault: true, type: 'expense' },
  { name: 'Uncategorized', icon: '❓', color: '#9E9E9E', isDefault: true, type: 'expense' },
];

export const DEFAULT_INCOME_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>[] = [
    { name: 'Salary', icon: '💰', color: '#4CAF50', isDefault: true, type: 'income' },
    { name: 'Gifts', icon: '🎁', color: '#2196F3', isDefault: true, type: 'income' },
    { name: 'Freelance', icon: '💼', color: '#FF9800', isDefault: true, type: 'income' },
    { name: 'Other', icon: '🤷', color: '#9E9E9E', isDefault: true, type: 'income' },
];
