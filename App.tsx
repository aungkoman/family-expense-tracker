
import React, { useState, useEffect, useCallback } from 'react';
import { useDataStore } from './hooks/useDataStore';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Categories from './components/Categories';
import { ExpenseForm } from './components/ExpenseForm';
import type { Expense, Category } from './types';
import { AddIcon, CategoriesIcon, DashboardIcon, TransactionsIcon, MoonIcon, SunIcon } from './components/icons';

type View = 'dashboard' | 'transactions' | 'categories';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    expenses,
    categories,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    loading,
  } = useDataStore();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDarkMode(!isDarkMode);
  };

  const openAddExpenseModal = () => {
    setEditingExpense(null);
    setExpenseModalOpen(true);
  };

  const openEditExpenseModal = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleExpenseFormSave = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, expense);
    } else {
      addExpense(expense);
    }
    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard expenses={expenses} categories={categories} onEditExpense={openEditExpenseModal} />;
      case 'transactions':
        return <Transactions expenses={expenses} categories={categories} onEdit={openEditExpenseModal} onDelete={deleteExpense} />;
      case 'categories':
        return <Categories categories={categories} addCategory={addCategory} updateCategory={updateCategory} deleteCategory={deleteCategory} />;
      default:
        return <Dashboard expenses={expenses} categories={categories} onEditExpense={openEditExpenseModal} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Loading Data...</div>
      </div>
    );
  }

  const NavItem: React.FC<{ currentView: View; viewName: View; label: string; icon: React.ReactNode; onClick: (view: View) => void }> = ({ currentView, viewName, label, icon, onClick }) => (
    <li
      className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors ${
        currentView === viewName ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      onClick={() => onClick(viewName)}
    >
      {icon}
      <span className="ml-3 font-medium">{label}</span>
    </li>
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <nav className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
            <div className="p-2 bg-primary-500 rounded-full">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">AI Tracker</h1>
          </div>
          <ul>
            <NavItem currentView={view} viewName="dashboard" label="Dashboard" icon={<DashboardIcon />} onClick={setView} />
            <NavItem currentView={view} viewName="transactions" label="Transactions" icon={<TransactionsIcon />} onClick={setView} />
            <NavItem currentView={view} viewName="categories" label="Categories" icon={<CategoriesIcon />} onClick={setView} />
          </ul>
        </div>
        <div className="flex items-center justify-between">
            <div className={`px-3 py-1 text-sm font-semibold rounded-full ${isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {isOnline ? 'Online' : 'Offline'}
            </div>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
        </div>
      </nav>

      <main className="flex-1 p-6 overflow-auto">
        {renderView()}
      </main>

      <button
        onClick={openAddExpenseModal}
        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-label="Add Expense"
      >
        <AddIcon />
      </button>

      {isExpenseModalOpen && (
        <ExpenseForm
          isOpen={isExpenseModalOpen}
          onClose={() => setExpenseModalOpen(false)}
          onSave={handleExpenseFormSave}
          expense={editingExpense}
          categories={categories}
        />
      )}
    </div>
  );
};

export default App;
