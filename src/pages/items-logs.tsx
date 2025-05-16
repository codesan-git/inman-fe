import { useParams, useNavigate } from "@solidjs/router";
import { Show, ErrorBoundary, createSignal, createEffect, For } from "solid-js";
import { useItemDetail } from "~/hooks/useItems";
import { useToast } from "~/components/common/ToastContext";
import { useItemLogs } from "~/hooks/useImageUpload";
import type { ItemLog } from "~/hooks/useImageUpload";
import { formatPhotoUrl } from "~/utils/formatters";
import { useCategories, useConditions, useSources, useLocations } from "~/hooks/useLookups";
import type { Category, Condition, ItemSource, Location } from "~/types/lookup.types";

// Definisikan tipe untuk perubahan
type ItemChange = {
  field: string;
  value?: string | number;
  oldValue?: string | number;
  newValue?: string | number;
  photo_url?: string;
};

// Definisikan tipe untuk log yang sudah diproses
type ProcessedLog = {
  id: string;
  item_id: string;
  action: string;
  user_id: string;
  user_name?: string;
  details?: string;
  created_at: string;
  before?: any;
  after?: any;
  changes: ItemChange[];
};

export default function ItemLogsPage() {
  const { showToast } = useToast();
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemQuery = useItemDetail(params.id);
  const [logs, setLogs] = createSignal<ProcessedLog[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  // Lookup data untuk menerjemahkan UUID ke nama yang lebih mudah dibaca
  const categoriesQuery = useCategories();
  const conditionsQuery = useConditions();
  const sourcesQuery = useSources();
  const locationsQuery = useLocations();

  // Gunakan hook useItemLogs untuk mendapatkan log item
  const itemLogs = useItemLogs(params.id);

  // Fungsi untuk mendapatkan nama kategori dari ID
  const getCategoryName = (categoryId: string) => {
    const category = categoriesQuery.data?.find((c: Category) => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Fungsi untuk mendapatkan nama kondisi dari ID
  const getConditionName = (conditionId: string) => {
    const condition = conditionsQuery.data?.find((c: Condition) => c.id === conditionId);
    return condition ? condition.name : 'Unknown Condition';
  };

  // Fungsi untuk mendapatkan nama lokasi dari ID
  const getLocationName = (locationId: string) => {
    const location = locationsQuery.data?.find((l: Location) => l.id === locationId);
    return location ? location.name : 'Unknown Location';
  };

  // Fungsi untuk mendapatkan nama sumber dari ID
  const getSourceName = (sourceId: string) => {
    const source = sourcesQuery.data?.find((s: ItemSource) => s.id === sourceId);
    return source ? source.name : 'Unknown Source';
  };
  
  // Format tanggal untuk tampilan
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Panggil mutate untuk mengambil data log
  function fetchItemLogs() {
    setLoading(true);
    setError(null);

    // Pertama, ambil detail item terbaru untuk mendapatkan photo_url terbaru
    itemQuery.refetch().then(() => {
      const currentItemData = itemQuery.data;
      console.log('Current item data:', currentItemData);

      itemLogs.mutate(undefined, {
        onSuccess: (data) => {
          console.log('Log item berhasil diambil:', data);
          
          // Olah data log untuk menampilkan perubahan yang terjadi
          const processedLogs: ProcessedLog[] = data.map((log: any) => {
            // Clone log untuk menghindari mutasi data asli
            const processedLog: ProcessedLog = { ...log, changes: [] };
            
            console.log('Processing log:', processedLog.id, 'Action:', processedLog.action);
            
            // Pastikan before dan after adalah objek untuk menghindari error
            if (!processedLog.before) processedLog.before = {};
            if (!processedLog.after) processedLog.after = {};
            
            // Jika action adalah create, tampilkan semua field sebagai "ditambahkan"
            if (processedLog.action.toLowerCase() === 'create') {
              processedLog.changes.push({ field: 'Item', value: 'Dibuat baru' });
              
              // Tambahkan detail item yang dibuat
              if (processedLog.after) {
                if (processedLog.after.name) {
                  processedLog.changes.push({ field: 'Nama', value: processedLog.after.name });
                }
                if (processedLog.after.quantity) {
                  processedLog.changes.push({ field: 'Jumlah', value: processedLog.after.quantity });
                }
                if (processedLog.after.photo_url) {
                  processedLog.changes.push({ field: 'Foto', value: 'Ditambahkan', photo_url: processedLog.after.photo_url });
                }
              }
            }
            
            // Jika action adalah update, bandingkan before dan after untuk menampilkan perubahan
            else if (processedLog.action.toLowerCase() === 'update') {
              const before = processedLog.before || {};
              const after = processedLog.after || {};
              
              // Bandingkan setiap field
              if (before.name !== after.name && after.name) {
                processedLog.changes.push({ 
                  field: 'Nama', 
                  oldValue: before.name || '-', 
                  newValue: after.name 
                });
              }
              
              if (before.quantity !== after.quantity && after.quantity !== undefined) {
                processedLog.changes.push({ 
                  field: 'Jumlah', 
                  oldValue: before.quantity !== undefined ? before.quantity : '-', 
                  newValue: after.quantity 
                });
              }
              
              // Cek perubahan foto
              if (before.photo_url !== after.photo_url) {
                if (!before.photo_url && after.photo_url) {
                  processedLog.changes.push({ 
                    field: 'Foto', 
                    value: 'Ditambahkan', 
                    photo_url: after.photo_url 
                  });
                } else if (before.photo_url && !after.photo_url) {
                  processedLog.changes.push({ 
                    field: 'Foto', 
                    value: 'Dihapus' 
                  });
                } else if (before.photo_url && after.photo_url) {
                  processedLog.changes.push({ 
                    field: 'Foto', 
                    value: 'Diperbarui', 
                    photo_url: after.photo_url 
                  });
                }
              }
              
              // Cek perubahan lokasi
              if (before.location_id !== after.location_id) {
                const oldLocationName = before.location_id ? getLocationName(before.location_id) : '-';
                const newLocationName = after.location_id ? getLocationName(after.location_id) : '-';
                processedLog.changes.push({ 
                  field: 'Lokasi', 
                  oldValue: oldLocationName, 
                  newValue: newLocationName 
                });
              }
              
              // Cek perubahan kondisi
              if (before.condition_id !== after.condition_id) {
                const oldConditionName = before.condition_id ? getConditionName(before.condition_id) : '-';
                const newConditionName = after.condition_id ? getConditionName(after.condition_id) : '-';
                processedLog.changes.push({ 
                  field: 'Kondisi', 
                  oldValue: oldConditionName, 
                  newValue: newConditionName 
                });
              }
              
              // Cek perubahan kategori
              if (before.category_id !== after.category_id) {
                const oldCategoryName = before.category_id ? getCategoryName(before.category_id) : '-';
                const newCategoryName = after.category_id ? getCategoryName(after.category_id) : '-';
                processedLog.changes.push({ 
                  field: 'Kategori', 
                  oldValue: oldCategoryName, 
                  newValue: newCategoryName 
                });
              }
              
              // Jika tidak ada perubahan yang terdeteksi
              if (processedLog.changes.length === 0) {
                processedLog.changes.push({ field: 'Item', value: 'Tidak ada perubahan' });
              }
            }
            
            // Jika action adalah delete
            else if (processedLog.action.toLowerCase() === 'delete') {
              processedLog.changes.push({ field: 'Item', value: 'Dihapus' });
            }
            
            return processedLog;
          });
          
          setLogs(processedLogs);
          setLoading(false);
        },
        onError: (err: any) => {
          console.error('Error fetching item logs:', err);
          setError(`Error fetching item logs: ${err}`);
          showToast("error");
          setLoading(false);
        }
      });
    }).catch((err: any) => {
      console.error('Error fetching current item:', err);
      setError(`Error fetching current item: ${err}`);
      showToast("error");
      setLoading(false);
    });
  }
  
  // Load data saat komponen dimuat
  createEffect(() => {
    fetchItemLogs();
  });
  
  // Render komponen
  return (
    <ErrorBoundary fallback={(err) => <div class="p-4 text-red-500">Error: {err.toString()}</div>}>
      <div class="container mx-auto p-4">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-bold">Riwayat Perubahan Item</h1>
          <button 
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => navigate(`/items/${params.id}`)}
          >
            Kembali ke Detail Item
          </button>
        </div>
        
        <Show when={itemQuery.data} fallback={<div class="p-4">Loading item details...</div>}>
          <div class="bg-white rounded-lg shadow p-4 mb-4">
            <h2 class="text-xl font-semibold mb-2">{itemQuery.data?.name}</h2>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p><span class="font-medium">Kategori:</span> {getCategoryName(itemQuery.data?.category_id || '')}</p>
                <p><span class="font-medium">Jumlah:</span> {itemQuery.data?.quantity}</p>
                <p><span class="font-medium">Kondisi:</span> {getConditionName(itemQuery.data?.condition_id || '')}</p>
              </div>
              <div>
                <p><span class="font-medium">Lokasi:</span> {itemQuery.data?.location_id ? getLocationName(itemQuery.data.location_id) : '-'}</p>
                <p><span class="font-medium">Sumber:</span> {getSourceName(itemQuery.data?.source_id || '')}</p>
              </div>
            </div>
            <Show when={itemQuery.data?.photo_url}>
              <div class="mt-4">
                <img 
                  src={formatPhotoUrl(itemQuery.data?.photo_url || '')} 
                  alt={itemQuery.data?.name} 
                  class="max-w-xs rounded-lg shadow-sm" 
                />
              </div>
            </Show>
          </div>
        </Show>
        
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-4 bg-gray-50 border-b">
            <h2 class="text-xl font-semibold">Riwayat Perubahan</h2>
          </div>
          
          <Show when={!loading()} fallback={<div class="p-4 text-center">Loading logs...</div>}>
            <Show when={logs().length > 0} fallback={<div class="p-4 text-center">Tidak ada riwayat perubahan</div>}>
              <div class="divide-y">
                <For each={logs()}>
                  {(log) => (
                    <div class="p-4 hover:bg-gray-50">
                      <div class="flex justify-between items-start mb-2">
                        <div>
                          <span class="font-medium">{formatDate(log.created_at)}</span>
                          <span class="ml-2 text-sm text-gray-500">{log.user_name || 'System'}</span>
                        </div>
                        <span class={`px-2 py-1 text-xs rounded ${log.action.toLowerCase() === 'create' ? 'bg-green-100 text-green-800' : log.action.toLowerCase() === 'update' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                          {log.action.toLowerCase() === 'create' ? 'Dibuat' : log.action.toLowerCase() === 'update' ? 'Diperbarui' : 'Dihapus'}
                        </span>
                      </div>
                      
                      <div class="space-y-2">
                        <For each={log.changes}>
                          {(change) => (
                            <div class="pl-2 border-l-2 border-gray-300">
                              <div class="text-sm">
                                <span class="font-medium">{change.field}:</span> 
                                {change.value && (
                                  <span class="ml-1">{change.value}</span>
                                )}
                                {(change.oldValue !== undefined && change.newValue !== undefined) && (
                                  <span class="ml-1">
                                    <span class="line-through text-red-500">{change.oldValue}</span>
                                    <span class="mx-1">→</span>
                                    <span class="text-green-500">{change.newValue}</span>
                                  </span>
                                )}
                              </div>
                              {change.photo_url && (
                                <div class="mt-2">
                                  <img 
                                    src={formatPhotoUrl(change.photo_url)} 
                                    alt="Item photo" 
                                    class="max-w-xs h-32 object-cover rounded-md shadow-sm" 
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </Show>
          
          <Show when={error()}>
            <div class="p-4 text-red-500 bg-red-50 border-t">
              Error: {error()}
            </div>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  );
}