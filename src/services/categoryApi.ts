import apiClient, { ApiResponse } from './api';

// Category types matching backend DTOs
export interface Category {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  color?: string;
}

// Category API functions
export const categoryApi = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  // Get category by ID
  getCategory: async (id: number): Promise<ApiResponse<Category>> => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  // Create category
  createCategory: async (data: CreateCategoryRequest): Promise<ApiResponse<Category>> => {
    const response = await apiClient.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  // Update category
  updateCategory: async (
    id: number,
    data: UpdateCategoryRequest
  ): Promise<ApiResponse<Category>> => {
    const response = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/categories/${id}`);
    return response.data;
  },
};

