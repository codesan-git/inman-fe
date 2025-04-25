import { createSignal, For, createEffect } from "solid-js";
import {
  createSolidTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState
} from "@tanstack/solid-table";
import { columns } from "./columns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { TextField, TextFieldInput } from "~/components/ui/text-field";
import { Button } from "~/components/ui/button";
import type { Item } from "~/types/item.types";

export default function ItemsDataTable(props: { items: Item[]; onDelete: (id: string) => void }) {
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({});
  const [rowSelection, setRowSelection] = createSignal({});

  createEffect(() => {
    setSorting([]);
    setColumnFilters([]);
    setColumnVisibility({});
    setRowSelection({});
  }, [() => props.items]);

  const table = createSolidTable<Item>({
    get data() {
      return props.items;
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      get sorting() { return sorting(); },
      get columnFilters() { return columnFilters(); },
      get columnVisibility() { return columnVisibility(); },
      get rowSelection() { return rowSelection(); }
    },
    meta: {
      onDelete: props.onDelete,
    }
  });

  return (
    <div class="w-full">
      <div class="flex items-center py-4">
        <TextField
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(value) => table.getColumn("name")?.setFilterValue(value)}
        >
          <TextFieldInput placeholder="Filter nama barang..." class="max-w-sm" />
        </TextField>
      </div>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>{(headerGroup) => (
              <TableRow>
                <For each={headerGroup.headers}>{(header) => (
                  <TableHead>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )}</For>
              </TableRow>
            )}</For>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  <For each={row.getVisibleCells()}>{(cell) => (
                    <TableCell>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )}</For>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} class="h-24 text-center">
                  Tidak ada data.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
