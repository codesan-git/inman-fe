import { createSignal } from "solid-js";
import { useUpdateUser, useDeleteUser, User, UpdateUser } from "../hooks/useUser";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem, RadioGroupItemLabel } from "~/components/ui/radio-group";

interface UserEditDeleteProps {
  user: User;
  onDone?: () => void;
}

import { createEffect } from "solid-js";

export default function UserEditDelete(props: UserEditDeleteProps) {
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [name, setName] = createSignal(props.user.name || "");
  const [email, setEmail] = createSignal(props.user.email || "");
  const [phone, setPhone] = createSignal(props.user.phone_number || "");
  const [avatar, setAvatar] = createSignal(props.user.avatar_url || "");
  const [role, setRole] = createSignal(props.user.role || "");

  createEffect(() => {
    if (updateUser.isSuccess && props.onDone) props.onDone();
    if (deleteUser.isSuccess && props.onDone) props.onDone();
  });

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
    <form onSubmit={handleUpdate} class="grid gap-4 border border-gray-200 p-3 rounded-lg my-2">
      <div class="grid gap-2">
        <label class="font-medium">Name</label>
        <input class="w-full border rounded px-3 py-2" value={name()} onInput={e => setName(e.currentTarget.value)} />
      </div>
      <div class="grid gap-2">
        <label class="font-medium">Email</label>
        <input class="w-full border rounded px-3 py-2" value={email()} onInput={e => setEmail(e.currentTarget.value)} />
      </div>
      <div class="grid gap-2">
        <label class="font-medium">Phone</label>
        <input class="w-full border rounded px-3 py-2" value={phone()} onInput={e => setPhone(e.currentTarget.value)} />
      </div>
      <div class="grid gap-2">
        <label class="font-medium">Avatar URL</label>
        <input class="w-full border rounded px-3 py-2" value={avatar()} onInput={e => setAvatar(e.currentTarget.value)} />
      </div>
      <div class="grid gap-2">
        <label class="font-medium">Role</label>
        <RadioGroup value={role()} onChange={setRole} class="flex gap-4">
          <RadioGroupItem value="Staff">
            <RadioGroupItemLabel>Staff</RadioGroupItemLabel>
          </RadioGroupItem>
          <RadioGroupItem value="Admin">
            <RadioGroupItemLabel>Admin</RadioGroupItemLabel>
          </RadioGroupItem>
        </RadioGroup>
      </div>
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