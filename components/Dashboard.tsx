
import React from 'react';
import type { Expense, Category } from '../types';
import { CategoryPieChart } from './CategoryPieChart';
import { EditIcon } from './icons';

interface DashboardProps {
  expenses: Expense[];
  categories: Category[];
  onEditExpense: (expense: Expense) => void;
}

const Card: React.FC<{title: string, amount: number, period: string}> = ({title, amount, period}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">${amount.toFixed(2)}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{period}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ expenses, categories, onEditExpense }) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

  const todayExpenses = expenses.filter(e => e.date >= startOfToday);
  const monthExpenses = expenses.filter(e => e.date >= startOfMonth);

  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  // FIX: Explicitly type the Map to ensure `get` returns a typed value (`Category | undefined`) instead of `unknown`.
  const categoryMap = new Map<string, Category>(categories.map(c => [c.id, c]));

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Today's Spending" amount={todayTotal} period="Today" />
            <Card title="This Month's Spending" amount={monthTotal} period="This Month" />
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md md:col-span-1">
                <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Transactions</h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">{expenses.length}</p>
                 <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">All time</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Transactions</h3>
                <ul className="space-y-4">
                    {recentExpenses.length > 0 ? recentExpenses.map(expense => {
                        const category = categoryMap.get(expense.categoryId);
                        return (
                            <li key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-4" style={{ color: category?.color }}>{category?.icon || '❓'}</span>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{expense.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(expense.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-bold text-lg text-gray-800 dark:text-white mr-4">${expense.amount.toFixed(2)}</p>
                                    <button onClick={() => onEditExpense(expense)} className="p-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <EditIcon />
                                    </button>
                                </div>
                            </li>
                        );
                    }) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent transactions.</p>}
                </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Spending by Category</h3>
                {monthExpenses.length > 0 ? (
                  <CategoryPieChart expenses={monthExpenses} categories={categories} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-center text-gray-500 dark:text-gray-400">No spending data for this month.</p>
                  </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
