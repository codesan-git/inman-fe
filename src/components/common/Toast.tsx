import { Show, createSignal, onCleanup } from "solid-js";

export function createToast() {
  const [toast, setToast] = createSignal<{ message: string; type: "success" | "error" } | null>(null);
  let timeout: number | undefined;

  function showToast(message: string, type: "success" | "error" = "success", duration = 2500) {
    setToast({ message, type });
    clearTimeout(timeout);
    timeout = window.setTimeout(() => setToast(null), duration);
  }

  onCleanup(() => clearTimeout(timeout));

  return {
    toast,
    showToast,
  };
}

export function Toast(props: { toast: ReturnType<typeof createToast>["toast"] }) {
  return (
    <Show when={props.toast()}>
      {t => (
        <div
          class={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white transition-all animate-fade-in-up ${
            t().type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {t().message}
        </div>
      )}
    </Show>
  );
}

// Simple fade-in animation
const style = document.createElement("style");
style.innerHTML = `
@keyframes fade-in-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fade-in-up 0.35s cubic-bezier(.4,0,.2,1); }
`;
document.head.appendChild(style);
