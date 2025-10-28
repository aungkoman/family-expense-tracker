
import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { Modal } from './ui/Modal';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>) => void;
  category: Category | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#4CAF50');

  useEffect(() => {
    if (category) {
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
    } else {
      resetForm();
    }
  }, [category, isOpen]);

  const resetForm = () => {
    setName('');
    setIcon('❓');
    setColor('#4CAF50');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !icon || !color) {
      alert("Please fill all fields");
      return;
    }
    onSave({
      name,
      icon,
      color,
      isDefault: category?.isDefault || false,
    });
    resetForm();
  };
  
  const FormField: React.FC<{label: string, children: React.ReactNode}> = ({label, children}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <div className="mt-1">{children}</div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add Category'}>
      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
          <FormField label="Category Name">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Icon (Emoji)">
              <input
                type="text"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                required
                maxLength={2}
              />
            </FormField>
            <FormField label="Color">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full h-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer"
                required
              />
            </FormField>
          </div>
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
