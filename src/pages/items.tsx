import { Show, createSignal, createEffect } from "solid-js";
import ItemsDataTable from "~/components/items/data-table";
import { useItems, useCreateItem, useDeleteItem } from "~/hooks/useItems";
import type { NewItem } from "~/types/item.types";

import { useCategories, useConditions, useSources } from "~/hooks/useLookups";


export default function ItemsPage() {
  const itemsQuery = useItems();
  const createItem = useCreateItem();
  const deleteItem = useDeleteItem();
  const [newItem, setNewItem] = createSignal<Partial<NewItem>>({});

  const [errors, setErrors] = createSignal<Record<string, string>>({});

  // ...inside ItemsPage
  const categoriesQuery = useCategories();
  const conditionsQuery = useConditions();
  const sourcesQuery = useSources();

  function handleCreate(e: Event) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!newItem().name) err.name = "Nama barang wajib diisi";
    if (!newItem().category_id) err.category_id = "Kategori wajib dipilih";
    if (!newItem().condition_id) err.condition_id = "Kondisi wajib dipilih";
    if (!newItem().source_id) err.source_id = "Asal wajib dipilih";
    if (!newItem().quantity || (newItem()?.quantity!) < 1) err.quantity = "Jumlah minimal 1";
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    // Only send the required fields and remove legacy fields
    const payload: any = {
      name: newItem().name,
      category_id: newItem().category_id,
      condition_id: newItem().condition_id,
      source_id: newItem().source_id,
      quantity: newItem().quantity
    };
    createItem.mutate(payload);
  }

  createEffect(() => {
    if (createItem?.isSuccess) setNewItem({});
  });

  function onDelete(id: string) {
    deleteItem.mutate(id);
  }

  return (
    <div class="p-8 space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-sidebar">Manajemen Inventaris</h1>
      </div>
      <form onSubmit={handleCreate} class="bg-white rounded-lg shadow p-6 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium mb-1">Nama Barang</label>
          <input
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().name ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            placeholder="Nama barang"
            value={newItem().name || ""}
            onInput={e => setNewItem(v => ({ ...v, name: e.currentTarget.value }))}
          />
          <div class="text-xs text-gray-500 mt-1">Contoh: Laptop, Sajadah, Kursi</div>
          {errors().name && <div class="text-xs text-red-500 mt-1">{errors().name}</div>}
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Kategori</label>
          <select
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().category_id ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            value={newItem().category_id || ""}
            onInput={e => setNewItem(v => ({ ...v, category_id: e.currentTarget.value as any }))}
          >
            <option value="" disabled>Pilih kategori</option>
            {categoriesQuery.isPending && <option value="" disabled>Memuat...</option>}
            {categoriesQuery.error && <option value="" disabled>Gagal memuat</option>}
            {categoriesQuery.data && categoriesQuery.data.map((cat: any) => (
              <option value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div class="text-xs text-gray-500 mt-1">Pilih kategori barang sesuai jenisnya</div>
          {errors().category_id && <div class="text-xs text-red-500 mt-1">{errors().category_id}</div>}
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Kondisi</label>
          <select
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().condition_id ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            value={newItem().condition_id || ""}
            onInput={e => setNewItem(v => ({ ...v, condition_id: e.currentTarget.value as any }))}
          >
            <option value="" disabled>Pilih kondisi</option>
            {conditionsQuery.isPending && <option value="" disabled>Memuat...</option>}
            {conditionsQuery.error && <option value="" disabled>Gagal memuat</option>}
            {conditionsQuery.data && conditionsQuery.data.map((cond: any) => (
              <option value={cond.id}>{cond.name}</option>
            ))}
          </select>
          <div class="text-xs text-gray-500 mt-1">Pilih kondisi fisik barang saat ini</div>
          {errors().condition_id && <div class="text-xs text-red-500 mt-1">{errors().condition_id}</div>}
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Asal</label>
          <select
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().source_id ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            value={newItem().source_id || ""}
            onInput={e => setNewItem(v => ({ ...v, source_id: e.currentTarget.value as any }))}
          >
            <option value="" disabled>Pilih asal</option>
            {sourcesQuery.isPending && <option value="" disabled>Memuat...</option>}
            {sourcesQuery.error && <option value="" disabled>Gagal memuat</option>}
            {sourcesQuery.data && sourcesQuery.data.map((src: any) => (
              <option value={src.id}>{src.name}</option>
            ))}
          </select>
          <div class="text-xs text-gray-500 mt-1">Pilih sumber barang</div>
          {errors().source_id && <div class="text-xs text-red-500 mt-1">{errors().source_id}</div>}
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Jumlah</label>
          <input
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().quantity ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            type="number"
            min={1}
            placeholder="Jumlah"
            value={newItem().quantity || 1}
            onInput={e => setNewItem(v => ({ ...v, quantity: parseInt(e.currentTarget.value) }))}
          />
          <div class="text-xs text-gray-500 mt-1">Isi jumlah barang (minimal 1)</div>
          {errors().quantity && <div class="text-xs text-red-500 mt-1">{errors().quantity}</div>}
        </div>
        <div class="flex flex-col gap-2 mt-4 md:mt-0">
          <button class="btn btn-primary w-full" type="submit" disabled={createItem.isPending}>
            {createItem.isPending ? "Menyimpan..." : "Tambah"}
          </button>
        </div>
      </form>
      <Show when={itemsQuery.isPending}>Loading...</Show>
      <Show when={itemsQuery.error}>Gagal memuat data</Show>
      <Show when={categoriesQuery.data && conditionsQuery.data && sourcesQuery.data} fallback={<div>Loading...</div>}>
        <ItemsDataTable
          items={itemsQuery.data || []}
          onDelete={onDelete}
          categories={categoriesQuery.data}
          conditions={conditionsQuery.data}
          sources={sourcesQuery.data}
        />
      </Show>
    </div>
  );
}

