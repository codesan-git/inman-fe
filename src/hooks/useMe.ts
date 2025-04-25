import { useQuery } from "@tanstack/solid-query";
import axios from "axios";
import { apiUrl } from "./apiUrl";

export function useMe() {
  return useQuery(() => ({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await axios.get(`${apiUrl}/me`, { withCredentials: true });
      return res.data;
    },
  }));
}
