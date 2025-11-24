import { z } from 'zod';

/**
 * Convert Zod schema to Ant Design Form rules
 * This helper allows us to use Zod schemas with Ant Design Form
 */
export const zodToAntdRules = <T extends z.ZodTypeAny>(schema: T) => {
  return {
    validator: async (_: any, value: any) => {
      try {
        await schema.parseAsync(value);
        return Promise.resolve();
      } catch (error) {
        if (error instanceof z.ZodError) {
          const firstError = error.errors[0];
          return Promise.reject(new Error(firstError.message));
        }
        return Promise.reject(new Error('Validation failed'));
      }
    },
  };
};

/**
 * Validate a value against a Zod schema
 * Returns the parsed value if valid, throws error if invalid
 */
export const validateWithZod = <T extends z.ZodTypeAny>(
  schema: T,
  value: unknown
): z.infer<T> => {
  return schema.parse(value);
};

/**
 * Safe validate - returns result object instead of throwing
 */
export const safeValidateWithZod = <T extends z.ZodTypeAny>(
  schema: T,
  value: unknown
): { success: true; data: z.infer<T> } | { success: false; error: z.ZodError } => {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
};

