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
    category_ids: category_ids,
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

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["User not authenticated"],
      },
    };
  }

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_user_id", userData.user.id)
    .single();

  if (!store) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Store not found"],
      },
    };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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

  if (productError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [productError.message],
      },
    };
  }

  const relationsToInsert = validatedFields.data.category_ids.map((catId) => ({
    product_id: product.id,
    category_id: Number.parseInt(catId),
  }));

  const { error: categoryError } = await supabase
    .from("product_categories")
    .insert(relationsToInsert);

  if (categoryError) {
    await supabase.from("products").delete().eq("id", product.id);
    return { status: "error", errors: { _form: [categoryError.message] } };
  }

  for (let i = 0; i < mediaFiles.length; i++) {
    const file = mediaFiles[i];
    const { errors, data } = await uploadFile(
      "images",
      `products/${product.id}`,
      file
    );

    if (errors) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: [errors._form?.[0] ?? "Failed to upload media"],
        },
      };
    }

    const mediaType = file.type.startsWith("video/") ? "video" : "image";

    await supabase.from("product_media").insert({
      product_id: product.id,
      media_path: data.url, 
      media_type: mediaType,
      sort_order: i,
    });
  }

  return {
    status: "success",
    errors: {},
  };
}

export async function updateProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const productId = formData.get("id") as string;
  if (!productId) {
    return {
      status: "error",
      errors: { _form: ["Product ID tidak ditemukan"] },
    };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const category_ids = formData.getAll("category_ids") as string[];
  const newMediaFiles = formData.getAll("media") as File[];
  const deletedMediaPaths = formData.getAll("deleted_media_paths") as string[];
  const validatedFields = updateProductSchema.safeParse({
    title,
    description,
    price,
    category_ids: category_ids,
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
      errors: { _form: [updateError.message], ...prevState.errors },
    };
  }

  const { error: deleteCatError } = await supabase
    .from("product_categories")
    .delete()
    .eq("product_id", productId);

  if (deleteCatError) {
      return { status: "error", errors: { _form: ["Gagal menghapus kategori lama"] } };
  }

  const relationsToInsert = validatedFields.data.category_ids.map((catId) => ({
    product_id: Number.parseInt(productId),
    category_id: Number.parseInt(catId),
  }));

  const { error: insertCatError } = await supabase
    .from("product_categories")
    .insert(relationsToInsert);

  if (insertCatError) {
    return { status: "error", errors: { _form: [insertCatError.message] } };
  }

  if (deletedMediaPaths.length > 0) {
    for (const mediaPath of deletedMediaPaths) {
      await deleteFile("images", mediaPath); 
      await supabase.from("product_media").delete().eq("media_path", mediaPath);
    }
  }

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
        const validation = validateMediaFile(file);
        if (!validation.valid) {
            return { status: "error", errors: { _form: [validation.error || "File media baru tidak valid"] } };
        }

      const { errors, data } = await uploadFile(
        "images",
        `products/${productId}`,
        file
      );

      if (errors) {
        return {
          status: "error",
          errors: {
            ...prevState.errors,
            _form: [errors._form?.[0] ?? "Gagal mengunggah media baru"],
          },
        };
      }

      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      
      await supabase.from("product_media").insert({
        product_id: Number(productId),
        media_path: data.url,
        media_type: mediaType,
        sort_order: currentSortOrder,
      });

      currentSortOrder++;
    }
  }

  return {
    status: "success",
    errors: {},
  };
}

export async function deleteProduct(
  prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const productIdString = formData.get("id") as string;
  const mediaPaths = formData.getAll("media_paths") as string[];

  if (
    !productIdString ||
    productIdString === "null" ||
    productIdString.trim() === ""
  ) {
    return {
      status: "error",
      errors: { _form: ["Product ID tidak valid atau hilang"] },
    };
  }

  const productId = parseInt(productIdString, 10);
  if (isNaN(productId)) {
    return {
      status: "error",
      errors: { _form: ["Product ID harus berupa angka"] },
    };
  }

  const supabase = await createClient();
  if (mediaPaths && mediaPaths.length > 0) {
    for (const path of mediaPaths) {
        await deleteFile("images", path); 
    }
  }

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
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

  if (currentSearch) {
    query = query.ilike("title", `%${currentSearch}%`);
  }

  const from = (currentPage - 1) * currentLimit;
  const to = currentPage * currentLimit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Gagal memuat produk di server:", error.message);
    return { data: [], count: 0, error: error.message };
  }

  return {
    data: (data as ProductQueryResult[]) || [], 
    count: count || 0,
    error: null,
  };
}

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