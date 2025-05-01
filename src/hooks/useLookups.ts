import { useQuery } from "@tanstack/solid-query";
import axios from "axios";
import { apiUrl } from "./apiUrl";
import { createSignal } from "solid-js";
import { useMutation } from "@tanstack/solid-query";

export function useCategories() {
  return useQuery(() => ({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/categories`, { withCredentials: true });
      return res.data;
    },
  }));
}

export function useSources() {
  return useQuery(() => ({
    queryKey: ["sources"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/item_sources`, { withCredentials: true });
      return res.data;
    },
  }));
}

export function useLocations() {
  return useQuery(() => ({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/lookup/locations`, { withCredentials: true });
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

// Custom hook untuk handling add & delete lookup


import type { UseMutationOptions } from "@tanstack/solid-query";

export function useLookupActions(tab: () => string, setNewName: (v: string) => void, setNewDesc: (v: string) => void, queries: Record<string, any>) {
  const [error, setError] = createSignal<string>("");

  function handleInputChange(setter: (v: string) => void) {
    return (e: Event) => {
      const target = e.target as HTMLInputElement;
      setter(target.value);
      setError("");
    };
  }

  function handleValidation(name: string): boolean {
    if (!name.trim()) {
      setError("Nama tidak boleh kosong");
      return false;
    }
    setError("");
    return true;
  }

  // ADD
  // ADD
  const addMutation = useMutation(() => ({
    mutationKey: ["lookups", tab(), "add"],
    mutationFn: async ({ newName, newDesc }: { newName: string; newDesc: string }) => {
      const endpoint = {
        categories: `/lookup/categories`,
        conditions: `/lookup/conditions`,
        sources: `/lookup/item_sources`,
        locations: `/lookup/locations`,
      }[tab()];
      await axios.post(import.meta.env.VITE_API_URL + endpoint, {
        name: newName,
        description: newDesc,
      }, { withCredentials: true });
    },
    onSuccess: () => {
      setNewName("");
      setNewDesc("");
      queries[tab()].refetch();
      setError("");
    },
    onError: () => setError("Gagal menambah data"),
  }));

  const deleteMutation = useMutation(() => ({
    mutationKey: ["lookups", tab(), "delete"],
    mutationFn: async (id: string) => {
      const endpoint = {
        categories: `/lookup/categories`,
        conditions: `/lookup/conditions`,
        sources: `/lookup/item_sources`,
        locations: `/lookup/locations`,
      }[tab()];
      await axios.delete(import.meta.env.VITE_API_URL + endpoint + "/" + id, { withCredentials: true });
    },
    onSuccess: () => {
      queries[tab()].refetch();
      setError("");
    },
    onError: () => setError("Gagal menghapus data"),
  }));

  const editMutation = useMutation(() => ({
    mutationKey: ["lookups", tab(), "edit"],
    mutationFn: async ({ id, newName, newDesc }: { id: string; newName: string; newDesc: string }) => {
      const endpoint = {
        categories: `/lookup/categories/` + id,
        conditions: `/lookup/conditions/` + id,
        sources: `/lookup/item_sources/` + id,
        locations: `/lookup/locations/` + id,
      }[tab()];
      await axios.patch(import.meta.env.VITE_API_URL + endpoint, {
        name: newName,
        description: newDesc,
      }, { withCredentials: true });
    },
    onSuccess: () => {
      queries[tab()].refetch();
      setError("");
    },
    onError: () => setError("Gagal mengedit data"),
  }));


  // Handler untuk dipakai di page
  function handleAdd(newName: string, newDesc: string) {
    addMutation.mutate({ newName, newDesc });
  }
  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }
  function handleEdit(id: string, newName: string, newDesc: string) {
    editMutation.mutate({ id, newName, newDesc });
  }

  return {
    handleAdd,
    handleDelete,
    handleEdit,
    handleInputChange,
    handleValidation,
    // Loading & error state for each mutation
    addStatus: addMutation.status,
    addError: addMutation.error ? (addMutation.error as Error)?.message ?? error() : undefined,
    editStatus: editMutation.status,
    editError: editMutation.error ? (editMutation.error as Error)?.message ?? error() : undefined,
    deleteStatus: deleteMutation.status,
    deleteError: deleteMutation.error ? (deleteMutation.error as Error)?.message ?? error() : undefined,
    // General error (legacy)
    error
  };
}
