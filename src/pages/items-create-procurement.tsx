import { useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import ProcurementItemForm from "~/components/items/procurement-item-form";
import { useCreateItem } from "~/hooks/useItems";
import { useToast } from "~/components/common/ToastContext";
import type { NewItem } from "~/types/item.types";
import { formatPhotoUrl } from "~/utils/formatters";
import { useUploadItemImage } from "~/hooks/useImageUpload";

export default function CreateProcurementItemPage() {
  const navigate = useNavigate();
  const createItem = useCreateItem();
  const { showToast } = useToast();
  const [error, setError] = createSignal<string | null>(null);
  const [tempImageFile, setTempImageFile] = createSignal<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = createSignal(false);
  
  // Mutation untuk upload gambar
  const uploadItemImage = useUploadItemImage();
  
  // Fungsi untuk menyimpan file gambar sementara
  const handleImageSelected = (file: File) => {
    console.log('File gambar disimpan sementara:', file.name);
    setTempImageFile(file);
  };
  
  // Fungsi untuk upload gambar setelah item dibuat menggunakan hook
  const uploadImageAfterCreate = async (itemId: string, file: File) => {
    setIsUploadingImage(true);
    
    try {
      console.log('Mengupload gambar untuk item pengadaan baru dengan ID:', itemId);
      
      // Gunakan hook uploadItemImage untuk mengupload gambar
      const photoUrl = await uploadItemImage.mutateAsync({ file, itemId });
      console.log('Upload gambar berhasil, URL:', photoUrl);
      
      showToast("Gambar berhasil diupload", "success");
    } catch (err) {
      console.error('Error uploading image after create:', err);
      showToast(err instanceof Error ? err.message : 'Gagal upload gambar', "error");
      // Tetap lanjutkan meskipun upload gambar gagal
    } finally {
      setIsUploadingImage(false);
    }
  };
  
  const handleSubmit = (data: NewItem) => {
    setError(null);
    
    // Simpan file gambar sementara jika ada
    const imageFile = tempImageFile();
    
    // Hapus photo_url dari data jika ada, karena kita akan upload setelah item dibuat
    const itemData = { ...data };
    delete itemData.photo_url;
    
    createItem.mutate(itemData, {
      onSuccess: async (result) => {
        showToast("Item pengadaan berhasil ditambahkan", "success");
        
        // Jika ada file gambar, upload setelah item dibuat
        if (imageFile) {
          await uploadImageAfterCreate(result.id, imageFile);
        }
        
        // Navigasi ke halaman detail item
        navigate(`/items/${result.id}`);
      },
      onError: (err) => {
        setError(err.message || "Gagal menambahkan item pengadaan");
        showToast(err.message || "Gagal menambahkan item pengadaan", "error");
      }
    });
  };
  
  return (
    <div class="px-4 py-6 max-w-2xl mx-auto">
      <div class="flex flex-col items-center gap-2 mb-6">
        <h1 class="text-2xl font-bold text-sidebar text-center">Tambah Barang Pengadaan</h1>
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
        <ProcurementItemForm 
          onSubmit={handleSubmit}
          isSubmitting={createItem.status === "pending" || isUploadingImage()}
          submitLabel={isUploadingImage() ? "Mengupload Gambar..." : "Tambah Barang Pengadaan"}
          onCancel={() => navigate("/items")}
          onImageSelected={handleImageSelected}
        />
      </div>
    </div>
  );
}
