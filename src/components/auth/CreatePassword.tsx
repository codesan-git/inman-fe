import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button } from "../ui/button";
import { useUpdateUser } from "../../hooks/useUser";
import { useLogin } from "../../hooks/useAuth";

export default function CreatePassword({ name, userId, onSuccess }: { name: string; userId: string; onSuccess: () => void }) {
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");
  const updateUser = useUpdateUser({
    onSuccess: () => { },
    onError: () => "Gagal membuat password",
  });
  const navigate = useNavigate();
  const loginUser = useLogin(
    (_data) => {
      navigate("/");
    },
    (err) => setError("Login otomatis gagal. Silakan login manual.")
  );

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!password()) {
      setError("Password tidak boleh kosong");
      return;
    }
    try {
      const res = await updateUser.mutateAsync({
        id: userId,
        data: { password: password(), from_login: true },
      });
      // Jika backend minta redirect (flow create password dari login), lakukan login otomatis
      if (res && typeof res === "object" && res.redirect) {
        loginUser.mutate({ name, password: password() });
      } else {
        setSuccess("Password berhasil dibuat!");
      }
    } catch (err: any) {
      setError(err?.response?.data || "Gagal membuat password");
    }
  };

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-3">
      <div>Buat password untuk <b>{name}</b></div>
      <input
        class="border rounded px-3 py-2"
        type="password"
        value={password()}
        onInput={(e) => setPassword(e.currentTarget.value)}
        required
      />
      {error() && <div class="text-red-600">{error()}</div>}
      {success() && <div class="text-green-600">{success()}</div>}
      <Button type="submit" disabled={updateUser.isPending || loginUser.isPending}>
        {updateUser.isPending || loginUser.isPending ? "Memproses..." : "Buat Password & Login"}
      </Button>
    </form>
  );
}
