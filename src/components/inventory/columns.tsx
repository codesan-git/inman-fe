import type { ColumnDef } from "@tanstack/solid-table";

export type InventoryItem = {
  name: string;
  qty: number;
  category: string;
  date: string;
};

export const columns: ColumnDef<InventoryItem>[] = [
  {
    accessorKey: "name",
    header: "Nama Barang",
    cell: (props) => <span class="font-medium">{props.row.getValue("name")}</span>,
  },
  {
    accessorKey: "qty",
    header: "Jumlah",
    cell: (props) => <span>{props.row.getValue("qty")}</span>,
  },
  {
    accessorKey: "category",
    header: "Kategori",
    cell: (props) => <span>{props.row.getValue("category")}</span>,
  },
  {
    accessorKey: "date",
    header: "Tanggal Masuk",
    cell: (props) => <span class="text-gray-500">{props.row.getValue("date")}</span>,
  },
];
