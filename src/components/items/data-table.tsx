import { createSignal, For, createEffect, createMemo } from "solid-js";
import ItemsFilter from "./filter";
import Exporter from "./exporter";
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
import type { Item } from "~/types/item.types";

type LookupProps = {
  items: Item[];
  onDelete: (id: string) => void;
  categories?: { id: string; name: string }[];
  conditions?: { id: string; name: string }[];
  sources?: { id: string; name: string }[];
  locations?: { id: string; name: string }[];
};

export default function ItemsDataTable(props: LookupProps) {
  // FILTER STATE (client-side)
  const [filterNama, setFilterNama] = createSignal("");
  const [filterKategori, setFilterKategori] = createSignal("");
  const [filterKondisi, setFilterKondisi] = createSignal("");
  const [filterAsal, setFilterAsal] = createSignal("");
  const [filterLokasi, setFilterLokasi] = createSignal("");

  // Filtered items (client-side)
  const filteredItems = createMemo(() => props.items.filter(item => {
    if (filterNama() && !item.name.toLowerCase().includes(filterNama().toLowerCase())) return false;
    if (filterKategori() && item.category_id !== filterKategori()) return false;
    if (filterKondisi() && item.condition_id !== filterKondisi()) return false;
    if (filterAsal() && item.source_id !== filterAsal()) return false;
    if (filterLokasi() && item.location_id !== filterLokasi()) return false;
    return true;
  }));
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
      return filteredItems();
    },
    columns: columns({
      categories: props.categories,
      conditions: props.conditions,
      sources: props.sources,
      locations: props.locations,
    }),
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
      <Exporter
        items={filteredItems()}
        categories={props.categories}
        conditions={props.conditions}
        sources={props.sources}
        locations={props.locations}
      />
      <ItemsFilter
        filterNama={filterNama()}
        setFilterNama={setFilterNama}
        filterKategori={filterKategori()}
        setFilterKategori={setFilterKategori}
        filterKondisi={filterKondisi()}
        setFilterKondisi={setFilterKondisi}
        filterAsal={filterAsal()}
        setFilterAsal={setFilterAsal}
        filterLokasi={filterLokasi()}
        setFilterLokasi={setFilterLokasi}
        categories={props.categories}
        conditions={props.conditions}
        sources={props.sources}
        locations={props.locations}
      />
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
                <TableCell colSpan={8} class="h-24 text-center">
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
