import { useQuery } from "@tanstack/solid-query";
import axios from "axios";
import { apiUrl } from "./apiUrl";
import { Me } from "~/types/me.types";

export function useMe() {
  return useQuery<Me>(() => ({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/me`, { withCredentials: true });
      return res.data;
    },
  }));
}
