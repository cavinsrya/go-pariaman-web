"use server";

import { uploadFile, deleteFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { ProductFormState } from "@/types/product";
import {
  createProductSchema,
  updateProductSchema,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "@/validations/product.validation";
import type { ProductQueryResult } from "@/types/product";

// Helper function to validate file
function validateMediaFile(file: File): { valid: boolean; error?: string } {
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
  const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: `Format file ${file.name} tidak didukung`,
    };
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > maxSize) {
    const maxSizeMB = isVideo ? 50 : 5;
    return {
      valid: false,
      error: `Ukuran ${file.name} melebihi ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

export async function createProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const mediaFiles = formData.getAll("media") as File[];
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category_ids = formData.getAll("category_ids") as string[];

  // Validate media files before schema validation
  for (const file of mediaFiles) {
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return {
        status: "error",
        errors: { _form: [validation.error || "File tidak valid"] },
      };
    }
  }

  const validatedFields = createProductSchema.safeParse({
    title,
    description,
    price,
    category_ids,
    media: mediaFiles,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  // Get user's store
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return {
      status: "error",
      errors: { _form: ["User tidak terautentikasi"] },
    };
  }

  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_user_id", userData.user.id)
    .single();

  if (storeError || !store) {
    return {
      status: "error",
      errors: { _form: ["Toko tidak ditemukan"] },
    };
  }

  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  // Create product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      store_id: store.id,
      title: validatedFields.data.title,
      slug: `${slug}-${Date.now()}`,
      description: validatedFields.data.description,
      price: Number.parseFloat(validatedFields.data.price),
    })
    .select()
    .single();

  if (productError || !product) {
    return {
      status: "error",
      errors: { _form: [productError?.message || "Gagal membuat produk"] },
    };
  }

  // Insert category relations
  const relationsToInsert = validatedFields.data.category_ids.map((catId) => ({
    product_id: product.id,
    category_id: Number.parseInt(catId, 10),
  }));

  const { error: categoryError } = await supabase
    .from("product_categories")
    .insert(relationsToInsert);

  if (categoryError) {
    // Rollback: delete product if category insert fails
    await supabase.from("products").delete().eq("id", product.id);
    return {
      status: "error",
      errors: { _form: ["Gagal menambahkan kategori"] },
    };
  }

  // Upload media files
  const uploadedMedia: Array<{ path: string; type: string; order: number }> = [];

  for (let i = 0; i < validatedFields.data.media.length; i++) {
    const file = validatedFields.data.media[i];
    
    // Determine media type
    const mediaType = file.type.startsWith("video/") ? "video" : "image";
    
    // Upload to storage
    const { errors, data } = await uploadFile(
      "images", // Consider renaming bucket to "media" or "product-media"
      `products/${product.id}`,
      file
    );

    if (errors || !data) {
      // Rollback: delete uploaded files and product
      for (const uploaded of uploadedMedia) {
        const path = uploaded.path.split("/images/")[1];
        if (path) await deleteFile("images", path);
      }
      await supabase.from("products").delete().eq("id", product.id);
      
      return {
        status: "error",
        errors: { 
          _form: [`Gagal mengunggah ${mediaType}: ${file.name}`] 
        },
      };
    }

    uploadedMedia.push({ path: data.url, type: mediaType, order: i });

    // Insert media record
    const { error: mediaError } = await supabase.from("product_media").insert({
      product_id: product.id,
      media_path: data.url,
      media_type: mediaType,
      sort_order: i,
    });

    if (mediaError) {
      // Rollback
      for (const uploaded of uploadedMedia) {
        const path = uploaded.path.split("/images/")[1];
        if (path) await deleteFile("images", path);
      }
      await supabase.from("products").delete().eq("id", product.id);
      
      return {
        status: "error",
        errors: { _form: ["Gagal menyimpan data media"] },
      };
    }
  }

  return { status: "success", errors: {} };
}

export async function updateProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const productId = parseInt(formData.get("id") as string, 10);
  if (!productId || isNaN(productId)) {
    return {
      status: "error",
      errors: { _form: ["Product ID tidak valid"] },
    };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category_ids = formData.getAll("category_ids") as string[];
  const newMediaFiles = formData.getAll("media") as File[];
  const deletedMediaPaths = formData.getAll("deleted_media_paths") as string[];

  // Validate new media files
  for (const file of newMediaFiles) {
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return {
        status: "error",
        errors: { _form: [validation.error || "File tidak valid"] },
      };
    }
  }

  // Validate fields
  const validatedFields = updateProductSchema.safeParse({
    title,
    description,
    price,
    category_ids,
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  // Update product basic info
  const { error: updateError } = await supabase
    .from("products")
    .update({
      title: validatedFields.data.title,
      description: validatedFields.data.description,
      price: Number.parseFloat(validatedFields.data.price),
    })
    .eq("id", productId);

  if (updateError) {
    return {
      status: "error",
      errors: { _form: ["Gagal memperbarui produk"] },
    };
  }

  // Update category relations (delete all + re-insert)
  await supabase
    .from("product_categories")
    .delete()
    .eq("product_id", productId);

  const relationsToInsert = validatedFields.data.category_ids.map((catId) => ({
    product_id: productId,
    category_id: Number.parseInt(catId, 10),
  }));

  const { error: categoryError } = await supabase
    .from("product_categories")
    .insert(relationsToInsert);

  if (categoryError) {
    return {
      status: "error",
      errors: { _form: ["Gagal memperbarui kategori"] },
    };
  }

  // Delete old media files
  if (deletedMediaPaths.length > 0) {
    for (const mediaPath of deletedMediaPaths) {
      const path = mediaPath.split("/images/")[1];
      if (path) {
        await deleteFile("images", path);
      }
      await supabase.from("product_media").delete().eq("media_path", mediaPath);
    }
  }

  // Upload new media files
  if (newMediaFiles.length > 0) {
    const { data: lastMedia } = await supabase
      .from("product_media")
      .select("sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();

    let currentSortOrder = lastMedia ? lastMedia.sort_order + 1 : 0;

    for (const file of newMediaFiles) {
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      
      const { errors, data } = await uploadFile(
        "images",
        `products/${productId}`,
        file
      );

      if (errors || !data) {
        return {
          status: "error",
          errors: { 
            _form: [`Gagal mengunggah ${mediaType} baru: ${file.name}`] 
          },
        };
      }

      await supabase.from("product_media").insert({
        product_id: productId,
        media_path: data.url,
        media_type: mediaType,
        sort_order: currentSortOrder++,
      });
    }
  }

  return { status: "success", errors: {} };
}

export async function deleteProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const productId = parseInt(formData.get("id") as string, 10);
  if (!productId || isNaN(productId)) {
    return {
      status: "error",
      errors: { _form: ["Product ID tidak valid"] },
    };
  }

  const supabase = await createClient();

  // Get and delete all media files
  const { data: mediaList } = await supabase
    .from("product_media")
    .select("media_path")
    .eq("product_id", productId);

  if (mediaList) {
    for (const media of mediaList) {
      const path = media.media_path.split("/images/")[1];
      if (path) {
        await deleteFile("images", path);
      }
    }
  }

  // Delete product (cascade deletes media records)
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return {
      status: "error",
      errors: { _form: ["Gagal menghapus produk"] },
    };
  }

  return { status: "success", errors: {} };
}

type GetProductsParams = {
  currentPage: number;
  currentLimit: number;
  currentSearch: string;
};

type GetProductsReturn = {
  data: ProductQueryResult[];
  count: number;
  error: string | null;
};

export async function getProductsForUser({
  currentPage,
  currentLimit,
  currentSearch,
}: GetProductsParams): Promise<GetProductsReturn> {
  const supabase = await createClient();

  // Get authenticated user's store
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { data: [], count: 0, error: "User tidak ditemukan" };
  }

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_user_id", userData.user.id)
    .single();

  if (!store) {
    return { data: [], count: 0, error: "Toko tidak ditemukan" };
  }

  // Build query
  let query = supabase
    .from("products")
    .select(
      `
      id,
      title,
      price,
      description,  
      created_at,
      product_categories ( category_id ),
      product_media ( media_path, media_type )
    `,
      { count: "exact" }
    )
    .eq("store_id", store.id)
    .order("created_at", { ascending: false });

  // Add search filter
  if (currentSearch) {
    query = query.ilike("title", `%${currentSearch}%`);
  }

  // Add pagination
  const from = (currentPage - 1) * currentLimit;
  const to = currentPage * currentLimit - 1;
  query = query.range(from, to);

  // Execute query
  const { data, error, count } = await query;

  if (error) {
    console.error("Gagal memuat produk:", error.message);
    return { data: [], count: 0, error: error.message };
  }

  return {
    data: (data || []) as ProductQueryResult[],
    count: count || 0,
    error: null,
  };
}

// ==================== GET CATEGORIES ====================
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (error) {
    console.error("Gagal mengambil kategori:", error.message);
    return [];
  }

  return data || [];
}