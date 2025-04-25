import axios from "axios";
import { useMutation } from "@tanstack/solid-query";
import type { CheckUserResponse, LoginResponse } from "~/types/auth.types";
import { apiUrl } from "./apiUrl";

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
