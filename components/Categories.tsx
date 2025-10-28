
import React, { useState } from 'react';
import type { Category } from '../types';
import { CategoryForm } from './CategoryForm';
import { AddIcon, DeleteIcon, EditIcon } from './icons';

interface CategoriesProps {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>>) => void;
  deleteCategory: (id: string) => void;
}

const CategoryGrid: React.FC<{
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}> = ({ categories, onEdit, onDelete }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map(category => (
            <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-between">
                <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4" style={{ filter: `drop-shadow(0 0 4px ${category.color}40)` }}>{category.icon}</span>
                    <span className="font-semibold text-lg text-gray-800 dark:text-white truncate">{category.name}</span>
                </div>
                <div className="flex justify-end items-center space-x-2">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: category.color }}></div>
                    <button
                        onClick={() => onEdit(category)}
                        className="p-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                        <EditIcon />
                    </button>
                    {!category.isDefault && (
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                            <DeleteIcon />
                        </button>
                    )}
                </div>
            </div>
        ))}
    </div>
);


const Categories: React.FC<CategoriesProps> = ({ categories, addCategory, updateCategory, deleteCategory }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleSave = (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Categories</h1>
        <button
          onClick={openAddModal}
          className="flex items-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <AddIcon />
          <span className="ml-2">Add Category</span>
        </button>
      </div>

      <div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Expense Categories</h2>
          <CategoryGrid categories={expenseCategories} onEdit={openEditModal} onDelete={deleteCategory} />
      </div>

      <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Income Categories</h2>
          <CategoryGrid categories={incomeCategories} onEdit={openEditModal} onDelete={deleteCategory} />
      </div>


      {isModalOpen && (
        <CategoryForm
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          category={editingCategory}
        />
      )}
    </div>
  );
};

export default Categories;
