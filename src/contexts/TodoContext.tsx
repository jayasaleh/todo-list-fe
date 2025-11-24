import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Category } from '@/services/categoryApi';
import { Todo, TodoPaginationParams, UpdateTodoRequest } from '@/services/todoApi';
import {
  useTodosQuery,
  useCreateTodo,
  useUpdateTodo,
  useDeleteTodo,
  useToggleTodoComplete,
} from '@/hooks/useTodos';
import {
  useCategoriesQuery,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import { PAGE_SIZE } from '@/constants';

export interface TodoWithCategory extends Todo {
  category?: Category;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface TodoContextType {
  // State
  todos: TodoWithCategory[];
  categories: Category[];
  todosLoading: boolean;
  categoriesLoading: boolean;
  pagination: PaginationInfo | null;
  
  // Todo operations
  fetchTodos: (params?: TodoPaginationParams) => void;
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'category'>) => Promise<void>;
  updateTodo: (id: number, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodoComplete: (id: number) => Promise<void>;
  
  // Category operations
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  refreshCategories: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Todo queries and mutations - will be controlled by fetchTodos
  const [queryParams, setQueryParams] = useState<TodoPaginationParams | undefined>({
    page: 1,
    limit: PAGE_SIZE,
  });
  const todosQuery = useTodosQuery(queryParams);
  const createTodoMutation = useCreateTodo();
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  const toggleTodoCompleteMutation = useToggleTodoComplete();

  // Category queries and mutations
  const categoriesQuery = useCategoriesQuery();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Get todos with categories
  const todosWithCategories = useMemo((): TodoWithCategory[] => {
    const todos = todosQuery.data?.data || [];
    const categories = categoriesQuery.data?.data || [];
    
    return todos.map((todo) => ({
      ...todo,
      category: categories.find((cat) => cat.id === todo.category_id) || undefined,
    }));
  }, [todosQuery.data, categoriesQuery.data]);

  // Pagination info
  const pagination = useMemo<PaginationInfo | null>(() => {
    if (!todosQuery.data?.pagination) return null;
    return {
      current_page: todosQuery.data.pagination.current_page,
      per_page: todosQuery.data.pagination.per_page,
      total: todosQuery.data.pagination.total,
      total_pages: todosQuery.data.pagination.total_pages,
    };
  }, [todosQuery.data?.pagination]);

  // Todo operations
  const fetchTodos = (params?: TodoPaginationParams) => {
    // Update query params to trigger refetch
    if (params) {
      setQueryParams(params);
    } else {
      todosQuery.refetch();
    }
  };

  const addTodo = async (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at' | 'category'>) => {
    await createTodoMutation.mutateAsync({
      title: todo.title,
      description: todo.description || '',
      category_id: todo.category_id!,
      priority: todo.priority,
      due_date: todo.due_date || null,
    });
  };

  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    const updateData: UpdateTodoRequest = {};
    
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.category_id !== undefined) updateData.category_id = updates.category_id;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.due_date !== undefined) updateData.due_date = updates.due_date;

    await updateTodoMutation.mutateAsync({ id, data: updateData });
  };

  const deleteTodo = async (id: number) => {
    await deleteTodoMutation.mutateAsync(id);
  };

  const toggleTodoComplete = async (id: number) => {
    await toggleTodoCompleteMutation.mutateAsync(id);
  };

  // Category operations
  const addCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    await createCategoryMutation.mutateAsync({
      name: category.name,
      color: category.color || '#3B82F6',
    });
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    const updateData: { name?: string; color?: string } = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.color !== undefined) updateData.color = updates.color;

    await updateCategoryMutation.mutateAsync({ id, data: updateData });
  };

  const deleteCategory = async (id: number) => {
    await deleteCategoryMutation.mutateAsync(id);
  };

  const refreshCategories = () => {
    categoriesQuery.refetch();
  };

  const value: TodoContextType = {
    todos: todosWithCategories,
    categories: categoriesQuery.data?.data || [],
    todosLoading: todosQuery.isLoading || todosQuery.isFetching,
    categoriesLoading: categoriesQuery.isLoading || categoriesQuery.isFetching,
    pagination,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

