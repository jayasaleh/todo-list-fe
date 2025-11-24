import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { useTodos, Todo } from '@/contexts/TodoContext';
import dayjs from 'dayjs';

interface TodoFormProps {
  open: boolean;
  onCancel: () => void;
  editingTodo?: Todo | null;
}

const { TextArea } = Input;
const { Option } = Select;

export const TodoForm: React.FC<TodoFormProps> = ({ open, onCancel, editingTodo }) => {
  const { addTodo, updateTodo, categories } = useTodos();
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTodo) {
      form.setFieldsValue({
        title: editingTodo.title,
        description: editingTodo.description,
        category_id: editingTodo.category_id,
        priority: editingTodo.priority,
        due_date: editingTodo.due_date ? dayjs(editingTodo.due_date) : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingTodo, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const todoData = {
        title: values.title,
        description: values.description || '',
        category_id: values.category_id || null,
        priority: values.priority,
        due_date: values.due_date ? values.due_date.toISOString() : null,
        completed: editingTodo?.completed || false,
      };

      if (editingTodo) {
        updateTodo(editingTodo.id, todoData);
      } else {
        addTodo(todoData);
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={editingTodo ? 'Edit Todo' : 'Create New Todo'}
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {editingTodo ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          priority: 'medium',
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter todo title" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <TextArea rows={3} placeholder="Enter description (optional)" />
        </Form.Item>

        <Form.Item name="category_id" label="Category">
          <Select placeholder="Select a category" allowClear>
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
        </Form.Item>

        <Form.Item
          name="priority"
          label="Priority"
          rules={[{ required: true, message: 'Please select a priority' }]}
        >
          <Select>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item name="due_date" label="Due Date">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
