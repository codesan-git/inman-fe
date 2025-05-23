import type { ColumnDef } from "@tanstack/solid-table";

import UserActionCell from "./UserActionCell";
import { User } from "~/types/user.types";

export type { User };

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    cell: (props) => <span class="font-medium">{props.row.getValue("name")}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: (props) => <span>{props.row.original.email ?? '-'}</span>,
  },
  {
    accessorKey: "phone_number",
    header: "Telepon",
    cell: (props) => <span>{props.row.original.phone_number ?? '-'}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (props) => <span class="capitalize">{props.row.getValue("role")}</span>,
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    cell: (props) => <UserActionCell user={props.row.original} />,
  },
];
