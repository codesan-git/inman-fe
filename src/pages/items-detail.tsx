import { useParams, useNavigate } from "@solidjs/router";
import { Show, ErrorBoundary, createSignal, createEffect, Match, Switch } from "solid-js";
import { useItemDetail, useUpdateItem } from "~/hooks/useItems";
import type { UpdateItem } from "~/types/item.types";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemQuery = useItemDetail(params.id);
  const updateItem = useUpdateItem();
  const [editMode, setEditMode] = createSignal(false);
  const [editData, setEditData] = createSignal<Partial<UpdateItem>>({});

  createEffect(() => {
    if (itemQuery.data && Object.keys(editData()).length === 0) {
      // Inisialisasi editData hanya sekali saat data pertama kali didapat
      const { name, category, condition, quantity, source } = itemQuery.data;
      setEditData({ name, category, condition, quantity, source });
    }
    if (updateItem.status === 'success') setEditMode(false);
  });

  function handleEditChange(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setEditData(prev => ({ ...prev, [target.name]: target.type === 'number' ? Number(target.value) : target.value }));
  }

  function handleEditSubmit(e: Event) {
    e.preventDefault();
    updateItem.mutate({ id: params.id, data: editData() });
  }

  return (
    <div class="p-8 max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold mb-4 text-sidebar">Detail Barang</h1>
      <button class="mb-4 px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm" onClick={() => navigate("/items")}>Kembali ke Daftar</button>
      <ErrorBoundary fallback={err => <div class="text-red-600">Gagal memuat data: {err.toString()}</div>}>
        <Switch>
          <Match when={itemQuery.status === 'pending'}>
            <div>Loading...</div>
          </Match>
          <Match when={itemQuery.status === 'error'}>
            <div class="text-red-600">Gagal mengambil detail item: {itemQuery.error?.message}</div>
          </Match>
          <Match when={itemQuery.status === 'success' && itemQuery.data}>
            <div class="bg-white rounded-lg shadow p-6 border border-gray-100 space-y-4">
              <Switch>
                <Match when={!editMode()}>
                  <div>
                    <span class="font-semibold">ID:</span> {itemQuery.data?.id}
                  </div>
                  <div>
                    <span class="font-semibold">Nama:</span> {itemQuery.data?.name}
                  </div>
                  <div>
                    <span class="font-semibold">Kategori:</span> {itemQuery.data?.category}
                  </div>
                  <div>
                    <span class="font-semibold">Jumlah:</span> {itemQuery.data?.quantity}
                  </div>
                  <div>
                    <span class="font-semibold">Kondisi:</span> {itemQuery.data?.condition}
                  </div>
                  <div>
                    <span class="font-semibold">Lokasi:</span> {itemQuery.data?.location_id}
                  </div>
                  <div>
                    <span class="font-semibold">Photo URL:</span> {itemQuery.data?.photo_url}
                  </div>
                  <div>
                    <span class="font-semibold">Asal:</span> {itemQuery.data?.source}
                  </div>
                  <div>
                    <span class="font-semibold">Donor:</span> {itemQuery.data?.donor_id}
                  </div>
                  <div>
                    <span class="font-semibold">Pengadaan:</span> {itemQuery.data?.procurement_id}
                  </div>
                  <div>
                    <span class="font-semibold">Dibuat:</span> {itemQuery.data?.created_at ? new Date(itemQuery.data.created_at).toLocaleString() : ""}
                  </div>
                  <Show when={!editMode()}>
                    <button class="mt-2 bg-primary text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit</button>
                  </Show>
                </Match>
                <Match when={editMode()}>
                  <form class="space-y-4" onSubmit={handleEditSubmit}>
                    <div>
                      <label class="font-semibold block mb-1">Nama</label>
                      <input name="name" class="border rounded px-2 py-1 w-full" value={editData().name ?? ""} onInput={handleEditChange} />
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Kategori</label>
                      <select name="category" class="border rounded px-2 py-1 w-full" value={editData().category ?? ""} onInput={handleEditChange}>
                        <option value="">Pilih Kategori</option>
                        <option value="electronics">Elektronik</option>
                        <option value="furniture">Furnitur</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Jumlah</label>
                      <input name="quantity" type="number" min="1" class="border rounded px-2 py-1 w-full" value={editData().quantity ?? 1} onInput={handleEditChange} />
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Kondisi</label>
                      <select name="condition" class="border rounded px-2 py-1 w-full" value={editData().condition ?? ""} onInput={handleEditChange}>
                        <option value="">Pilih Kondisi</option>
                        <option value="new">Baru</option>
                        <option value="used">Bekas</option>
                      </select>
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Lokasi (UUID)</label>
                      <input name="location_id" class="border rounded px-2 py-1 w-full" value={editData().location_id ?? ""} onInput={handleEditChange} />
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Photo URL</label>
                      <input name="photo_url" class="border rounded px-2 py-1 w-full" value={editData().photo_url ?? ""} onInput={handleEditChange} />
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Asal</label>
                      <select name="source" class="border rounded px-2 py-1 w-full" value={editData().source ?? ""} onInput={handleEditChange}>
                        <option value="">Pilih Asal</option>
                        <option value="purchase">Pembelian</option>
                        <option value="donation">Donasi</option>
                        <option value="grant">Hibah</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Donor (UUID)</label>
                      <input name="donor_id" class="border rounded px-2 py-1 w-full" value={editData().donor_id ?? ""} onInput={handleEditChange} />
                    </div>
                    <div>
                      <label class="font-semibold block mb-1">Pengadaan (UUID)</label>
                      <input name="procurement_id" class="border rounded px-2 py-1 w-full" value={editData().procurement_id ?? ""} onInput={handleEditChange} />
                    </div>
                    <div class="flex gap-2 mt-4">
                      <button type="submit" class="bg-primary text-white px-4 py-2 rounded" disabled={updateItem.status === 'pending'}>Simpan</button>
                      <button type="button" class="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditMode(false)}>Batal</button>
                    </div>
                    <Show when={updateItem.error}>
                      <div class="text-red-600">Gagal update: {updateItem.error?.message}</div>
                    </Show>
                    <Show when={updateItem.status === 'success'}>
                      <div class="text-green-600">Berhasil update!</div>
                    </Show>
                  </form>
                </Match>
              </Switch>
            </div>
          </Match>
        </Switch>
      </ErrorBoundary>
    </div>
  );
}
