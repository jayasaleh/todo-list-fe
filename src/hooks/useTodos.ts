import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoApi, Todo, TodoPaginationParams, CreateTodoRequest, UpdateTodoRequest } from '@/services/todoApi';
import { message } from 'antd';
import { PAGE_SIZE } from '@/constants';

// Query keys
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (params?: TodoPaginationParams) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

// Hook untuk fetch todos dengan pagination
export const useTodosQuery = (params?: TodoPaginationParams) => {
  return useQuery({
    queryKey: todoKeys.list(params),
    queryFn: () => todoApi.getTodos(params || { page: 1, limit: PAGE_SIZE }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Hook untuk fetch todo by ID
export const useTodoQuery = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => todoApi.getTodo(id),
    enabled: enabled && !!id,
  });
};

// Hook untuk create todo
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequest) => todoApi.createTodo(data),
    onSuccess: () => {
      message.success('Todo created successfully');
      // Invalidate todos list queries to refetch
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to create todo';
      message.error(errorMessage);
    },
  });
};

// Hook untuk update todo
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTodoRequest }) =>
      todoApi.updateTodo(id, data),
    onSuccess: (response, variables) => {
      message.success('Todo updated successfully');
      // Invalidate todos list and detail queries
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(variables.id) });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to update todo';
      message.error(errorMessage);
    },
  });
};

// Hook untuk delete todo
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoApi.deleteTodo(id),
    onSuccess: () => {
      message.success('Todo deleted successfully');
      // Invalidate todos list queries to refetch
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to delete todo';
      message.error(errorMessage);
    },
  });
};

// Hook untuk toggle todo complete
export const useToggleTodoComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => todoApi.toggleComplete(id),
    onSuccess: (response, id) => {
      // Invalidate todos list and detail queries
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to update todo';
      message.error(errorMessage);
    },
  });
};

