import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query";
import axios from "axios";
import { apiUrl } from "./apiUrl";
import type { Item, NewItem, UpdateItem } from "~/types/item.types";

export function useItems() {
  return useQuery<Item[]>(() => ({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/items`, {
        withCredentials: true,

      });
      return res.data;
    },
  }));
}

// CREATE
export const useCreateItem = () => {
  const queryClient = useQueryClient();
  return useMutation(() => ({
    mutationKey: ['items'],
    mutationFn: async (item: NewItem) => {
      const res = await axios.post(`${apiUrl}/items`, item, {
        withCredentials: true,

      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  }));
};

export function useItemDetail(id: string) {
  return useQuery(() => ({
    queryKey: ["item", id],
    queryFn: async () => {
      const res = await axios.get<Item>(`${apiUrl}/items/${id}`, {
        withCredentials: true,

      });
      return res.data;
    },
    enabled: !!id,
  }));
}

// UPDATE
export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  return useMutation(() => ({
    mutationKey: ['items'],
    mutationFn: async ({ id, data }: { id: string; data: UpdateItem }) => {
      const res = await axios.patch(`${apiUrl}/items/${id}`, data, {
        withCredentials: true,

      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  }));
};
// DELETE
export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  return useMutation(() => ({
    mutationKey: ['items'],
    mutationFn: async (id: string) => {
      const res = await axios.delete(`${apiUrl}/items/${id}`, {
        withCredentials: true,

      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  }));
};
