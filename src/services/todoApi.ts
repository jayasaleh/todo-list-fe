import apiClient, { ApiResponse, PaginatedApiResponse } from './api';

// Todo types matching backend DTOs
export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  category_id: number;
  priority: 'high' | 'medium' | 'low';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    color: string;
    created_at: string;
  };
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  category_id: number;
  priority: 'high' | 'medium' | 'low';
  due_date?: string | null;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  category_id?: number; // Required if provided, cannot be null
  priority?: 'high' | 'medium' | 'low';
  completed?: boolean;
  due_date?: string | null;
}

export interface TodoPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  category_id?: number;
  priority?: string | null;
  completed?: boolean | null;
}

// Todo API functions
export const todoApi = {
  // Get todos with pagination and filters
  getTodos: async (params?: TodoPaginationParams): Promise<PaginatedApiResponse<Todo>> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
    if (params?.category_id !== undefined && params.category_id !== null) {
      queryParams.append('category_id', params.category_id.toString());
    }
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.completed !== undefined && params.completed !== null) {
      queryParams.append('completed', params.completed.toString());
    }

    const queryString = queryParams.toString();
    const url = `/todos${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<PaginatedApiResponse<Todo>>(url);
    return response.data;
  },

  // Get todo by ID
  getTodo: async (id: number): Promise<ApiResponse<Todo>> => {
    const response = await apiClient.get<ApiResponse<Todo>>(`/todos/${id}`);
    return response.data;
  },

  // Create todo
  createTodo: async (data: CreateTodoRequest): Promise<ApiResponse<Todo>> => {
    const response = await apiClient.post<ApiResponse<Todo>>('/todos', data);
    return response.data;
  },

  // Update todo
  updateTodo: async (id: number, data: UpdateTodoRequest): Promise<ApiResponse<Todo>> => {
    const response = await apiClient.put<ApiResponse<Todo>>(`/todos/${id}`, data);
    return response.data;
  },

  // Delete todo
  deleteTodo: async (id: number): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/todos/${id}`);
    return response.data;
  },

  // Toggle todo complete status
  toggleComplete: async (id: number): Promise<ApiResponse<Todo>> => {
    const response = await apiClient.patch<ApiResponse<Todo>>(`/todos/${id}/complete`);
    return response.data;
  },
};

