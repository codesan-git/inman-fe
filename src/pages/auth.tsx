import Login from "../components/auth/Login";

export default function AuthPage() {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
        <Login />
      </div>
    </div>
  );
}
