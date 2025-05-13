import { createSignal, Show } from "solid-js";
import { apiUrl } from "~/hooks/apiUrl";
import { useToast } from "~/components/common/ToastContext";

type ImageUploadProps = {
  initialValue?: string;
  onImageUploaded: (url: string) => void;
};

export default function ImageUpload(props: ImageUploadProps) {
  const { showToast } = useToast();
  const [preview, setPreview] = createSignal<string | null>(props.initialValue || null);
  const [isUploading, setIsUploading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;
    
    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.');
      showToast('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.', 'error');
      return;
    }
    
    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file terlalu besar (maksimal 5MB)');
      showToast('Ukuran file terlalu besar (maksimal 5MB)', 'error');
      return;
    }
    
    // Tampilkan preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Upload file
    setIsUploading(true);
    setError(null);
    
    try {
      console.log('Memulai upload gambar ke:', `${apiUrl}/upload`);
      
      // Dapatkan token dari localStorage atau cookie jika ada
      const token = localStorage.getItem('token') || document.cookie.split('; ')
        .find(row => row.startsWith('token='))?.split('=')[1];
      
      const formData = new FormData();
      formData.append('file', file);
      
      // Tambahkan header untuk debugging
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('Mengirim request dengan headers:', headers);
      
      const response = await fetch(`${apiUrl}/upload`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
        mode: 'cors',
      });
      
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Upload gagal: ${response.statusText}. ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Upload berhasil, data:', data);
      
      if (!data.url) {
        throw new Error('URL gambar tidak ditemukan dalam respons');
      }
      
      props.onImageUploaded(data.url);
      showToast('Gambar berhasil diupload', 'success');
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Gagal upload gambar');
      showToast('Gagal upload gambar', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div class="w-full">
      <div class="mb-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Foto Barang
        </label>
        <div class="flex items-center gap-4">
          <div 
            class="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden"
          >
            <Show when={preview()} fallback={
              <div class="text-center text-gray-500 text-xs p-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Belum ada foto
              </div>
            }>
              <img 
                src={preview() || ''} 
                alt="Preview" 
                class="w-full h-full object-cover"
              />
            </Show>
            <Show when={isUploading()}>
              <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div class="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
              </div>
            </Show>
          </div>
          
          <div class="flex-1">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/jpeg,image/png,image/webp,image/gif"
              class="sr-only"
              onChange={handleFileChange}
            />
            <label
              for="photo"
              class="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer text-sm hover:bg-blue-600 transition-colors"
            >
              {preview() ? 'Ganti Foto' : 'Upload Foto'}
            </label>
            <p class="text-xs text-gray-500 mt-1">
              JPG, PNG, WebP, atau GIF. Maks 5MB.
            </p>
          </div>
        </div>
        <Show when={error()}>
          <p class="text-red-500 text-xs mt-1">{error()}</p>
        </Show>
      </div>
    </div>
  );
}
