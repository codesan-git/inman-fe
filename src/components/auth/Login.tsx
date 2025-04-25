import { createSignal, Switch, Match } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Button } from "../ui/button";
import { useCheckUser, useLogin } from "../../hooks/useAuth";
import CreatePassword from "./CreatePassword";

export default function Login() {
  const [step, setStep] = createSignal<"name" | "password" | "create-password">("name");
  const [name, setName] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [userId, setUserId] = createSignal<string | null>(null);
  const [error, setError] = createSignal("");
  const navigate = useNavigate();

  const checkUser = useCheckUser(
    (data) => {
      setUserId(data.id);
      if (data.password_exists) {
        setStep("password");
      } else {
        setStep("create-password");
      }
    },
    () => {
      setError("User tidak ditemukan.");
      setUserId(null);
    }
  );
  const loginUser = useLogin(
    (data) => {
      navigate("/");
    },
    (err) => {
      setError("Login otomatis gagal. Silakan login manual.");
    }
  );
  const isLoading = checkUser.isPending || loginUser.isPending;

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (step() === "name") {
      handleCheckUser(e);
    } else if (step() === "password") {
      handleLogin(e);
    } else {
      console.log('[handleSubmit] step create-password, no action');
    }
  }

  async function handleCheckUser(e: Event) {
    setError("");
    checkUser.mutate(name());
  }

  async function handleLogin(e: Event) {
    setError("");
    loginUser.mutate({ name: name(), password: password() });
  }

  return (
    <div class="flex flex-col items-center justify-center min-h-[60vh]">
      <form
        class="bg-white rounded shadow p-8 w-full max-w-xs flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 class="text-xl font-bold mb-2">Login</h2>
        <Switch>
          <Match when={step() === "name"}>
            <label class="block font-medium">Nama</label>
            <input
              class="w-full border rounded px-3 py-2"
              type="text"
              value={name()}
              onInput={e => setName(e.currentTarget.value)}
              required
              disabled={checkUser.isPending}
              autofocus
            />
          </Match>
          <Match when={step() === "password"}>
            <label class="block font-medium">Password</label>
            <input
              class="w-full border rounded px-3 py-2"
              type="password"
              value={password()}
              onInput={e => setPassword(e.currentTarget.value)}
              required
              disabled={loginUser.isPending}
              autofocus
            />
            <div class="text-sm text-gray-500 mt-1">Nama: <span class="font-semibold">{name()}</span></div>
          </Match>
          <Match when={step() === "create-password" && userId()}>
            <CreatePassword name={name()} userId={userId()!} onSuccess={() => navigate("/")} />
          </Match>
        </Switch>
        {error() && <div class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">{error()}</div>}
        {(step() === "name" || step() === "password") && (
          <Button type="submit" class="w-full mt-2" disabled={isLoading}>
            {isLoading
              ? "Memproses..."
              : step() === "name"
                ? "Lanjut"
                : step() === "password"
                  ? "Login"
                  : undefined}
          </Button>
        )}
        {step() === "password" && (
          <button
            type="button"
            class="text-xs mt-2 text-blue-600 hover:underline"
            onClick={() => {
              setStep("name");
              setPassword("");
              setError("");
            }}
          >
            Ganti Nama
          </button>
        )}
      </form>
    </div>
  );
}
