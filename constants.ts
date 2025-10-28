
import type { Category } from './types';

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>[] = [
  { name: 'Groceries', icon: '🛒', color: '#4CAF50', isDefault: true },
  { name: 'Rent', icon: '🏠', color: '#FF5722', isDefault: true },
  { name: 'Transport', icon: '🚗', color: '#2196F3', isDefault: true },
  { name: 'Entertainment', icon: '🎬', color: '#9C27B0', isDefault: true },
  { name: 'Utilities', icon: '💡', color: '#FFC107', isDefault: true },
  { name: 'Dining Out', icon: '🍔', color: '#E91E63', isDefault: true },
  { name: 'Shopping', icon: '🛍️', color: '#009688', isDefault: true },
  { name: 'Health', icon: '❤️', color: '#F44336', isDefault: true },
  { name: 'Uncategorized', icon: '❓', color: '#9E9E9E', isDefault: true },
];
