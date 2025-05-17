/**
 * Fungsi untuk memformat URL foto
 * @param url URL foto yang akan diformat
 * @returns URL foto yang sudah diformat
 */
export function formatPhotoUrl(url: string): string {
  if (!url) return "";

  // Jika URL sudah lengkap (dimulai dengan http/https), gunakan apa adanya
  if (url.startsWith("http")) return url;

  // Jika URL hanya berisi ID file Google Drive, gunakan endpoint proxy lokal
  if (url.match(/^[a-zA-Z0-9_-]+$/)) {
    // Gunakan endpoint proxy yang sudah ada di backend
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    // Gunakan path yang sesuai dengan konfigurasi backend
    return `${apiUrl}/upload/proxy/drive/${url}`;
  }

  // Jika format lain, kembalikan apa adanya
  return url;
}

/**
 * Fungsi untuk memformat tanggal
 * @param dateString String tanggal yang akan diformat
 * @param format Format yang diinginkan (default: 'full')
 * @returns String tanggal yang sudah diformat
 */
export function formatDate(dateString: string, format: 'full' | 'date' | 'time' = 'full'): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);

    switch (format) {
      case 'date':
        return date.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'time':
        return date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      case 'full':
      default:
        return date.toLocaleString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
    }
  } catch (e) {
    return dateString;
  }
}

/**
 * Fungsi untuk memformat nilai uang dalam format Rupiah
 * @param value Nilai yang akan diformat (string angka atau number)
 * @param withSymbol Menampilkan simbol Rp di depan nilai (default: true)
 * @returns String nilai yang sudah diformat dengan pemisah ribuan
 */
export function formatRupiah(value: string | number | undefined | null, withSymbol: boolean = true): string {
  if (value === undefined || value === null || value === '') return '';
  
  // Konversi ke string dan pastikan hanya berisi angka
  const numericValue = String(value).replace(/[^0-9]/g, '');
  
  // Format dengan pemisah ribuan (menggunakan titik)
  const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Tambahkan simbol Rp jika diperlukan
  return withSymbol ? `Rp ${formattedValue}` : formattedValue;
}

/**
 * Fungsi untuk memformat input nilai Rupiah secara real-time
 * @param input Element input yang nilainya akan diformat
 * @returns String nilai yang sudah difilter (hanya angka)
 */
export function formatRupiahInput(input: HTMLInputElement): string {
  // Simpan posisi kursor
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const length = input.value.length;
  
  // Filter hanya angka
  const sanitizedValue = input.value.replace(/[^0-9]/g, '');
  
  // Format dengan pemisah ribuan (menggunakan titik)
  const formattedValue = sanitizedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  // Update nilai input dengan format baru
  input.value = formattedValue;
  
  // Hitung perubahan panjang untuk menyesuaikan posisi kursor
  const newLength = input.value.length;
  const diff = newLength - length;
  
  // Kembalikan posisi kursor yang disesuaikan
  if (start !== null && end !== null) {
    input.setSelectionRange(start + diff, end + diff);
  }
  
  return sanitizedValue; // Kembalikan nilai tanpa format untuk disimpan di state
}
