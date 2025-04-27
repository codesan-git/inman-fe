import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/solid-query";
import type { CheckUserResponse, LoginResponse } from "~/types/auth.types";
import { apiUrl } from "./apiUrl";
import { useNavigate } from "@solidjs/router";

export const useCheckUser = (onSuccess?: (data: CheckUserResponse) => void, onError?: (err: unknown) => void) => {
  return useMutation(() => ({
    mutationKey: ["check-user"],
    mutationFn: async (name: string) => {
      try {
        const res = await axios.post(`${apiUrl}/check-user`, { name }, { withCredentials: true });
        if (onSuccess) onSuccess(res.data);
        return res.data as CheckUserResponse;
      } catch (err) {
        if (onError) onError(err);
        throw err;
      }
    },
  }));
};

export const useLogin = (onSuccess?: (data: LoginResponse) => void, onError?: (err: unknown) => void) => {
  return useMutation(() => ({
    mutationKey: ["login-user"],
    mutationFn: async ({ name, password }: { name: string; password: string }) => {
      try {
        const res = await axios.post(`${apiUrl}/login`, { name, password }, { withCredentials: true });
        if (onSuccess) onSuccess(res.data);
        return res.data;
      } catch (err) {
        if (onError) onError(err);
        throw err;
      }
    },
  }));
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // Panggil endpoint logout di backend
      await axios.get(`${apiUrl}/logout`, { withCredentials: true });

      // Invalidate query cache untuk "me"
      queryClient.invalidateQueries({ queryKey: ["me"] });

      // Clear cache user
      queryClient.setQueryData(["me"], null);

      // Clear cache users
      queryClient.setQueryData(["users"], null);

      // Redirect ke halaman login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return { logout };
};

