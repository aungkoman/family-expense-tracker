import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Expense, Category } from '../types';

interface CategoryPieChartProps {
  expenses: Expense[];
  categories: Category[];
}

// Add a type for the data structure used by the chart
interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-700 p-2 border border-gray-200 dark:border-gray-600 rounded shadow-sm">
          <p className="label font-bold text-gray-800 dark:text-white">{`${payload[0].name} : $${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
};

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ expenses, categories }) => {
  // FIX: Explicitly type the Map to ensure `get` returns a typed value (`Category | undefined`) instead of `unknown`, which resolves all downstream type inference errors.
  const categoryMap = new Map<string, Category>(categories.map(c => [c.id, c]));

  // FIX: Cast the initial value of reduce to `Record<string, ChartDataItem>` to correctly type
  // the accumulator `acc` and the resulting `data` object. This resolves downstream type
  // errors when accessing properties on chart data.
  const data = expenses.reduce((acc, expense) => {
    const category = categoryMap.get(expense.categoryId);
    const categoryName = category?.name || 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = { 
        name: categoryName, 
        value: 0, 
        fill: category?.color || '#9E9E9E' 
      };
    }
    acc[categoryName].value += expense.amount;
    return acc;
  }, {} as Record<string, ChartDataItem>);

  const chartData = Object.values(data).sort((a,b) => b.value - a.value);

  if (chartData.length === 0) {
    return <div className="text-center text-gray-500 dark:text-gray-400">No data to display</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
