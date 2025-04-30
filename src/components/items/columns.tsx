import type { ColumnDef } from "@tanstack/solid-table";
import { JSX } from "solid-js";
import type { Item } from "~/types/item.types";
import { A } from '@solidjs/router'

type LookupColumnsProps = {
  categories?: { id: string; name: string }[];
  conditions?: { id: string; name: string }[];
  sources?: { id: string; name: string }[];
};

export const columns = ({ categories, conditions, sources }: LookupColumnsProps): ColumnDef<Item>[] => [
  {
    accessorKey: "name",
    header: "Nama Barang",
    cell: (props): JSX.Element => <span class="font-medium">{props.row.getValue("name")}</span>,
  },
  {
    accessorKey: "category_id",
    header: "Kategori",
    cell: (props): JSX.Element => {
      const id = String(props.row.getValue("category_id") ?? "");
      const name = categories?.find(cat => cat.id === id)?.name ?? id;
      return <span class="capitalize">{name}</span>;
    },
  },
  {
    accessorKey: "condition_id",
    header: "Kondisi",
    cell: (props): JSX.Element => {
      const id = String(props.row.getValue("condition_id") ?? "");
      const name = conditions?.find(cond => cond.id === id)?.name ?? id;
      return <span class="capitalize">{name}</span>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Jumlah",
    cell: (props): JSX.Element => <span>{props.row.getValue("quantity")}</span>,
  },
  {
    accessorKey: "source_id",
    header: "Asal",
    cell: (props): JSX.Element => {
      const id = String(props.row.getValue("source_id") ?? "");
      const name = sources?.find(src => src.id === id)?.name ?? id;
      return <span class="capitalize">{name}</span>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    cell: (props): JSX.Element => <A href={`/items/${props.row.original.id}`} class="text-blue-500 cursor-pointer underline">details</A>,
  },
];
