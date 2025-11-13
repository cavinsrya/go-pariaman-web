import z from "zod";

// Constants for file validation
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime", // .mov
];

// Custom file validator
const fileValidator = z.instanceof(File)
  .refine(
    (file) => {
      const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
      const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);
      return isImage || isVideo;
    },
    {
      message: "File harus berupa gambar (JPEG, PNG, WebP, GIF) atau video (MP4, WebM, OGG, MOV)",
    }
  )
  .refine(
    (file) => {
      const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);
      const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
      return file.size <= maxSize;
    },
    {
      message: "Ukuran file melebihi batas maksimal (5MB untuk gambar, 50MB untuk video)",
    }
  );

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
    .array(fileValidator)
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

// Export constants for use in components
export { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE, ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES };