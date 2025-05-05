import { createContext, useContext } from "solid-js";
import { createToast, Toast } from "~/components/common/Toast";

const ToastContext = createContext<ReturnType<typeof createToast>>();

export function ToastProvider(props: { children: any }) {
  const toastApi = createToast();
  return (
    <ToastContext.Provider value={toastApi}>
      {props.children}
      <Toast toast={toastApi.toast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
