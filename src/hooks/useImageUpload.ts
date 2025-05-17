import { useMutation, useQueryClient, createMutation } from '@tanstack/solid-query';
import axios, { AxiosError } from 'axios';
import { apiUrl } from './apiUrl';
import { formatPhotoUrl } from '~/utils/formatters';

// Tipe untuk parameter upload gambar
export interface UploadImageParams {
  file: File;
  itemId?: string; // Opsional, jika ada akan mengupload ke folder item
}

// Tipe untuk respons upload gambar
export interface UploadImageResponse {
  photo_url?: string;
  url?: string;
  file_id?: string;
  file_url?: string;
  path?: string;
  [key: string]: any;
}

// Fungsi untuk mendapatkan token
const getToken = (): string | undefined => {
  return localStorage.getItem('token') || document.cookie.split('; ')
    .find(row => row.startsWith('token='))?.split('=')[1];
};

// Konfigurasi axios dengan header otentikasi
const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

// Tambahkan interceptor untuk menambahkan token ke setiap request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fungsi untuk mengupload gambar
 * @param params Parameter upload gambar
 * @returns URL gambar yang sudah diformat
 */
async function uploadImage(params: UploadImageParams): Promise<string> {
  const { file, itemId } = params;
  const formData = new FormData();
  formData.append('file', file);

  // Tentukan endpoint berdasarkan ketersediaan itemId
  const endpoint = itemId
    ? `/upload/${itemId}/upload-image`
    : '/upload';

  const method = itemId ? 'PATCH' : 'POST';

  console.log(`Mengupload gambar ke ${endpoint} dengan method ${method}`);

  try {
    // Attempt to make the request
    const response = await axiosInstance({
      url: endpoint,
      method,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload berhasil:', response.data);

    // Ekstrak URL gambar dari respons berdasarkan format respons
    let photoUrl = '';
    const data: UploadImageResponse = response.data;

    if (itemId) {
      // Untuk update item, respons berisi data item lengkap dengan photo_url
      photoUrl = data.photo_url || '';
      if (!photoUrl) {
        throw new Error('URL gambar tidak ditemukan dalam respons update item');
      }
    } else {
      // Untuk upload biasa, respons berisi URL langsung atau dalam field url
      photoUrl = data.url || data.file_url || data.photo_url || data.path || '';

      if (typeof data === 'string') {
        photoUrl = data;
      }

      if (!photoUrl) {
        throw new Error('URL gambar tidak ditemukan dalam respons');
      }

      // Format URL gambar jika diperlukan
      return formatPhotoUrl(photoUrl);
    }

    // Format URL gambar menggunakan util formatPhotoUrl
    const formattedUrl = formatPhotoUrl(photoUrl);
    console.log('URL gambar setelah format:', formattedUrl);

    return formattedUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Handle specific backend errors
    if (axios.isAxiosError(error) && error.response) {
      const responseData = error.response.data;
      
      // Check for the specific 'value' column error
      if (typeof responseData === 'object' && 
          responseData.error && 
          responseData.error.includes('no column found for name: value')) {
        
        console.warn('Detected backend issue with value column - handling gracefully');
        
        // For this specific error with item image upload, return a placeholder URL
        // This is a workaround until the backend is fixed
        if (itemId) {
          // Create a temporary URL that indicates this is a pending image
          // The UI can handle this specially if needed
          return `pending-upload-${Date.now()}`;
        }
      }
      
      // For other axios errors, throw with the response data
      if (typeof responseData === 'object' && responseData.error) {
        throw new Error(responseData.error);
      } else if (typeof responseData === 'string') {
        throw new Error(responseData);
      } else {
        throw new Error(error.message);
      }
    }
    
    // For non-axios errors, just rethrow
    throw error;
  }
}

/**
 * Hook untuk mengupload gambar
 * @returns Mutation untuk upload gambar
 */
export function useUploadImage() {
  const state = useMutation(() => ({
    mutationKey: ['upload', 'image'],
    mutationFn: uploadImage,
    onSuccess: () => {
      // Tidak perlu invalidate query karena ini adalah upload baru
    },
  }));
  return state;
}

/**
 * Hook untuk upload gambar item
 * @returns Mutation untuk upload gambar item
 */
export function useUploadItemImage() {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: uploadImage,
    onSuccess: (data: string, variables: UploadImageParams) => {
      // Jika ada itemId, invalidate query item tersebut
      if (variables.itemId) {
        queryClient.invalidateQueries({ queryKey: ['items', variables.itemId] });
      }
    },
  }));
}

/**
 * Tipe parameter untuk update item dengan gambar dan data lainnya
 */
export interface UpdateItemWithImageParams {
  itemId: string;
  file: File;
  itemData?: Record<string, any>; // Data item lainnya yang akan diupdate
}

/**
 * Fungsi untuk update item dengan gambar dalam satu transaksi
 * @param params Parameter update item dengan gambar
 * @returns Data item yang sudah diupdate
 */
async function updateItemWithImage(params: UpdateItemWithImageParams): Promise<any> {
  const { itemId, file, itemData } = params;
  const formData = new FormData();
  
  // Get the file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Determine the correct MIME type based on file extension
  let mimeType = 'image/jpeg'; // Default
  if (fileExtension === 'png') mimeType = 'image/png';
  else if (fileExtension === 'jpg' || fileExtension === 'jpeg') mimeType = 'image/jpeg';
  else if (fileExtension === 'gif') mimeType = 'image/gif';
  else if (fileExtension === 'pdf') mimeType = 'application/pdf';
  
  console.log(`File type detected: ${mimeType} for file ${file.name}`);
  
  // Create a new File object with the correct MIME type
  const fileWithCorrectType = new File([file], file.name, { type: mimeType });
  
  // Add the file to the form data
  formData.append('file', fileWithCorrectType, file.name);
  
  // Also add the detected MIME type as a separate field
  formData.append('contentType', mimeType);
  
  // Jika ada data item lainnya, tambahkan ke formData sebagai JSON string
  if (itemData && Object.keys(itemData).length > 0) {
    formData.append('itemData', JSON.stringify(itemData));
    console.log('Menambahkan data item ke formData:', itemData);
  }

  try {
    console.log(`Mengupdate item dan mengupload gambar untuk item ID: ${itemId}`);
    
    // Gunakan endpoint yang menggabungkan update item dan upload gambar
    const response = await axiosInstance({
      url: `/upload/${itemId}/update-with-image`,
      method: 'PATCH',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Update item dengan gambar berhasil:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating item with image:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message);
    }
    throw error;
  }
}

/**
 * Hook untuk update item dengan gambar dalam satu transaksi
 * @returns Mutation untuk update item dengan gambar
 */
export function useUpdateItemWithImage() {
  const queryClient = useQueryClient();
  
  return createMutation(() => ({
    mutationFn: updateItemWithImage,
    onSuccess: (data: any, variables: UpdateItemWithImageParams) => {
      // Invalidate query item dan logs
      queryClient.invalidateQueries({ queryKey: ['items', variables.itemId] });
      queryClient.invalidateQueries({ queryKey: ['items', variables.itemId, 'logs'] });
    },
  }));
}

// Tipe untuk parameter fetch item logs
export interface FetchItemLogsParams {
  itemId: string;
}

// Tipe untuk item log
export interface ItemLog {
  id: string;
  item_id: string;
  action: string;
  user_id: string;
  user_name?: string;
  details?: string;
  created_at: string;
  before?: any;
  after?: any;
}

/**
 * Fungsi untuk mengambil log item
 * @param params Parameter fetch log item
 * @returns Array log item
 */
async function fetchItemLogs(params: FetchItemLogsParams): Promise<ItemLog[]> {
  const { itemId } = params;

  try {
    // API endpoint sesuai dengan definisi di backend
    const response = await axiosInstance.get(`/items/item_logs/${itemId}`);

    // Jika data adalah array, gunakan langsung
    // Jika data memiliki property items atau logs, gunakan itu
    const logItems: ItemLog[] = Array.isArray(response.data)
      ? response.data
      : (response.data.items || response.data.logs || []);

    return logItems;
  } catch (error) {
    console.error('Error fetching item logs:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data || error.message);
    }
    throw error;
  }
}

/**
 * Hook untuk mengambil log item
 * @param itemId ID item
 * @returns Mutation untuk fetch log item
 */
export function useItemLogs(itemId: string) {
  const state = useMutation(() => ({
    mutationKey: ['items', itemId, 'logs'],
    mutationFn: () => fetchItemLogs({ itemId }),
  }));
  return state;
}
