
export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string format
  categoryId: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  isDeleted: boolean;
}

export interface Income {
  id: string;
  amount: number;
  description: string;
  date: string; // ISO string format
  categoryId: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  isDeleted: boolean;
}

export type Transaction = Expense | Income;

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or identifier for an SVG icon
  color: string; // Hex color code
  type: 'expense' | 'income';
  isDefault: boolean;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  isDeleted: boolean;
}

export interface DataStore {
  expenses: Expense[];
  incomes: Income[];
  categories: Category[];
}
