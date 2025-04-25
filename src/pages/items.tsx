import { Show, createSignal, createEffect } from "solid-js";
import ItemsDataTable from "~/components/items/data-table";
import { useItems, useCreateItem, useDeleteItem } from "~/hooks/useItems";
import type { NewItem } from "~/types/item.types";

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "electronics", label: "Elektronik" },
  { value: "prayer", label: "Perlengkapan Ibadah" },
  { value: "furniture", label: "Furniture" },
];
const CONDITION_OPTIONS: { value: string; label: string }[] = [
  { value: "good", label: "Baik" },
  { value: "damaged", label: "Rusak" },
  { value: "lost", label: "Hilang" },
];
const SOURCE_OPTIONS: { value: string; label: string }[] = [
  { value: "existing", label: "Inventaris Lama" },
  { value: "donation", label: "Donasi" },
  { value: "procurement", label: "Pengadaan" },
];

export default function ItemsPage() {
  const itemsQuery = useItems();
  const createItem = useCreateItem();
  const deleteItem = useDeleteItem();
  const [newItem, setNewItem] = createSignal<Partial<NewItem>>({});

  const [errors, setErrors] = createSignal<Record<string, string>>({});

  function handleCreate(e: Event) {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!newItem().name) err.name = "Nama barang wajib diisi";
    if (!newItem().category) err.category = "Kategori wajib dipilih";
    if (!newItem().condition) err.condition = "Kondisi wajib dipilih";
    if (!newItem().source) err.source = "Asal wajib dipilih";
    if (!newItem().quantity || (newItem()?.quantity!) < 1) err.quantity = "Jumlah minimal 1";
    setErrors(err);
    if (Object.keys(err).length > 0) return;
    createItem.mutate(newItem() as NewItem);
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
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().category ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            value={newItem().category || ""}
            onInput={e => setNewItem(v => ({ ...v, category: e.currentTarget.value.toLowerCase() }))}
          >
            <option value="" disabled>Pilih kategori</option>
            {CATEGORY_OPTIONS.map(opt => (
              <option value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div class="text-xs text-gray-500 mt-1">Pilih kategori barang sesuai jenisnya</div>
          {errors().category && <div class="text-xs text-red-500 mt-1">{errors().category}</div>}
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Kondisi</label>
          <select
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().condition ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            value={newItem().condition || ""}
            onInput={e => setNewItem(v => ({ ...v, condition: e.currentTarget.value.toLowerCase() }))}
          >
            <option value="" disabled>Pilih kondisi</option>
            {CONDITION_OPTIONS.map(opt => (
              <option value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div class="text-xs text-gray-500 mt-1">Pilih kondisi fisik barang saat ini</div>
          {errors().condition && <div class="text-xs text-red-500 mt-1">{errors().condition}</div>}
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Asal</label>
          <select
            class={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition ${errors().source ? 'border-red-500 ring-red-200' : 'border-gray-300'}`}
            value={newItem().source || ""}
            onInput={e => setNewItem(v => ({ ...v, source: e.currentTarget.value.toLowerCase() }))}
          >
            <option value="" disabled>Pilih asal</option>
            {SOURCE_OPTIONS.map(opt => (
              <option value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div class="text-xs text-gray-500 mt-1">Pilih sumber barang</div>
          {errors().source && <div class="text-xs text-red-500 mt-1">{errors().source}</div>}
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
      <ItemsDataTable items={itemsQuery.data || []} onDelete={onDelete} />
    </div>
  );
}

