import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { categoryApi } from '@/services/categoryApi';
import { message } from 'antd';

export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category_id: number | null;
  priority: 'high' | 'medium' | 'low';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TodoWithCategory extends Todo {
  category?: Category;
}

interface TodoContextType {
  todos: TodoWithCategory[];
  categories: Category[];
  categoriesLoading: boolean;
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => void;
  updateTodo: (id: number, updates: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  toggleTodoComplete: (id: number) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const defaultTodos: Todo[] = [
  {
    id: 1,
    title: 'Complete coding challenge',
    description: 'Build a full-stack todo application for Industrix',
    completed: false,
    category_id: 1,
    priority: 'high',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Review React documentation',
    description: 'Study Context API and hooks patterns',
    completed: true,
    category_id: 1,
    priority: 'medium',
    due_date: null,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Grocery shopping',
    description: 'Buy vegetables, fruits, and essentials',
    completed: false,
    category_id: 3,
    priority: 'low',
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoryApi.getCategories();
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error: any) {
      console.error('Failed to fetch categories:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to load categories';
      message.error(errorMessage);
      // Fallback to empty array if API fails
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getTodosWithCategories = useCallback((): TodoWithCategory[] => {
    return todos.map((todo) => ({
      ...todo,
      category: categories.find((cat) => cat.id === todo.category_id),
    }));
  }, [todos, categories]);

  // Todo functions (still using local state for now)
  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      ...todo,
      id: Date.now(), // Temporary ID
      created_at: now,
      updated_at: now,
    };
    setTodos((prev) => [newTodo, ...prev]);
  }, []);

  const updateTodo = useCallback((id: number, updates: Partial<Todo>) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, ...updates, updated_at: new Date().toISOString() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodoComplete = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed, updated_at: new Date().toISOString() }
          : todo
      )
    );
  }, []);

  // Category functions with API integration
  const addCategory = useCallback(
    async (category: Omit<Category, 'id' | 'created_at'>) => {
      try {
        const response = await categoryApi.createCategory({
          name: category.name,
          color: category.color || '#3B82F6',
        });

        if (response.data) {
          setCategories((prev) => [...prev, response.data!]);
          message.success('Category created successfully');
        }
      } catch (error: any) {
        console.error('Failed to create category:', error);
        const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create category';
        message.error(errorMessage);
        throw error;
      }
    },
    []
  );

  const updateCategory = useCallback(async (id: number, updates: Partial<Category>) => {
    try {
      const updateData: { name?: string; color?: string } = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.color !== undefined) updateData.color = updates.color;

      const response = await categoryApi.updateCategory(id, updateData);

      if (response.data) {
        setCategories((prev) =>
          prev.map((category) => (category.id === id ? response.data! : category))
        );
        message.success('Category updated successfully');
      }
    } catch (error: any) {
      console.error('Failed to update category:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to update category';
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    try {
      await categoryApi.deleteCategory(id);
      setCategories((prev) => prev.filter((category) => category.id !== id));
      // Remove category from todos
      setTodos((prev) =>
        prev.map((todo) => (todo.category_id === id ? { ...todo, category_id: null } : todo))
      );
      message.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete category:', error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to delete category';
      message.error(errorMessage);
      throw error;
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  const value: TodoContextType = {
    todos: getTodosWithCategories(),
    categories,
    categoriesLoading,
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
