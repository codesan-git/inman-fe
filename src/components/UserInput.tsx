/**
 * UserInput component: Form to input new user data and submit to API
 */
import { createSignal } from "solid-js";
import { usePostUser } from "../hooks/useUser";
import { Button } from "./ui/button";
import NameInput from "./inputs/NameInput";

export default function UserInput() {
  const postUser = usePostUser();
  const [name, setName] = createSignal("");

  function handleSubmit(e: Event) {
    e.preventDefault();
    postUser.mutate({ name: name() });
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <div>
        <label class="block font-medium mb-1">Nama</label>
        <NameInput
          class="w-full border rounded px-3 py-2"
          value={name()}
          onInput={setName}
          required
        />
        <p class="text-xs text-gray-500 mt-1">Nama tidak boleh mengandung simbol atau angka.</p>
      </div>
      <Button type="submit" class="w-full mt-2" disabled={postUser.isPending}>
        {postUser.isPending ? "Menyimpan..." : "Tambah User"}
      </Button>
      {postUser.isError && <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">Gagal menyimpan user</div>}
      {postUser.isSuccess && <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">User berhasil ditambahkan!</div>}
    </form>
  );
}
