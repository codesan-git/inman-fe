import { createSignal, Show, For, createEffect } from "solid-js";
import { createToast, Toast } from "~/components/common/Toast";
import { useCategories, useConditions, useSources, useLocations, useLookupActions } from "~/hooks/useLookups";
import { Button } from "~/components/ui/button";
import type { Category, Condition, ItemSource, Location } from "~/types/lookup.types";

// Tipe untuk tab
type LookupType = "categories" | "conditions" | "sources" | "locations";

const lookupLabels = {
  categories: "Kategori",
  conditions: "Kondisi",
  sources: "Asal Barang",
  locations: "Lokasi",
};

export default function LookupsConfigPage() {
  const [tab, setTab] = createSignal<LookupType>("categories");
  const [newName, setNewName] = createSignal("");
  const [newDesc, setNewDesc] = createSignal("");
  // Hooks untuk fetch data
  const categoriesQuery = useCategories();
  const conditionsQuery = useConditions();
  const sourcesQuery = useSources();
  const locationsQuery = useLocations();

  type QueryResult = {
    data?: Category[] | Condition[] | ItemSource[] | Location[];
    error?: unknown;
    isPending?: boolean;
    message?: string;
  };
  const queries: Record<LookupType, QueryResult> = {
    categories: categoriesQuery,
    conditions: conditionsQuery,
    sources: sourcesQuery,
    locations: locationsQuery,
  };

  // Integrasi hook actions
  const {
    handleAdd,
    handleDelete,
    addStatus, addError,
    deleteStatus, deleteError,
    // editStatus, editError, // (future)
    error
  } = useLookupActions(tab, setNewName, setNewDesc, queries);

  // Ambil data sesuai tab aktif
  const currentData = () => queries[tab()].data || [];

  // Toast notification system
  const { toast, showToast } = createToast();

  createEffect(() => {
    if (addStatus === "success") showToast("Data berhasil ditambah!", "success");
    if (addStatus === "error" && addError) showToast(addError, "error");
    if (deleteStatus === "success") showToast("Data berhasil dihapus!", "success");
    if (deleteStatus === "error" && deleteError) showToast(deleteError, "error");
  });

  // Toast for fetch error (query error)
  createEffect(() => {
    const q = queries[tab()];
    if (q.error) {
      let msg: string;
      if (typeof q.error === "string") {
        msg = q.error;
      } else if (q.error && typeof q.error === "object" && "message" in q.error && typeof (q.error as any).message === "string") {
        msg = (q.error as { message: string }).message;
      } else {
        msg = "Gagal memuat data";
      }
      showToast(msg, "error");
    }
  });

  return (
    <div class="px-2 sm:px-4 md:px-8 py-4 max-w-full w-full mx-auto">
      <h1 class="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Konfigurasi Lookup</h1>
      <div class="flex flex-wrap gap-2 mb-4 justify-center">
        {(["categories", "conditions", "sources", "locations"] as LookupType[]).map((type) => (
          <Button
            variant={tab() === type ? "default" : "outline"}
            onClick={() => setTab(type)}
            class="text-xs sm:text-base px-3 sm:px-4 py-2 sm:py-2 flex-1 min-w-[100px]"
          >
            {lookupLabels[type]}
          </Button>
        ))}
      </div>
      <div class="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto">
        <h2 class="text-base sm:text-lg font-semibold mb-2 sm:mb-4">Daftar {lookupLabels[tab()]}</h2>
        <form
          class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4"
          onSubmit={e => {
            e.preventDefault();
            handleAdd(newName(), newDesc());
          }}
        >
          <input
            class="border rounded px-3 py-2 text-sm sm:text-base flex-1 min-w-0"
            type="text"
            placeholder={`Nama ${lookupLabels[tab()]}`}
            value={newName()}
            onInput={e => setNewName(e.currentTarget.value)}
          />
          <input
            class="border rounded px-3 py-2 text-sm sm:text-base flex-1 min-w-0"
            type="text"
            placeholder="Deskripsi (opsional)"
            value={newDesc()}
            onInput={e => setNewDesc(e.currentTarget.value)}
          />
          <Button type="submit" variant="default" class="w-full sm:w-auto">
            {addStatus === "pending" ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
        <Show when={addStatus === "pending"}>
          <div class="mb-2 text-blue-600">Menambah data...</div>
        </Show>
        <Show when={queries[tab()].isPending}>
          <div>Loading data...</div>
        </Show>
        <Show when={queries[tab()].error}>
          <div class="text-red-500">Gagal memuat data</div>
        </Show>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[400px] text-xs sm:text-sm">
            <thead>
              <tr>
                <th class="text-left px-2 py-1 whitespace-nowrap">Nama</th>
                <th class="text-left px-2 py-1 whitespace-nowrap">Deskripsi</th>
                <th class="w-28 sm:w-36 whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody>
              <For each={currentData()}>
                {(item: Category | Condition | ItemSource | Location) => (
                  <tr class="border-b last:border-b-0">
                    <td class="px-2 py-3 sm:py-4 align-middle">{item.name}</td>
                    <td class="px-2 py-3 sm:py-4 align-middle">{item.description}</td>
                    <td class="align-middle">
                      <div class="flex flex-col sm:flex-row gap-2 w-full justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          class="w-full sm:w-auto"
                          onClick={() => {
                            setNewName(item.name);
                            setNewDesc(item.description ?? "");
                          }}
                          title="Edit data ini"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          class="w-full sm:w-auto"
                          onClick={() => handleDelete(item.id)}
                          disabled={deleteStatus === "pending"}
                        >
                          {deleteStatus === "pending" ? "Menghapus..." : "Hapus"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <Toast toast={toast} />
      </div>
    </div>
  );
}
