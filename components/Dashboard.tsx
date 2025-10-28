
import React from 'react';
import type { Expense, Income, Category, Transaction } from '../types';
import { CategoryPieChart } from './CategoryPieChart';
import { EditIcon } from './icons';

interface DashboardProps {
  expenses: Expense[];
  incomes: Income[];
  categories: Category[];
  onEditTransaction: (transaction: Transaction) => void;
}

const Card: React.FC<{title: string, amount: number, period: string, amountClassName?: string}> = ({title, amount, period, amountClassName = 'text-gray-800 dark:text-white'}) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${amountClassName}`}>${amount.toFixed(2)}</p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{period}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ expenses, incomes, categories, onEditTransaction }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const startOfMonthStr = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

  const todayExpenses = expenses.filter(e => e.date === todayStr);
  const monthExpenses = expenses.filter(e => e.date >= startOfMonthStr);
  const monthIncomes = incomes.filter(i => i.date >= startOfMonthStr);

  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthExpenseTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const monthIncomeTotal = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const netBalance = monthIncomeTotal - monthExpenseTotal;

  const recentActivity: (Transaction & {type: 'expense' | 'income'})[] = [
      ...expenses.map(e => ({...e, type: 'expense' as const})),
      ...incomes.map(i => ({...i, type: 'income' as const}))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);


  const categoryMap = new Map<string, Category>(categories.map(c => [c.id, c]));

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="This Month's Spending" amount={monthExpenseTotal} period="This Month" amountClassName="text-red-500 dark:text-red-400"/>
            <Card title="This Month's Income" amount={monthIncomeTotal} period="This Month" amountClassName="text-green-500 dark:text-green-400"/>
            <Card title="Net Balance" amount={netBalance} period="This Month" amountClassName={netBalance >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}/>
            <Card title="Today's Spending" amount={todayTotal} period="Today" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h3>
                <ul className="space-y-4">
                    {recentActivity.length > 0 ? recentActivity.map(item => {
                        const category = categoryMap.get(item.categoryId);
                        const isExpense = item.type === 'expense';
                        return (
                            <li key={item.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-4" style={{ color: category?.color }}>{category?.icon || '❓'}</span>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{item.description}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <p className={`font-bold text-lg mr-4 ${isExpense ? 'text-gray-800 dark:text-white' : 'text-green-600 dark:text-green-400'}`}>
                                        {isExpense ? '' : '+'}${item.amount.toFixed(2)}
                                    </p>
                                    <button onClick={() => onEditTransaction(item)} className="p-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <EditIcon />
                                    </button>
                                </div>
                            </li>
                        );
                    }) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent activity.</p>}
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
