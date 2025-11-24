import React, { useState } from 'react';
import { Modal, Button, List, Input, Form, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTodos, Category } from '@/contexts/TodoContext';

interface CategoryManagerProps {
  open: boolean;
  onCancel: () => void;
}

const predefinedColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

export const CategoryManager: React.FC<CategoryManagerProps> = ({ open, onCancel }) => {
  const { categories, addCategory, updateCategory, deleteCategory } = useTodos();
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId !== null) {
        updateCategory(editingId, {
          name: values.name,
          color: selectedColor,
        });
        setEditingId(null);
      } else {
        addCategory({
          name: values.name,
          color: selectedColor,
        });
      }
      
      form.resetFields();
      setSelectedColor(predefinedColors[0]);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    form.setFieldsValue({ name: category.name });
    setSelectedColor(category.color);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingId(null);
    setSelectedColor(predefinedColors[0]);
  };

  return (
    <Modal
      title="Manage Categories"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div className="mb-4">
        <Form form={form} layout="inline" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter category name' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Category name" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              {predefinedColors.map((color) => (
                <div
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: selectedColor === color ? '2px solid #000' : '2px solid transparent',
                  }}
                />
              ))}
            </Space>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                {editingId !== null ? 'Update' : 'Add'}
              </Button>
              {editingId !== null && (
                <Button onClick={handleCancel}>Cancel</Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>

      <List
        dataSource={categories}
        renderItem={(category) => (
          <List.Item
            actions={[
              <Button
                key="edit"
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(category)}
              />,
              <Popconfirm
                key="delete"
                title="Delete category"
                description="Are you sure you want to delete this category?"
                onConfirm={() => deleteCategory(category.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="text" danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: category.color,
                  }}
                />
              }
              title={category.name}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};
