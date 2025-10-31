import z from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "Ukuran file maksimal 2MB")
  .refine((file) => file.type.startsWith("image/"), "File harus berupa gambar");

// Helper: Validate image (can be File or existing URL string or null)
const optionalImageSchema = z
  .union([
    imageFileSchema, // New file upload
    z.string().url().min(1), // Existing URL (not empty)
    z.null(), // Explicitly null
    z.undefined(), // Explicitly undefined
  ])
  .optional() // Can be omitted entirely
  .nullable(); // Can be null

export const loginSchemaForm = z.object({
  email: z.email("Please enter a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  email: z.email("Please enter a valid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is Required"),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  avatar_url: z.union([
    z.string().min(1, "Image URL is required"),
    z.instanceof(File),
  ]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const updateStoreProfileSchema = z.object({
  name: z
    .string()
    .min(3, "Nama toko minimal 3 karakter")
    .max(100, "Nama toko maksimal 100 karakter"),

  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(500, "Deskripsi maksimal 500 karakter"),

  address: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(200, "Alamat maksimal 200 karakter"),

  phone: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit")
    .max(15, "Nomor telepon maksimal 15 digit")
    .regex(/^[0-9+\-\s()]+$/, "Format nomor telepon tidak valid"),

  district_id: z.string().min(1, "Wilayah harus dipilih"),
  sub_district_id: z.string().min(1, "Kecamatan harus dipilih"),
  village_id: z.string().min(1, "Kelurahan/Desa harus dipilih"),

  // ✅ All images are optional
  avatar_url: optionalImageSchema,
  logo_url: optionalImageSchema,
  cover_url: optionalImageSchema,
  social_links: z
    .record(
      z.string(), // key type
      z.string().url("URL tidak valid").or(z.literal("")) // value type
    )
    .optional(),
});

export type LoginForm = z.infer<typeof loginSchemaForm>;
export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>;
export type UpdateStoreProfileForm = z.infer<typeof updateStoreProfileSchema>;
