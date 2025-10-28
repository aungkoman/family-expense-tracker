
import React, { useState, useMemo } from 'react';
import type { Expense, Category } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface TransactionsProps {
  expenses: Expense[];
  categories: Category[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const Transactions: React.FC<TransactionsProps> = ({ expenses, categories, onEdit, onDelete }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const expenseCategories = useMemo(() => categories.filter(c => c.type === 'expense'), [categories]);
  const categoryMap = useMemo(() => new Map(categories.map(c => [c.id, c])), [categories]);

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        // Category filter
        if (filterCategory !== 'all' && expense.categoryId !== filterCategory) {
          return false;
        }

        // Date filter logic
        if (startDate && !endDate) {
          // User selected only a start date, so we filter for that single day.
          return expense.date === startDate;
        }
        
        // For a date range, or just an end date
        const startMatch = !startDate || expense.date >= startDate;
        const endMatch = !endDate || expense.date <= endDate;

        return startMatch && endMatch;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterCategory, startDate, endDate]);

  const resetFilters = () => {
    setFilterCategory('all');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expenses</h1>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              id="category"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
            >
              <option value="all">All Categories</option>
              {expenseCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
            />
          </div>
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-2 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md bg-white dark:bg-gray-700"
            />
          </div>
          <button
            onClick={resetFilters}
            className="w-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredExpenses.length > 0 ? (
                filteredExpenses.map(expense => {
                  const category = categoryMap.get(expense.categoryId);
                  return (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{expense.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" style={{backgroundColor: category?.color + '20', color: category?.color}}>
                          {category?.icon} {category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => onEdit(expense)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 mr-4"><EditIcon /></button>
                        <button onClick={() => onDelete(expense.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"><DeleteIcon /></button>
                      </td>
                    </tr>
                  );
                })
            ) : (
                <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No transactions match your filters.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
