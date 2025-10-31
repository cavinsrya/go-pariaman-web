import z from "zod";

export const createProductSchema = z.object({
  title: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .min(3, "Nama produk minimal 3 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi produk wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter"),
  price: z
    .string()
    .min(1, "Harga wajib diisi")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Harga harus angka positif"
    ),
  category_ids: z.array(z.string()).min(1, "Minimal 1 kategori harus dipilih"),
  media: z
    .array(z.instanceof(File))
    .min(1, "Minimal 1 gambar/video harus diupload")
    .max(5, "Maksimal 5 file media"),
});

export const updateProductSchema = z.object({
  title: z
    .string()
    .min(1, "Nama produk wajib diisi")
    .min(3, "Nama produk minimal 3 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi produk wajib diisi")
    .min(10, "Deskripsi minimal 10 karakter"),
  category_ids: z.array(z.string()).min(1, "Minimal 1 kategori harus dipilih"),
  price: z
    .string()
    .min(1, "Harga wajib diisi")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Harga harus angka positif"
    ),
});

export type CreateProductForm = z.infer<typeof createProductSchema>;
export type UpdateProductForm = z.infer<typeof updateProductSchema>;
