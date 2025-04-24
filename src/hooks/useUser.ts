import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query"

export interface User {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
}

export interface NewUser {
  name: string;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  phone_number?: string;
  avatar_url?: string;
  role?: string;
  password?: string;
}

const axiosUrl = 'http://localhost:8080'

export const useGetUser = () => {
  const state = useQuery<User[]>(() => ({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${axiosUrl}/api/users`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch users", err);
        throw err;
      }
    },
  }))
  return state
}

export const usePostUser = () => {
  const queryClient = useQueryClient();
  const state = useMutation(() => ({
    mutationKey: ['users'],
    mutationFn: async (user: NewUser) => {
      try {
        const res = await axios.post(`${axiosUrl}/api/users`, user);
        return res.data;
      } catch (err) {
        console.error("Failed to post user", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  }))
  return state
}

export const useUpdateUser = (p0: { onSuccess: () => void; onError: () => "Gagal membuat password"; }) => {
  const queryClient = useQueryClient();
  const state = useMutation(() => ({
    mutationKey: ['users', 'update'],
    mutationFn: async ({ id, data }: { id: string, data: UpdateUser }) => {
      try {
        const res = await axios.patch(`${axiosUrl}/api/users/${id}`, data);
        return res.data;
      } catch (err) {
        console.error("Failed to update user", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  }))
  return state;
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const state = useMutation(() => ({
    mutationKey: ['users', 'delete'],
    mutationFn: async (id: string) => {
      try {
        const res = await axios.delete(`${axiosUrl}/api/users/${id}`);
        return res.data;
      } catch (err) {
        console.error("Failed to delete user", err);
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  }))
  return state;
}
