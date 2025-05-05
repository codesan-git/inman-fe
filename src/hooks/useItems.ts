import { useQuery, useMutation, useQueryClient } from "@tanstack/solid-query";
import axios from "axios";
import { apiUrl } from "./apiUrl";
import type { Item, NewItem, UpdateItem } from "~/types/item.types";

export function useItems(params?: {
  name?: string;
  category_id?: string;
  condition_id?: string;
  source_id?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery<Item[]>(() => ({
    queryKey: ["items", params],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params) {
        if (params.name) query.append("name", params.name);
        if (params.category_id) query.append("category_id", params.category_id);
        if (params.condition_id) query.append("condition_id", params.condition_id);
        if (params.source_id) query.append("source_id", params.source_id);
        if (params.page) query.append("page", params.page.toString());
        if (params.page_size) query.append("page_size", params.page_size.toString());
      }
      const url = `${apiUrl}/items${query.toString() ? "?" + query.toString() : ""}`;
      const res = await axios.get(url, {
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
