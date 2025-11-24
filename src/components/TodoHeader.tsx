import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import { PlusOutlined, TagsOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

interface TodoHeaderProps {
  onNewTodoClick: () => void;
  onCategoriesClick: () => void;
}

export const TodoHeader: React.FC<TodoHeaderProps> = ({
  onNewTodoClick,
  onCategoriesClick,
}) => {
  return (
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
            <Button icon={<TagsOutlined />} onClick={onCategoriesClick}>
              Categories
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={onNewTodoClick}>
              New Todo
            </Button>
          </Space>
        </div>
      </div>
    </Header>
  );
};

