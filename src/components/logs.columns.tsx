import { createColumnHelper } from "@tanstack/solid-table";
import type { ItemLog } from "~/hooks/useLogs";

const columnHelper = createColumnHelper<ItemLog>();

export const columns = [
  columnHelper.display({
    id: "no",
    header: () => "No",
    cell: (info) => info.row.index + 1,
    size: 40,
  }),
  columnHelper.accessor("item_name", {
    header: "Nama Barang",
    cell: (info) => <span class="font-medium">{info.getValue() ?? '-'}</span>,
    size: 40,
  }),
  columnHelper.accessor("action", {
    header: () => "Action",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("before", {
    header: () => "Before",
    cell: (info) => info.getValue() ? (
      <pre class="max-w-xs overflow-x-auto whitespace-pre-wrap text-xs bg-gray-50 p-1 rounded border border-gray-100">{JSON.stringify(info.getValue(), null, 2)}</pre>
    ) : "-",
    size: 200,
  }),
  columnHelper.accessor("after", {
    header: () => "After",
    cell: (info) => info.getValue() ? (
      <pre class="max-w-xs overflow-x-auto whitespace-pre-wrap text-xs bg-gray-50 p-1 rounded border border-gray-100">{JSON.stringify(info.getValue(), null, 2)}</pre>
    ) : "-",
    size: 200,
  }),
  columnHelper.accessor("by", {
    header: "User",
    cell: (info) => info.row.original.user_name ?? '-',
    size: 40,
  }),
  columnHelper.accessor("note", {
    header: () => "Note",
    cell: (info) => info.getValue() || "-",
  }),
  columnHelper.accessor("created_at", {
    header: () => "Waktu",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
    size: 120,
  }),
];
