// src/types/product.d.ts

import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import type { FormEvent } from "react"; // Impor FormEvent jika belum ada

/**
 * Tipe State untuk Server Actions (Create, Update, Delete).
 */
export type ProductFormState = {
  status?: "success" | "error" | "idle";
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
    media?: string[];
    category_ids?: string[];
    _form?: string[];
  };
};

/**
 * Tipe untuk data kategori produk.
 */
export type Category = {
  id: number;
  name: string;
};

/**
 * TIPE INI DIPERBAIKI:
 * Tipe untuk SATU item media dari tabel product_media.
 */
export type ProductMedia = {
  // Hapus 'id' jika tidak diambil dari DB atau tidak diperlukan
  // id: number;
  media_path: string;
  media_type: string;
  // Hapus referensi diri: product_media: ProductMedia[];
};

/**
 * Tipe untuk relasi kategori dari tabel product_categories.
 */
export type ProductCategoryRelation = {
  category_id: number; // Atau string
};

/**
 * Tipe untuk hasil query produk dari action getProductsForUser.
 * Ini adalah tipe data produk LENGKAP Anda dari database.
 */
export type ProductQueryResult = {
  id: number;
  title: string;
  price: number;
  description: string;
  created_at: string;
  // Menggunakan tipe ProductMedia yang sudah diperbaiki
  product_media: ProductMedia[];
  product_categories: ProductCategoryRelation[];
  // Tambahkan field lain dari tabel 'products' jika ada (misal: slug, stock, dll.)
};

// Alias yang lebih deskriptif (opsional, bisa pakai ProductQueryResult saja)
export type ProductWithMedia = ProductQueryResult;

/**
 * Tipe untuk data media yang SUDAH ADA saat form edit dibuka.
 * Mirip ProductMedia tapi mungkin hanya butuh path dan id unik untuk key.
 */
export type ExistingMedia = {
  id?: number | string; // Untuk key React saat mapping
  media_path: string;
};

/**
 * TIPE INI DIUBAH DARI INTERFACE:
 * Tipe untuk props komponen FormProduct.
 */
export type FormProductProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  categories: Category[];
  onMediaChange: (files: File[]) => void;
  existingMedia?: ExistingMedia[];
  onDeleteExistingMedia?: (mediaPath: string) => void;
};

/**
 * TIPE INI SEBAIKNYA DIHAPUS atau DIPERBAIKI:
 * Tipe ini mencampur data dan fungsi props, tidak ideal.
 * Gunakan ProductCardProps di komponen ProductCard.
 */
/*
export type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  created_at?: string;
  product_media?: { media_path: string }[];
  image?: string;
  onDelete: (id: number) => void;
  onEdit: () => void;
};
*/

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image?: string; // Tanda tanya (?) menandakan prop ini opsional
  onDelete: () => void;
  onEdit: () => void;
};

export type ProductWithMedia = ProductQueryResult; // Alias
