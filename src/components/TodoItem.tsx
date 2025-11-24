import React from 'react';
import { Card, Checkbox, Tag, Dropdown, Typography, Space, Button } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { TodoWithCategory } from '@/contexts/TodoContext';
import { format } from 'date-fns';
import type { MenuProps } from 'antd';

const { Text, Paragraph } = Typography;

interface TodoItemProps {
  todo: TodoWithCategory;
  onToggleComplete: (id: number) => void;
  onEdit: (todo: TodoWithCategory) => void;
  onDelete: (id: number) => void;
}

const priorityColors = {
  high: 'error',
  medium: 'warning',
  low: 'success',
} as const;

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => onEdit(todo),
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(todo.id),
    },
  ];

  return (
    <Card
      className="mb-3 transition-all hover:shadow-md"
      style={{
        opacity: todo.completed ? 0.7 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Text
              strong
              delete={todo.completed}
              className="text-base"
              style={{ wordBreak: 'break-word' }}
            >
              {todo.title}
            </Text>
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button type="text" icon={<MoreOutlined />} size="small" />
            </Dropdown>
          </div>

          {todo.description && (
            <Paragraph
              className="mb-2 text-muted-foreground"
              ellipsis={{ rows: 2, expandable: false }}
            >
              {todo.description}
            </Paragraph>
          )}

          <Space size={[8, 8]} wrap>
            <Tag color={priorityColors[todo.priority]}>
              {todo.priority.toUpperCase()}
            </Tag>
            
            {todo.category && (
              <Tag color={todo.category.color}>{todo.category.name}</Tag>
            )}
            
            {todo.due_date && (
              <Tag icon={<ClockCircleOutlined />}>
                {format(new Date(todo.due_date), 'MMM dd, yyyy')}
              </Tag>
            )}
          </Space>
        </div>
      </div>
    </Card>
  );
};
