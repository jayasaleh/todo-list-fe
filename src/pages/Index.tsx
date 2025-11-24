import React, { useState, useCallback, useEffect } from 'react';
import { Layout, Spin } from 'antd';
import { TodoProvider, useTodos, TodoWithCategory } from '@/contexts/TodoContext';
import { TodoHeader } from '@/components/TodoHeader';
import { TodoFilters } from '@/components/TodoFilters';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import { CategoryManager } from '@/components/CategoryManager';
import { PAGE_SIZE, LAYOUT_STYLES } from '@/constants';

const { Content } = Layout;

const TodoListPageContent: React.FC = () => {
  const {
    todos,
    categories,
    todosLoading,
    pagination,
    fetchTodos,
    toggleTodoComplete,
    deleteTodo,
  } = useTodos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoWithCategory | null>(null);
  const [filters, setFilters] = useState({
    searchQuery: '',
    categoryId: null as number | null,
    priority: null as string | null,
    completed: null as boolean | null,
  });

  // Fetch todos on mount and when filters change
  useEffect(() => {
    const fetchParams = {
      page: 1, // Always start from page 1 when filters change
      limit: PAGE_SIZE,
      search: filters.searchQuery || undefined,
      category_id: filters.categoryId || undefined,
      priority: filters.priority || undefined,
      completed: filters.completed !== null ? filters.completed : undefined,
    };

    fetchTodos(fetchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.searchQuery, filters.categoryId, filters.priority, filters.completed]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      const fetchParams = {
        page,
        limit: PAGE_SIZE,
        search: filters.searchQuery || undefined,
        category_id: filters.categoryId || undefined,
        priority: filters.priority || undefined,
        completed: filters.completed !== null ? filters.completed : undefined,
      };
      fetchTodos(fetchParams);
    },
    [fetchTodos, filters]
  );

  const handleNewTodo = useCallback(() => {
    setEditingTodo(null);
    setIsFormOpen(true);
  }, []);

  const handleEditTodo = useCallback((todo: TodoWithCategory) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  }, []);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingTodo(null);
    // TanStack Query will automatically refetch after mutation
  }, []);

  const handleCategoryModalClose = useCallback(() => {
    setIsCategoryModalOpen(false);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: value }));
  }, []);

  const handleCategoryChange = useCallback((value: number | null) => {
    setFilters((prev) => ({ ...prev, categoryId: value }));
  }, []);

  const handlePriorityChange = useCallback((value: string | null) => {
    setFilters((prev) => ({ ...prev, priority: value }));
  }, []);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.categoryId !== null ||
    filters.priority !== null ||
    filters.completed !== null;

  return (
    <Layout className="min-h-screen" style={LAYOUT_STYLES.container}>
      <TodoHeader
        onNewTodoClick={handleNewTodo}
        onCategoriesClick={() => setIsCategoryModalOpen(true)}
      />

      <Content className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <TodoFilters
            categories={categories}
            searchQuery={filters.searchQuery}
            categoryId={filters.categoryId}
            priority={filters.priority}
            onSearchChange={handleSearchChange}
            onCategoryChange={handleCategoryChange}
            onPriorityChange={handlePriorityChange}
          />

          {todosLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            <TodoList
              todos={todos}
              totalItems={pagination?.total || 0}
              currentPage={pagination?.current_page || 1}
              onToggleComplete={toggleTodoComplete}
              onEdit={handleEditTodo}
              onDelete={deleteTodo}
              onPageChange={handlePageChange}
              isEmpty={todos.length === 0}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>
      </Content>

      <TodoForm
        open={isFormOpen}
        onCancel={handleFormClose}
        editingTodo={editingTodo}
      />

      <CategoryManager
        open={isCategoryModalOpen}
        onCancel={handleCategoryModalClose}
      />
    </Layout>
  );
};

const Index: React.FC = () => {
  return (
    <TodoProvider>
      <TodoListPageContent />
    </TodoProvider>
  );
};

export default Index;
