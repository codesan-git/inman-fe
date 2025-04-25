import type { ColumnDef } from "@tanstack/solid-table";
import type { Item } from "~/types/item.types";
import { A } from '@solidjs/router'

export const columns: ColumnDef<Item>[] = [
  {
    accessorKey: "name",
    header: "Nama Barang",
    cell: (props) => <span class="font-medium">{props.row.getValue("name")}</span>,
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: (props) => <span class="capitalize">{props.row.getValue("category")}</span>,
  },
  {
    accessorKey: "condition",
    header: "Kondisi",
    cell: (props) => <span>{props.row.getValue("condition")}</span>,
  },
  {
    accessorKey: "quantity",
    header: "Jumlah",
    cell: (props) => <span>{props.row.getValue("quantity")}</span>,
  },
  {
    accessorKey: "source",
    header: "Asal",
    cell: (props) => <span>{props.row.getValue("source")}</span>,
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    cell: (props) => <A href={`/items/${props.row.original.id}`} class="text-blue-500 cursor-pointer underline">details</A>,
  },
];
