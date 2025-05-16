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
