import { useQuery } from "@tanstack/solid-query";
import axios from "axios";
import { apiUrl } from "./apiUrl";

export type ItemLog = {
  id: string;
  item_id: string;
  item_name?: string;
  action: string;
  before: any;
  after: any;
  note: string | null;
  by: string | null;
  user_name?: string;
  created_at: string;
};

export function useLogs() {
  return useQuery<ItemLog[]>(() => ({
    queryKey: ["logs"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/items/item_logs`, {
        withCredentials: true,
      });
      return res.data;
    },
  }));
}
