import React, { useState, useCallback } from 'react';
import { Layout } from 'antd';
import { TodoProvider, useTodos, TodoWithCategory } from '@/contexts/TodoContext';
import { TodoHeader } from '@/components/TodoHeader';
import { TodoFilters } from '@/components/TodoFilters';
import { TodoList } from '@/components/TodoList';
import { TodoForm } from '@/components/TodoForm';
import { CategoryManager } from '@/components/CategoryManager';
import { useTodoFilters } from '@/hooks/useTodoFilters';
import { usePagination } from '@/hooks/usePagination';
import { PAGE_SIZE, LAYOUT_STYLES } from '@/constants';

const { Content } = Layout;

const TodoListPageContent: React.FC = () => {
  const { todos, categories, toggleTodoComplete, deleteTodo } = useTodos();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoWithCategory | null>(null);

  const {
    filters,
    filteredTodos,
    updateFilters,
    hasActiveFilters,
  } = useTodoFilters(todos);

  const {
    currentPage,
    paginatedItems: paginatedTodos,
    totalItems,
    setCurrentPage,
  } = usePagination({ items: filteredTodos, pageSize: PAGE_SIZE });

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
  }, []);

  const handleCategoryModalClose = useCallback(() => {
    setIsCategoryModalOpen(false);
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      updateFilters({ searchQuery: value });
      setCurrentPage(1); // Reset to first page on filter change
    },
    [updateFilters, setCurrentPage]
  );

  const handleCategoryChange = useCallback(
    (value: number | null) => {
      updateFilters({ categoryId: value });
      setCurrentPage(1);
    },
    [updateFilters, setCurrentPage]
  );

  const handlePriorityChange = useCallback(
    (value: string | null) => {
      updateFilters({ priority: value });
      setCurrentPage(1);
    },
    [updateFilters, setCurrentPage]
  );

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

          <TodoList
            todos={paginatedTodos}
            totalItems={totalItems}
            currentPage={currentPage}
            onToggleComplete={toggleTodoComplete}
            onEdit={handleEditTodo}
            onDelete={deleteTodo}
            onPageChange={setCurrentPage}
            isEmpty={paginatedTodos.length === 0}
            hasActiveFilters={hasActiveFilters}
          />
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
