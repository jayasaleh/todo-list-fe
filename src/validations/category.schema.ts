import { z } from 'zod';

// Color hex validation regex
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

// Create Category Schema
export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'Category name is required' })
    .min(1, 'Category name cannot be empty')
    .max(100, 'Category name must be less than 100 characters')
    .trim()
    .refine(
      (val) => val.length > 0 && val.trim().length > 0,
      {
        message: 'Category name cannot be only whitespace',
      }
    ),
  
  color: z
    .string()
    .regex(hexColorRegex, 'Color must be a valid hex color (e.g., #3B82F6)')
    .optional()
    .default('#3B82F6'),
});

// Update Category Schema
export const updateCategorySchema = z
  .object({
    name: z
      .string()
      .min(1, 'Category name cannot be empty')
      .max(100, 'Category name must be less than 100 characters')
      .trim()
      .optional()
      .refine(
        (val) => !val || (val.length > 0 && val.trim().length > 0),
        {
          message: 'Category name cannot be only whitespace',
        }
      ),
    
    color: z
      .string()
      .regex(hexColorRegex, 'Color must be a valid hex color (e.g., #3B82F6)')
      .optional(),
  })
  .refine(
    (data) => {
      // At least one field must be provided
      return data.name !== undefined || data.color !== undefined;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );

// Type inference from schemas
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

