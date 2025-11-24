import React from 'react';
import { Input, Select, Space } from 'antd';
import { Category } from '@/contexts/TodoContext';
import { PRIORITY_OPTIONS } from '@/constants';

const { Search } = Input;
const { Option } = Select;

interface TodoFiltersProps {
  categories: Category[];
  searchQuery: string;
  categoryId: number | null;
  priority: string | null;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: number | null) => void;
  onPriorityChange: (value: string | null) => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  categories,
  searchQuery,
  categoryId,
  priority,
  onSearchChange,
  onCategoryChange,
  onPriorityChange,
}) => {
  return (
    <div
      className="mb-6 p-4 rounded-lg shadow-soft"
      style={{ background: 'hsl(var(--card))' }}
    >
      <Space direction="vertical" className="w-full" size="middle">
        <Search
          placeholder="Search todos by title..."
          allowClear
          size="large"
          value={searchQuery}
          onSearch={onSearchChange}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            placeholder="Filter by category"
            allowClear
            className="w-full sm:w-48"
            value={categoryId}
            onChange={onCategoryChange}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: category.color,
                    marginRight: 8,
                  }}
                />
                {category.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Filter by priority"
            allowClear
            className="w-full sm:w-48"
            value={priority}
            onChange={onPriorityChange}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </Space>
    </div>
  );
};

