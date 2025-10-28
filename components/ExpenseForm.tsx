
import React, { useState, useEffect } from 'react';
import type { Expense, Category } from '../types';
import { parseExpenseFromText, ParsedExpense } from '../services/geminiService';
import { Modal } from './ui/Modal';
import { SparklesIcon } from './icons';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => void;
  expense: Expense | null;
  categories: Category[];
}

const FormField: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="mt-1">{children}</div>
    </div>
);

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose, onSave, expense, categories }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [smartInput, setSmartInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount));
      setDescription(expense.description);
      setDate(new Date(expense.date).toISOString().split('T')[0]);
      setCategoryId(expense.categoryId);
    } else {
      resetForm();
    }
  }, [expense, isOpen]);
  
  useEffect(() => {
    if (!expense && categories.length > 0 && !categoryId) {
        const uncategorized = categories.find(c => c.name.toLowerCase() === 'uncategorized');
        if (uncategorized) {
            setCategoryId(uncategorized.id);
        } else {
            setCategoryId(categories[0].id);
        }
    }
  }, [categories, expense, categoryId]);


  const resetForm = () => {
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    const uncategorized = categories.find(c => c.name.toLowerCase() === 'uncategorized');
    setCategoryId(uncategorized ? uncategorized.id : (categories[0]?.id || ''));
    setSmartInput('');
  };

  const handleSmartParse = async () => {
    if (!smartInput) return;
    setIsParsing(true);
    try {
      const result = await parseExpenseFromText(smartInput, categories);
      if (result) {
        setDescription(result.description);
        setAmount(String(result.amount));
        const suggestedCategory = categories.find(c => c.name === result.categorySuggestion);
        if (suggestedCategory) {
          setCategoryId(suggestedCategory.id);
        }
      } else {
        alert("Could not parse input. Please enter details manually.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while parsing.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date || !categoryId) {
      alert("Please fill all fields");
      return;
    }
    onSave({
      amount: parseFloat(amount),
      description,
      date,
      categoryId,
    });
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
            <div className="p-4 border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <label className="block text-sm font-bold text-primary-800 dark:text-primary-200 mb-2">Smart Add with AI</label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={smartInput}
                        onChange={e => setSmartInput(e.target.value)}
                        placeholder="e.g., Coffee at Starbucks for 5.50"
                        className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                        type="button"
                        onClick={handleSmartParse}
                        disabled={isParsing}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        {isParsing ? '...' : <SparklesIcon />}
                        <span className="ml-2">Parse</span>
                    </button>
                </div>
                 <p className="text-xs text-primary-600 dark:text-primary-400 mt-2">Let AI fill out the form for you!</p>
            </div>

          <FormField label="Description">
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
              <FormField label="Amount ($)">
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                  step="0.01"
                />
              </FormField>
              <FormField label="Date">
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </FormField>
          </div>
          
          <FormField label="Category">
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </FormField>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};
