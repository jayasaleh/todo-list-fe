import React from 'react';
import { Empty, Pagination } from 'antd';
import { TodoItem } from './TodoItem';
import { TodoWithCategory } from '@/contexts/TodoContext';
import { PAGE_SIZE } from '@/constants';

interface TodoListProps {
  todos: TodoWithCategory[];
  totalItems: number;
  currentPage: number;
  onToggleComplete: (id: number) => void;
  onEdit: (todo: TodoWithCategory) => void;
  onDelete: (id: number) => void;
  onPageChange: (page: number) => void;
  isEmpty: boolean;
  hasActiveFilters: boolean;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  totalItems,
  currentPage,
  onToggleComplete,
  onEdit,
  onDelete,
  onPageChange,
  isEmpty,
  hasActiveFilters,
}) => {
  if (isEmpty) {
    return (
      <Empty
        description={
          hasActiveFilters
            ? 'No todos found matching your filters'
            : 'No todos yet. Create your first todo!'
        }
        className="my-12"
      />
    );
  }

  return (
    <>
      <div className="space-y-3">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {totalItems > PAGE_SIZE && (
        <div className="flex justify-center mt-6">
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={PAGE_SIZE}
            onChange={onPageChange}
            showSizeChanger={false}
            showTotal={(total) => `Total ${total} todos`}
          />
        </div>
      )}
    </>
  );
};

