import React, { useState, useMemo } from 'react';
import { Layout, Button, Input, Select, Space, Typography, Pagination, Empty } from 'antd';
import { PlusOutlined, TagsOutlined } from '@ant-design/icons';
import { TodoProvider, useTodos, TodoWithCategory } from '@/contexts/TodoContext';
import { TodoItem } from '@/components/TodoItem';
import { TodoForm } from '@/components/TodoForm';
import { CategoryManager } from '@/components/CategoryManager';

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const TodoListContent: React.FC = () => {
  const { todos, categories, toggleTodoComplete, deleteTodo } = useTodos();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<TodoWithCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Search by title
    if (searchQuery) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== null) {
      filtered = filtered.filter((todo) => todo.category_id === filterCategory);
    }

    // Filter by priority
    if (filterPriority) {
      filtered = filtered.filter((todo) => todo.priority === filterPriority);
    }

    return filtered;
  }, [todos, searchQuery, filterCategory, filterPriority]);

  // Paginate todos
  const paginatedTodos = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTodos.slice(startIndex, endIndex);
  }, [filteredTodos, currentPage]);

  const handleEdit = (todo: TodoWithCategory) => {
    setEditingTodo(todo);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTodo(null);
  };

  return (
    <Layout className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
      <Header
        className="shadow-soft"
        style={{
          background: 'hsl(var(--card))',
          padding: '0 24px',
          height: 'auto',
          lineHeight: 'normal',
        }}
      >
        <div className="max-w-6xl mx-auto py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Title level={2} className="m-0" style={{ color: 'hsl(var(--primary))' }}>
              My Todo List
            </Title>
            <Space>
              <Button
                icon={<TagsOutlined />}
                onClick={() => setIsCategoryModalOpen(true)}
              >
                Categories
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsFormOpen(true)}
              >
                New Todo
              </Button>
            </Space>
          </div>
        </div>
      </Header>

      <Content className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="mb-6 p-4 rounded-lg shadow-soft" style={{ background: 'hsl(var(--card))' }}>
            <Space direction="vertical" className="w-full" size="middle">
              <Search
                placeholder="Search todos by title..."
                allowClear
                size="large"
                onSearch={setSearchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  placeholder="Filter by category"
                  allowClear
                  className="w-full sm:w-48"
                  onChange={(value) => setFilterCategory(value)}
                  value={filterCategory}
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
                  onChange={(value) => setFilterPriority(value)}
                  value={filterPriority}
                >
                  <Option value="high">High</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="low">Low</Option>
                </Select>
              </div>
            </Space>
          </div>

          {/* Todo List */}
          {paginatedTodos.length === 0 ? (
            <Empty
              description={
                searchQuery || filterCategory || filterPriority
                  ? 'No todos found matching your filters'
                  : 'No todos yet. Create your first todo!'
              }
              className="my-12"
            />
          ) : (
            <>
              <div className="space-y-3">
                {paginatedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={toggleTodoComplete}
                    onEdit={handleEdit}
                    onDelete={deleteTodo}
                  />
                ))}
              </div>

              {/* Pagination */}
              {filteredTodos.length > pageSize && (
                <div className="flex justify-center mt-6">
                  <Pagination
                    current={currentPage}
                    total={filteredTodos.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showSizeChanger={false}
                    showTotal={(total) => `Total ${total} todos`}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </Content>

      {/* Modals */}
      <TodoForm
        open={isFormOpen}
        onCancel={handleFormClose}
        editingTodo={editingTodo}
      />
      
      <CategoryManager
        open={isCategoryModalOpen}
        onCancel={() => setIsCategoryModalOpen(false)}
      />
    </Layout>
  );
};

const Index: React.FC = () => {
  return (
    <TodoProvider>
      <TodoListContent />
    </TodoProvider>
  );
};

export default Index;
