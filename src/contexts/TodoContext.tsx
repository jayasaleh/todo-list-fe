import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

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
  addTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => void;
  updateTodo: (id: number, updates: Partial<Todo>) => void;
  deleteTodo: (id: number) => void;
  toggleTodoComplete: (id: number) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  updateCategory: (id: number, updates: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const defaultCategories: Category[] = [
  { id: 1, name: 'Work', color: '#3B82F6', created_at: new Date().toISOString() },
  { id: 2, name: 'Personal', color: '#10B981', created_at: new Date().toISOString() },
  { id: 3, name: 'Shopping', color: '#F59E0B', created_at: new Date().toISOString() },
];

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
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [nextTodoId, setNextTodoId] = useState(4);
  const [nextCategoryId, setNextCategoryId] = useState(4);

  const getTodosWithCategories = useCallback((): TodoWithCategory[] => {
    return todos.map((todo) => ({
      ...todo,
      category: categories.find((cat) => cat.id === todo.category_id),
    }));
  }, [todos, categories]);

  const addTodo = useCallback((todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => {
    const now = new Date().toISOString();
    const newTodo: Todo = {
      ...todo,
      id: nextTodoId,
      created_at: now,
      updated_at: now,
    };
    setTodos((prev) => [newTodo, ...prev]);
    setNextTodoId((prev) => prev + 1);
  }, [nextTodoId]);

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

  const addCategory = useCallback(
    (category: Omit<Category, 'id' | 'created_at'>) => {
      const newCategory: Category = {
        ...category,
        id: nextCategoryId,
        created_at: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
      setNextCategoryId((prev) => prev + 1);
    },
    [nextCategoryId]
  );

  const updateCategory = useCallback((id: number, updates: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((category) => (category.id === id ? { ...category, ...updates } : category))
    );
  }, []);

  const deleteCategory = useCallback((id: number) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
    // Remove category from todos
    setTodos((prev) =>
      prev.map((todo) => (todo.category_id === id ? { ...todo, category_id: null } : todo))
    );
  }, []);

  const value: TodoContextType = {
    todos: getTodosWithCategories(),
    categories,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodoComplete,
    addCategory,
    updateCategory,
    deleteCategory,
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
