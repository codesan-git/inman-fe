import { useQuery } from "@tanstack/solid-query";
import axios from "axios";
import { apiUrl } from "./apiUrl";

export function useCategories() {
  return useQuery(() => ({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/categories`, { withCredentials: true });
      return res.data;
    },
  }));
}

export function useItemSources() {
  return useQuery(() => ({
    queryKey: ["item_sources"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/item_sources`, { withCredentials: true });
      return res.data;
    },
  }));
}

export function useConditions() {
  return useQuery(() => ({
    queryKey: ["conditions"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/conditions`, { withCredentials: true });
      return res.data;
    },
  }));
}

export function useProcurementStatuses() {
  return useQuery(() => ({
    queryKey: ["procurement_statuses"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/procurement_statuses`, { withCredentials: true });
      return res.data;
    },
  }));
}

export function useUserRoles() {
  return useQuery(() => ({
    queryKey: ["user_roles"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/user_roles`, { withCredentials: true });
      return res.data;
    },
  }));
}
