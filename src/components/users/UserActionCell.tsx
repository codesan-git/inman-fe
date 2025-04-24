import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import UserEditDelete from "~/components/UserEditDelete";
import type { User } from "./columns";

import { createSignal } from "solid-js";

export default function UserActionCell(props: { user: User }) {
  const [open, setOpen] = createSignal(false);
  return (
    <Dialog open={open()} onOpenChange={setOpen}>
      <DialogTrigger as={Button} variant="ghost" class="size-8 p-0">
        <span class="sr-only">Edit user</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit / Hapus User</DialogTitle>
        </DialogHeader>
        <UserEditDelete user={props.user} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
