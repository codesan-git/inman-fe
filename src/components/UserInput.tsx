import { createSignal } from "solid-js";
import { usePostUser } from "../hooks/useUser";
import { Button } from "./ui/button";

/**
 * UserInput component: Form to input new user data and submit to API
 */
export default function UserInput() {
  const postUser = usePostUser();
  const [name, setName] = createSignal("");

  function handleSubmit(e: Event) {
    e.preventDefault();
    postUser.mutate({
      name: name(),
    });
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-2 max-w-xs mx-auto my-4">
      <label>
        Name:
        <input value={name()} onInput={e => setName(e.currentTarget.value)} required />
      </label>
      <Button type="submit" disabled={postUser.isPending}>
        {postUser.isPending ? "Saving..." : "Add User"}
      </Button>
      {postUser.isError && <div class="text-red-600">Error saving user</div>}
      {postUser.isSuccess && <div class="text-green-600">User saved!</div>}
    </form>
  );
}
