import { z } from 'zod';
import dayjs from 'dayjs';

// Priority enum
export const PriorityEnum = z.enum(['high', 'medium', 'low'], {
  errorMap: () => ({ message: 'Priority must be high, medium, or low' }),
});

// Create Todo Schema
export const createTodoSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .default(''),
  
  category_id: z
    .number({ required_error: 'Category is required' })
    .int('Category ID must be an integer')
    .positive('Category ID must be positive'),
  
  priority: PriorityEnum,
  
  due_date: z
    .any()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        // Check if it's a dayjs object (has isValid and toISOString methods)
        if (val && typeof val === 'object' && 'isValid' in val && 'toISOString' in val) {
          if (!val.isValid()) return false;
          // Check if date is not in the past (must be >= today)
          const today = dayjs().startOf('day');
          const selectedDate = dayjs(val).startOf('day');
          return selectedDate.isSame(today) || selectedDate.isAfter(today);
        }
        // Check if it's a Date object
        if (val instanceof Date) {
          if (isNaN(val.getTime())) return false;
          // Check if date is not in the past (must be >= today)
          const today = dayjs().startOf('day');
          const selectedDate = dayjs(val).startOf('day');
          return selectedDate.isSame(today) || selectedDate.isAfter(today);
        }
        // Check if it's a valid ISO string
        if (typeof val === 'string') {
          const parsed = Date.parse(val);
          if (isNaN(parsed)) return false;
          // Check if date is not in the past (must be >= today)
          const today = dayjs().startOf('day');
          const selectedDate = dayjs(parsed).startOf('day');
          return selectedDate.isSame(today) || selectedDate.isAfter(today);
        }
        return false;
      },
      { message: 'Due date cannot be in the past' }
    )
    .transform((val) => {
      if (!val) return null;
      // Handle dayjs object
      if (val && typeof val === 'object' && 'isValid' in val && 'toISOString' in val) {
        return val.isValid() ? val.toISOString() : null;
      }
      // Handle Date object
      if (val instanceof Date) {
        return val.toISOString();
      }
      // Handle string (already ISO format)
      if (typeof val === 'string') {
        return val;
      }
      return null;
    }),
});

// Update Todo Schema (all fields optional except at least one must be provided)
// Note: category_id is required if provided (cannot be null)
export const updateTodoSchema = z
  .object({
    title: z
      .string()
      .min(1, 'Title cannot be empty')
      .max(200, 'Title must be less than 200 characters')
      .trim()
      .optional(),
    
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional()
      .nullable(),
    
    category_id: z
      .number()
      .int('Category ID must be an integer')
      .positive('Category ID must be positive')
      .optional(),
    
    priority: PriorityEnum.optional(),
    
    completed: z.boolean().optional(),
    
    due_date: z
      .any()
      .optional()
      .nullable()
      .refine(
        (val) => {
          if (!val) return true;
          // Check if it's a dayjs object (has isValid and toISOString methods)
          if (val && typeof val === 'object' && 'isValid' in val && 'toISOString' in val) {
            if (!val.isValid()) return false;
            // Check if date is not in the past (must be >= today)
            const today = dayjs().startOf('day');
            const selectedDate = dayjs(val).startOf('day');
            return selectedDate.isSame(today) || selectedDate.isAfter(today);
          }
          // Check if it's a Date object
          if (val instanceof Date) {
            if (isNaN(val.getTime())) return false;
            // Check if date is not in the past (must be >= today)
            const today = dayjs().startOf('day');
            const selectedDate = dayjs(val).startOf('day');
            return selectedDate.isSame(today) || selectedDate.isAfter(today);
          }
          // Check if it's a valid ISO string
          if (typeof val === 'string') {
            const parsed = Date.parse(val);
            if (isNaN(parsed)) return false;
            // Check if date is not in the past (must be >= today)
            const today = dayjs().startOf('day');
            const selectedDate = dayjs(parsed).startOf('day');
            return selectedDate.isSame(today) || selectedDate.isAfter(today);
          }
          return false;
        },
        { message: 'Due date cannot be in the past' }
      )
      .transform((val) => {
        if (!val) return null;
        // Handle dayjs object
        if (val && typeof val === 'object' && 'isValid' in val && 'toISOString' in val) {
          return val.isValid() ? val.toISOString() : null;
        }
        // Handle Date object
        if (val instanceof Date) {
          return val.toISOString();
        }
        // Handle string (already ISO format)
        if (typeof val === 'string') {
          return val;
        }
        return null;
      }),
  })
  .refine(
    (data) => {
      // At least one field must be provided
      return (
        data.title !== undefined ||
        data.description !== undefined ||
        data.category_id !== undefined ||
        data.priority !== undefined ||
        data.completed !== undefined ||
        data.due_date !== undefined
      );
    },
    {
      message: 'At least one field must be provided for update',
    }
  )
  .refine(
    (data) => {
      // If category_id is provided, it must be a valid positive number
      if (data.category_id !== undefined && (data.category_id <= 0 || !Number.isInteger(data.category_id))) {
        return false;
      }
      return true;
    },
    {
      message: 'Category ID must be a valid positive integer',
      path: ['category_id'],
    }
  );

// Type inference from schemas
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;

