import { useEffect } from "react";

// Custom hook untuk update judul browser tab secara dinamis
export default function useDocumentTitle(title) {
  useEffect(() => {
    // Simpan judul sebelumnya
    const prevTitle = document.title;
    
    // Update judul baru
    document.title = title;

    // Cleanup: kembalikan judul lama saat unmount
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}