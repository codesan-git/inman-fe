import axios from "axios";
import { useMutation } from "@tanstack/solid-query";

const axiosUrl = 'http://localhost:8080/api'

export interface CheckUserResponse {
  id: string;
  name: string;
  password_exists: boolean;
}

export const useCheckUser = (onSuccess?: (data: CheckUserResponse) => void, onError?: (err: any) => void) => {
  return useMutation(() => ({
    mutationKey: ["check-user"],
    mutationFn: async (name: string) => {
      try {
        const res = await axios.post(`${axiosUrl}/check-user`, { name }, { withCredentials: true });
        if (onSuccess) onSuccess(res.data);
        return res.data as CheckUserResponse;
      } catch (err) {
        if (onError) onError(err);
        throw err;
      }
    },
  }));
};

export const useLogin = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  return useMutation(() => ({
    mutationKey: ["login-user"],
    mutationFn: async ({ name, password }: { name: string; password: string }) => {
      try {
        const res = await axios.post(`${axiosUrl}/login`, { name, password }, { withCredentials: true });
        if (onSuccess) onSuccess(res.data);
        return res.data;
      } catch (err) {
        if (onError) onError(err);
        throw err;
      }
    },
  }));
};
