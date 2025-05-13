import { useParams, useNavigate } from "@solidjs/router";
import { Show, ErrorBoundary, Match, Switch, createSignal, createEffect } from "solid-js";
import { useItemDetail, useUpdateItem } from "~/hooks/useItems";
import { useLocations, useCategories, useConditions, useSources } from "~/hooks/useLookups";
import type { Location } from "~/types/lookup.types";
import type { UpdateItem } from "~/types/item.types";
import ImageUpload from "~/components/items/image-upload";

import { useToast } from "~/components/common/ToastContext";

export default function ItemDetailPage() {
  const { showToast } = useToast();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemQuery = useItemDetail(params.id);
  // Lookup hooks
  const categoriesQuery = useCategories();
  const conditionsQuery = useConditions();
  const sourcesQuery = useSources();
  const locationsQuery = useLocations();

  // --- Inline Edit State ---
  const [editMode, setEditMode] = createSignal(false);

  // Toast for update success/error
  createEffect(() => {
    if (updateItem.error) {
      showToast(updateItem.error?.message || "Gagal update data", "error");
    } else if (updateItem.status === "success") {
      showToast("Berhasil update!", "success");
    }
  });
  const [editData, setEditData] = createSignal<Partial<UpdateItem>>({});
  const [dirty, setDirty] = createSignal(false);
  const updateItem = useUpdateItem();

  // --- Toast State ---
  const [toast, setToast] = createSignal<{ message: string; type: "success" | "error"; visible: boolean }>({ message: "", type: "success", visible: false });
  let toastTimeout: number | undefined = undefined;

  createEffect(() => {
    if (updateItem.error) {
      setToast({ message: updateItem.error?.message || "Gagal update data", type: "error", visible: true });
      clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
    } else if (updateItem.status === "success") {
      setToast({ message: "Berhasil update!", type: "success", visible: true });
      clearTimeout(toastTimeout);
      toastTimeout = window.setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
    }
  });

  // Sync editData with itemQuery.data saat masuk edit mode
  createEffect(() => {
    if (editMode() && itemQuery.status === 'success' && itemQuery.data) {
      setEditData({ ...itemQuery.data });
      setDirty(false);
    }
  });

  // Tutup modal & refresh detail setelah update sukses
  createEffect(() => {
    if (updateItem.status === 'success') {
      setEditMode(false);
      itemQuery.refetch && itemQuery.refetch();
    }
  });

  function handleEditChange(e: Event) {
    setDirty(true);
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    setEditData(prev => ({ ...prev, [target.name]: target.type === 'number' ? Number(target.value) : target.value }));
  }
  
  function handleImageUploaded(url: string) {
    setDirty(true);
    setEditData(prev => ({ ...prev, photo_url: url }));
  }
  
  function handleEditSubmit(e: Event) {
    e.preventDefault();
    updateItem.mutate({ id: params.id, data: editData() });
  }

  return (
    <div class="px-2 sm:px-4 md:px-8 py-4 w-full max-w-2xl mx-auto">

      <div class="flex flex-col items-center gap-2 mb-4">
        <h1 class="text-lg sm:text-2xl font-bold text-sidebar text-center">Detail Barang</h1>
        <button class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-xs sm:text-sm shadow" onClick={() => navigate("/items")}>Kembali ke Daftar</button>
      </div>
      <ErrorBoundary fallback={err => <div class="text-red-600">Gagal memuat data: {err.toString()}</div>}>
        <Show when={editMode()}>
          <div class="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
            <form class="relative bg-white rounded-xl shadow-xl border border-gray-100 p-4 sm:p-6 w-full max-w-2xl mx-2 animate-fadein" style="min-width:300px;" onSubmit={handleEditSubmit}>
              <button type="button" aria-label="Tutup" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold" onClick={() => setEditMode(false)}>&times;</button>
              <h2 class="text-lg font-bold mb-4 text-center">Edit Barang</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="font-semibold block mb-1">Nama</label>
                  <input name="name" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().name ?? ''} onInput={handleEditChange} required />
                </div>
                <div>
                  <label class="font-semibold block mb-1">Kategori</label>
                  <select name="category_id" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().category_id ?? ''} onInput={handleEditChange} required>
                    <option value="">Pilih Kategori</option>
                    {categoriesQuery.data && categoriesQuery.data.map((cat: any) => (
                      <option value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="font-semibold block mb-1">Jumlah</label>
                  <input name="quantity" type="number" min="1" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().quantity ?? 1} onInput={handleEditChange} required />
                </div>
                <div>
                  <label class="font-semibold block mb-1">Kondisi</label>
                  <select name="condition_id" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().condition_id ?? ''} onInput={handleEditChange} required>
                    <option value="">Pilih Kondisi</option>
                    {conditionsQuery.data && conditionsQuery.data.map((cond: any) => (
                      <option value={cond.id}>{cond.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="font-semibold block mb-1">Lokasi</label>
                  <select name="location_id" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().location_id ?? ''} onInput={handleEditChange} required>
                    <option value="">Pilih Lokasi</option>
                    {locationsQuery.data && locationsQuery.data.map((loc: any) => (
                      <option value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Komponen Upload Gambar */}
                <ImageUpload 
                  initialValue={editData().photo_url || undefined} 
                  onImageUploaded={handleImageUploaded} 
                />
                {/* Field photo_url sudah digantikan dengan komponen ImageUpload di atas */}
                <div>
                  <label class="font-semibold block mb-1">Asal</label>
                  <select name="source_id" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().source_id ?? ''} onInput={handleEditChange} required>
                    <option value="">Pilih Asal</option>
                    {sourcesQuery.data && sourcesQuery.data.map((src: any) => (
                      <option value={src.id}>{src.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label class="font-semibold block mb-1">Donor (UUID)</label>
                  <input name="donor_id" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().donor_id ?? ''} onInput={handleEditChange} />
                </div>
                <div>
                  <label class="font-semibold block mb-1">Pengadaan (UUID)</label>
                  <input name="procurement_id" class="border rounded text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 w-full" value={editData().procurement_id ?? ''} onInput={handleEditChange} />
                </div>
              </div>
              <div class="flex gap-2 mt-6 justify-center">
                <button type="submit" class="bg-primary text-white px-4 py-2 rounded text-sm font-semibold shadow" disabled={updateItem.status === 'pending'}>Simpan</button>
                <button type="button" class="bg-gray-300 px-4 py-2 rounded text-sm font-semibold" onClick={() => setEditMode(false)}>Batal</button>
              </div>

            </form>
          </div>
        </Show>
        <Switch>
          <Match when={itemQuery.status === 'pending'}>
            <div>Loading...</div>
          </Match>
          <Match when={itemQuery.status === 'error'}>
            <div class="text-red-600">Gagal mengambil detail item: {itemQuery.error?.message}</div>
          </Match>
          <Match when={itemQuery.status === 'success' && itemQuery.data}>
            <div class="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 border border-gray-100 space-y-4">
              <button class="mt-2 bg-primary text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit</button>

              <div>
                <span class="font-semibold">ID:</span> {itemQuery.data?.id}
              </div>
              <div>
                <span class="font-semibold">Nama:</span> {itemQuery.data?.name}
              </div>
              <div>
                <span class="font-semibold">Kategori:</span> {categoriesQuery.data?.find((cat: any) => cat.id === itemQuery.data?.category_id)?.name || itemQuery.data?.category_id}
              </div>
              <div>
                <span class="font-semibold">Jumlah:</span> {itemQuery.data?.quantity}
              </div>
              <div>
                <span class="font-semibold">Kondisi:</span> {conditionsQuery.data?.find((cond: any) => cond.id === itemQuery.data?.condition_id)?.name || itemQuery.data?.condition_id}
              </div>
              <div class="mb-2">
                <span class="font-semibold">Lokasi:</span> {(() => {
                  if (locationsQuery.isPending) return 'Memuat...';
                  if (locationsQuery.error) return 'Gagal memuat lokasi';
                  const loc = locationsQuery.data?.find((l: Location) => l.id === itemQuery.data?.location_id);
                  return loc ? loc.name : 'Tidak ditemukan';
                })()}
              </div>
              <div class="flex flex-col items-center gap-2 mb-2">
                <span class="font-semibold block">Foto Barang:</span>
                <Show when={!!itemQuery.data?.photo_url && itemQuery.data.photo_url !== ""} fallback={<div class="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-lg border text-gray-400 text-xs">Tidak ada foto</div>}>
                  <img
                    src={itemQuery.data?.photo_url || ""}
                    alt={itemQuery.data?.name || "Foto Barang"}
                    class="w-36 h-36 object-cover rounded-lg border shadow-sm cursor-zoom-in transition-transform duration-200 hover:scale-105"
                    loading="lazy"
                    onClick={e => {
                      const modal = document.createElement('div');
                      modal.style.position = 'fixed';
                      modal.style.top = '0';
                      modal.style.left = '0';
                      modal.style.width = '100vw';
                      modal.style.height = '100vh';
                      modal.style.background = 'rgba(0,0,0,0.8)';
                      modal.style.display = 'flex';
                      modal.style.alignItems = 'center';
                      modal.style.justifyContent = 'center';
                      modal.style.zIndex = '9999';
                      modal.onclick = () => document.body.removeChild(modal);
                      const img = document.createElement('img');
                      img.src = itemQuery.data?.photo_url || "";
                      img.alt = itemQuery.data?.name || 'Foto Barang';
                      img.style.maxWidth = '90vw';
                      img.style.maxHeight = '80vh';
                      img.style.borderRadius = '1rem';
                      img.style.boxShadow = '0 4px 24px #0008';
                      modal.appendChild(img);
                      document.body.appendChild(modal);
                    }}
                  />
                </Show>
              </div>
              <div>
                <span class="font-semibold">Asal:</span> {sourcesQuery.data?.find((src: any) => src.id === itemQuery.data?.source_id)?.name || itemQuery.data?.source_id}
              </div>
              <div class="mt-4">
                <span class="font-semibold block mb-1">QR Code Inventaris:</span>
                <Show when={itemQuery.data?.id}>
                  <img
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/items/${itemQuery.data?.id}/qrcode`}
                    alt="QR Code Inventaris"
                    class="w-32 h-32 border rounded bg-white"
                    loading="lazy"
                  />
                  <a
                    href={`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/items/${itemQuery.data?.id}/qrcode`}
                    download={`item-${itemQuery.data?.id}-qrcode.png`}
                    class="inline-block mt-2 px-3 py-1 bg-primary text-white rounded text-xs hover:bg-blue-700"
                  >
                    Download QR
                  </a>
                </Show>
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
              <button class="mt-2 bg-primary text-white px-4 py-2 rounded" onClick={() => setEditMode(true)}>Edit</button>
            </div>
          </Match>
        </Switch>

      </ErrorBoundary>
    </div>
  );
}
