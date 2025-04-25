import axios from "axios"
import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query"
import type { User, NewUser, UpdateUser } from "../types/user.types";
import { apiUrl } from "./apiUrl";

export const useGetUser = () => {
  const state = useQuery<User[]>(() => ({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const res = await axios.get(`${apiUrl}/users`);
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
        const res = await axios.post(`${apiUrl}/users`, user);
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
        const res = await axios.patch(`${apiUrl}/users/${id}`, data);
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
        const res = await axios.delete(`${apiUrl}/users/${id}`);
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
