import React, { useState } from 'react';
import { Modal, Button, List, Input, Form, Space, Popconfirm, Spin, Empty } from 'antd';
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
  const {
    categories,
    categoriesLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useTodos();
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState(predefinedColors[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      if (editingId !== null) {
        await updateCategory(editingId, {
          name: values.name,
          color: selectedColor,
        });
        setEditingId(null);
      } else {
        await addCategory({
          name: values.name,
          color: selectedColor,
        });
      }

      form.resetFields();
      setSelectedColor(predefinedColors[0]);
    } catch (error) {
      // Error sudah di-handle di context dengan message.error
      console.error('Failed to save category:', error);
    } finally {
      setSubmitting(false);
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

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
    } catch (error) {
      // Error sudah di-handle di context
      console.error('Failed to delete category:', error);
    }
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
            <Input placeholder="Category name" disabled={submitting} />
          </Form.Item>

          <Form.Item>
            <Space>
              {predefinedColors.map((color) => (
                <div
                  key={color}
                  onClick={() => !submitting && setSelectedColor(color)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.5 : 1,
                    border:
                      selectedColor === color ? '2px solid #000' : '2px solid transparent',
                  }}
                />
              ))}
            </Space>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusOutlined />}
                loading={submitting}
              >
                {editingId !== null ? 'Update' : 'Add'}
              </Button>
              {editingId !== null && (
                <Button onClick={handleCancel} disabled={submitting}>
                  Cancel
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </div>

      {categoriesLoading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : categories.length === 0 ? (
        <Empty
          description="No categories yet. Create your first category!"
          style={{ padding: '40px 0' }}
        />
      ) : (
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
                  disabled={submitting}
                />,
                <Popconfirm
                  key="delete"
                  title="Delete category"
                  description="Are you sure you want to delete this category?"
                  onConfirm={() => handleDelete(category.id)}
                  okText="Yes"
                  cancelText="No"
                  disabled={submitting}
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={submitting}
                  />
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
      )}
    </Modal>
  );
};
