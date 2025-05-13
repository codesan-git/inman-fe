import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import ItemForm from "~/components/items/item-form";
import { useCreateItem } from "~/hooks/useItems";
import { useToast } from "~/components/common/ToastContext";
import type { NewItem } from "~/types/item.types";

export default function CreateItemPage() {
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const { showToast } = useToast();
  const [error, setError] = createSignal<string | null>(null);
  
  const handleSubmit = (data: NewItem) => {
    setError(null);
    createItem.mutate(data, {
      onSuccess: (result) => {
        showToast("Item berhasil ditambahkan", "success");
        navigate(`/items/${result.id}`);
      },
      onError: (err) => {
        setError(err.message || "Gagal menambahkan item");
        showToast(err.message || "Gagal menambahkan item", "error");
      }
    });
  };
  
  return (
    <div class="px-4 py-6 max-w-2xl mx-auto">
      <div class="flex flex-col items-center gap-2 mb-6">
        <h1 class="text-2xl font-bold text-sidebar text-center">Tambah Barang Baru</h1>
        <button 
          class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm shadow" 
          onClick={() => navigate("/items")}
        >
          Kembali ke Daftar
        </button>
      </div>
      
      {error() && (
        <div class="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error()}
        </div>
      )}
      
      <div class="bg-white rounded-lg shadow-md border p-6">
        <ItemForm 
          onSubmit={handleSubmit}
          isSubmitting={createItem.status === "pending"}
          submitLabel="Tambah Barang"
          onCancel={() => navigate("/items")}
        />
      </div>
    </div>
  );
}
