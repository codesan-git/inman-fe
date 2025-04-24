import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button } from "../ui/button";
import { useUpdateUser } from "../../hooks/useUser";
import { useLogin } from "../../hooks/useAuth";

export default function CreatePassword({ name, userId, onSuccess }: { name: string; userId: string; onSuccess: () => void }) {
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const updateUser = useUpdateUser({
    onSuccess: () => doLogin(),
    onError: () => setError("Gagal membuat password"),
  });
  const navigate = useNavigate();
  const loginUser = useLogin(
    (data) => {
      localStorage.setItem("token", data.token);
      navigate("/");
    },
    () => setError("Login otomatis gagal. Silakan login manual.")
  );

  function doLogin() {
    if (password().length < 4) {
      setError("Password minimal 4 karakter");
      return;
    }
    loginUser.mutate({ name, password: password() });
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    setError("");
    updateUser.mutate({ id: userId, data: { password: password() } });
  }

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-3">
      <div>Buat password untuk <b>{name}</b></div>
      <input
        class="border rounded px-3 py-2"
        type="password"
        value={password()}
        onInput={e => setPassword(e.currentTarget.value)}
        required
      />
      {error() && <div class="text-red-600">{error()}</div>}
      <Button type="submit" disabled={updateUser.isPending || loginUser.isPending}>
        {updateUser.isPending || loginUser.isPending ? "Memproses..." : "Buat Password & Login"}
      </Button>
    </form>
  );
}
