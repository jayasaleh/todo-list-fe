import { useMemo, useState } from 'react';
import { TodoWithCategory } from '@/contexts/TodoContext';

export interface TodoFilters {
  searchQuery: string;
  categoryId: number | null;
  priority: string | null;
}

export const useTodoFilters = (todos: TodoWithCategory[]) => {
  const [filters, setFilters] = useState<TodoFilters>({
    searchQuery: '',
    categoryId: null,
    priority: null,
  });

  const filteredTodos = useMemo(() => {
    let result = todos;

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((todo) => todo.title.toLowerCase().includes(query));
    }

    // Filter by category
    if (filters.categoryId !== null) {
      result = result.filter((todo) => todo.category_id === filters.categoryId);
    }

    // Filter by priority
    if (filters.priority) {
      result = result.filter((todo) => todo.priority === filters.priority);
    }

    return result;
  }, [todos, filters]);

  const updateFilters = (updates: Partial<TodoFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      categoryId: null,
      priority: null,
    });
  };

  const hasActiveFilters = filters.searchQuery !== '' || 
                           filters.categoryId !== null || 
                           filters.priority !== null;

  return {
    filters,
    filteredTodos,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
};

