"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
// Impor tipe ExistingMedia dari file .d.ts Anda
import type { ExistingMedia } from "@/types/product";

// Tentukan props untuk komponen baru
interface FormMediaUploadProps {
  label: string;
  maxFiles?: number;
  existingMedia?: ExistingMedia[];
  onDeleteExistingMedia?: (mediaPath: string) => void;
  onFilesChange: (files: File[]) => void; // Melaporkan file baru ke induk
}

export default function FormMediaUpload({
  label,
  maxFiles = 5, // Atur default di sini
  existingMedia = [],
  onDeleteExistingMedia,
  onFilesChange, // Terima prop ini
}: FormMediaUploadProps) {
  // --- State Internal ---
  // Komponen ini sekarang mengelola file baru & pratinjaunya sendiri
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // --- State Turunan ---
  const currentMediaCount = existingMedia.length + newFiles.length;

  // --- Logika Internal: Tambah File ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Filter file valid (termasuk toast)
    const validFiles = files.filter((file) => {
      const isValidType =
        file.type.startsWith("image/") || file.type.startsWith("video/");
      const isSmall = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast.error(`File "${file.name}" ditolak`, {
          description: "Hanya file gambar atau video yang diizinkan.",
        });
        return false;
      }
      if (!isSmall) {
        toast.error(`File "${file.name}" ditolak`, {
          description: "Ukuran file terlalu besar (maksimal 10MB).",
        });
        return false;
      }
      return true;
    });

    // Cek batas file
    const remainingSlots = maxFiles - currentMediaCount;
    if (validFiles.length > remainingSlots) {
      toast.error(`Maksimal ${maxFiles} file media`, {
        description: `Anda hanya bisa menambah ${remainingSlots} file lagi.`,
      });
      validFiles.splice(remainingSlots); // Hanya ambil file yang muat
    }

    if (validFiles.length === 0) return;

    // Perbarui state internal
    const updatedNewFiles = [...newFiles, ...validFiles];
    setNewFiles(updatedNewFiles);

    // --- Laporkan perubahan ke Induk ---
    onFilesChange(updatedNewFiles);

    // Buat pratinjau
    const filePreviews: string[] = [];
    let filesProcessed = 0;
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        filePreviews.push(reader.result as string);
        filesProcessed++;
        if (filesProcessed === validFiles.length) {
          setNewPreviews((prev) => [...prev, ...filePreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // --- Logika Internal: Hapus File Baru ---
  const removeNewFile = (index: number) => {
    const updatedNewFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedNewFiles);

    // --- Laporkan perubahan ke Induk ---
    onFilesChange(updatedNewFiles);

    const updatedNewPreviews = newPreviews.filter((_, i) => i !== index);
    setNewPreviews(updatedNewPreviews);
  };

  // --- Logika Internal: Hapus File Lama ---
  const removeExistingFile = (path: string) => {
    // Cukup panggil prop dari induk
    onDeleteExistingMedia?.(path);
  };

  // --- JSX (Kode Anda sebelumnya, sekarang ada di sini) ---
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} - {currentMediaCount} / {maxFiles} file
      </label>

      {/* 1. Tampilkan media yang SUDAH ADA */}
      {existingMedia.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {existingMedia.map((media) => (
            <div key={media.id || media.media_path} className="relative group">
              <Image
                src={media.media_path || "/placeholder.svg"}
                alt="Media yang ada"
                width={100}
                height={100}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeExistingFile(media.media_path)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 2. Tampilkan pratinjau media BARU */}
      {newPreviews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {newPreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <Image
                src={preview}
                alt={`Preview ${index}`}
                width={100}
                height={100}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeNewFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. Tampilkan Input File jika belum penuh */}
      {currentMediaCount < maxFiles && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="hidden"
            id="media-input"
          />
          <label htmlFor="media-input" className="cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Klik untuk tambah media (Sisa {maxFiles - currentMediaCount})
            </p>
            <p className="text-xs text-gray-500 mt-1">Maks 10MB per file</p>
          </label>
        </div>
      )}
    </div>
  );
}
