
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

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or identifier for an SVG icon
  color: string; // Hex color code
  isDefault: boolean;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  isDeleted: boolean;
}

export interface DataStore {
  expenses: Expense[];
  categories: Category[];
}
