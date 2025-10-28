
import { useState, useEffect, useCallback } from 'react';
import type { Expense, Category, DataStore } from '../types';
import { DEFAULT_CATEGORIES } from '../constants';

const LOCAL_STORAGE_KEY = 'expense-tracker-data';

export const useDataStore = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const data: DataStore = JSON.parse(storedData);
        setExpenses(data.expenses || []);
        if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
        } else {
            seedDefaultCategories();
        }
      } else {
        seedDefaultCategories();
      }
    } catch (error) {
      console.error("Failed to load data from local storage", error);
      seedDefaultCategories();
    } finally {
      setLoading(false);
    }
  }, []);

  const saveData = useCallback((data: DataStore) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data to local storage", error);
    }
  }, []);

  const seedDefaultCategories = () => {
    const now = new Date().toISOString();
    const newCategories = DEFAULT_CATEGORIES.map(cat => ({
      ...cat,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    }));
    setCategories(newCategories);
    saveData({ expenses: [], categories: newCategories });
  };
  
  useEffect(() => {
    if(!loading) {
      saveData({ expenses, categories });
    }
  }, [expenses, categories, saveData, loading]);


  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => {
    const now = new Date().toISOString();
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>>) => {
    const now = new Date().toISOString();
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === id ? { ...exp, ...updates, updatedAt: now } : exp
      )
    );
  };

  const deleteExpense = (id: string) => {
    const now = new Date().toISOString();
    setExpenses(prev =>
      prev.map(exp =>
        exp.id === id ? { ...exp, isDeleted: true, updatedAt: now } : exp
      )
    );
  };

  const addCategory = (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => {
    const now = new Date().toISOString();
    const newCategory: Category = {
      ...category,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      isDeleted: false,
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>>) => {
    const now = new Date().toISOString();
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, ...updates, updatedAt: now } : cat
      )
    );
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = categories.find(c => c.id === id);
    if(categoryToDelete?.isDefault){
        alert("Default categories cannot be deleted.");
        return;
    }
    
    const now = new Date().toISOString();
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, isDeleted: true, updatedAt: now } : cat
      )
    );
  };

  const visibleExpenses = expenses.filter(e => !e.isDeleted);
  const visibleCategories = categories.filter(c => !c.isDeleted);
  
  return {
    expenses: visibleExpenses,
    categories: visibleCategories,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    loading
  };
};
