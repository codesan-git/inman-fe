import { createSignal } from "solid-js";
import { useUpdateUser, useDeleteUser, User, UpdateUser } from "../hooks/useUser";
import { Button } from "./ui/button";

interface UserEditDeleteProps {
  user: User;
  onDone?: () => void;
}

export default function UserEditDelete(props: UserEditDeleteProps) {
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [name, setName] = createSignal(props.user.name || "");
  const [email, setEmail] = createSignal(props.user.email || "");
  const [phone, setPhone] = createSignal(props.user.phone_number || "");
  const [avatar, setAvatar] = createSignal(props.user.avatar_url || "");
  const [role, setRole] = createSignal(props.user.role || "");

  function handleUpdate(e: Event) {
    e.preventDefault();
    const data: UpdateUser = {
      name: name(),
      email: email(),
      phone_number: phone(),
      avatar_url: avatar(),
      role: role(),
    };
    updateUser.mutate({ id: props.user.id, data });
  }

  function handleDelete() {
    if (window.confirm("Hapus user ini?")) {
      deleteUser.mutate(props.user.id);
      props.onDone?.();
    }
  }

  return (
    <form onSubmit={handleUpdate} class="flex flex-col gap-2 border border-gray-200 p-3 rounded-lg my-2">
      <label>
        Name:
        <input value={name()} onInput={e => setName(e.currentTarget.value)} />
      </label>
      <label>
        Email:
        <input value={email()} onInput={e => setEmail(e.currentTarget.value)} />
      </label>
      <label>
        Phone:
        <input value={phone()} onInput={e => setPhone(e.currentTarget.value)} />
      </label>
      <label>
        Avatar URL:
        <input value={avatar()} onInput={e => setAvatar(e.currentTarget.value)} />
      </label>
      <label>
        Role:
        <input value={role()} onInput={e => setRole(e.currentTarget.value)} />
      </label>
      <div class="flex gap-2">
        <Button type="submit" disabled={updateUser.isPending}>Update</Button>
        <Button type="button" onClick={handleDelete} disabled={deleteUser.isPending} variant="destructive">Delete</Button>
      </div>
      {updateUser.isError && <div class="text-red-600">Update error</div>}
      {updateUser.isSuccess && <div class="text-green-600">Updated!</div>}
      {deleteUser.isError && <div class="text-red-600">Delete error</div>}
      {deleteUser.isSuccess && <div class="text-green-600">Deleted!</div>}
    </form>
  );
}
