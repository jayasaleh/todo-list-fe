import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { useTodos, TodoWithCategory } from '@/contexts/TodoContext';
import { createTodoSchema, updateTodoSchema, type CreateTodoInput } from '@/validations';
import { validateWithZod } from '@/utils/validation';
import dayjs from 'dayjs';

interface TodoFormProps {
  open: boolean;
  onCancel: () => void;
  editingTodo?: TodoWithCategory | null;
}

const { TextArea } = Input;
const { Option } = Select;

export const TodoForm: React.FC<TodoFormProps> = ({ open, onCancel, editingTodo }) => {
  const { addTodo, updateTodo, categories } = useTodos();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Only update form when modal is open
    if (!open) return;

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
      form.setFieldsValue({
        priority: 'medium',
      });
    }
  }, [editingTodo, form, open]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const values = await form.validateFields();

      // Validate with Zod before submitting
      if (editingTodo) {
        const validatedData = validateWithZod(updateTodoSchema, {
          title: values.title,
          description: values.description || null,
          category_id: values.category_id,
          priority: values.priority,
          due_date: values.due_date || null,
        });

        await updateTodo(editingTodo.id, {
          ...validatedData,
          due_date: validatedData.due_date || null,
        });
      } else {
        const validatedData = validateWithZod(createTodoSchema, {
          title: values.title,
          description: values.description || '',
          category_id: values.category_id,
          priority: values.priority,
          due_date: values.due_date || null,
        });

        await addTodo({
          title: validatedData.title,
          description: validatedData.description || '',
          category_id: validatedData.category_id,
          priority: validatedData.priority,
          due_date: validatedData.due_date || null,
          completed: false,
        });
      }

      form.resetFields();
      onCancel();
    } catch (error) {
      if (error instanceof Error) {
        // Zod validation error
        console.error('Validation error:', error.message);
      } else {
        // API error (already handled in context)
        console.error('API error:', error);
      }
    } finally {
      setSubmitting(false);
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
        <Button key="cancel" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={submitting}>
          {editingTodo ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        initialValues={{
          priority: 'medium',
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: 'Title is required' },
            { min: 1, message: 'Title cannot be empty' },
            { max: 200, message: 'Title must be less than 200 characters' },
          ]}
        >
          <Input placeholder="Enter todo title" disabled={submitting} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ max: 1000, message: 'Description must be less than 1000 characters' }]}
        >
          <TextArea rows={3} placeholder="Enter description (optional)" disabled={submitting} />
        </Form.Item>

        <Form.Item
          name="category_id"
          label="Category"
          rules={[
            { required: true, message: 'Category is required' },
            { type: 'number', message: 'Category must be a valid selection' },
          ]}
        >
          <Select placeholder="Select a category" disabled={submitting}>
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
          rules={[
            { required: true, message: 'Priority is required' },
            {
              validator: (_, value) => {
                if (!value || !['high', 'medium', 'low'].includes(value)) {
                  return Promise.reject(new Error('Priority must be high, medium, or low'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Select disabled={submitting}>
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="due_date"
          label="Due Date"
          rules={[
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value && !dayjs.isDayjs(value) && !(value instanceof Date)) {
                  return Promise.reject(new Error('Invalid date format'));
                }
                // Check if date is not in the past (must be >= today)
                const today = dayjs().startOf('day');
                const selectedDate = dayjs.isDayjs(value) ? value.startOf('day') : dayjs(value).startOf('day');
                if (selectedDate.isBefore(today)) {
                  return Promise.reject(new Error('Due date cannot be in the past'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            disabled={submitting}
            disabledDate={(current) => {
              // Disable dates before today
              return current && current < dayjs().startOf('day');
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
