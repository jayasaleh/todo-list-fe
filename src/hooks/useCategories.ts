import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi, Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/services/categoryApi';
import { message } from 'antd';

// Query keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

// Hook untuk fetch categories
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryApi.getCategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook untuk fetch category by ID
export const useCategoryQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getCategory(id),
    enabled: enabled && !!id,
  });
};

// Hook untuk create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryApi.createCategory(data),
    onSuccess: () => {
      message.success('Category created successfully');
      // Invalidate categories list queries to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create category';
      message.error(errorMessage);
    },
  });
};

// Hook untuk update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoryApi.updateCategory(id, data),
    onSuccess: (response, variables) => {
      message.success('Category updated successfully');
      // Invalidate categories list and detail queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(variables.id) });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to update category';
      message.error(errorMessage);
    },
  });
};

// Hook untuk delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      message.success('Category deleted successfully');
      // Invalidate categories list queries to refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      // Also invalidate todos list because category_id might be affected
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to delete category';
      message.error(errorMessage);
    },
  });
};

