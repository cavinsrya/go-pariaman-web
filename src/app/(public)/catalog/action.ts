"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function makeSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            console.error("Error setting cookies:", error);
          }
        },
      },
    }
  );
}


export async function getCatalogFilters() {
  const supabase = await makeSupabase();

  try {
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (catError) {
      console.error("Error fetching categories:", catError);
    }

    const { data: subDistricts, error: sdError } = await supabase
      .from("sub_districts")
      .select("id, name")
      .order("name");

    if (sdError) {
      console.error("Error fetching sub_districts:", sdError);
    }

    return {
      categories: categories || [],
      subDistricts: subDistricts || [],
    };
  } catch (error) {
    console.error("Unexpected error fetching filters:", error);
    return {
      categories: [],
      subDistricts: [],
    };
  }
}

export async function getVillagesBySubDistrict(subDistrictId: number) {
  const supabase = await makeSupabase();

  try {
    const { data: villages, error } = await supabase
      .from("villages")
      .select("id, name")
      .eq("sub_district_id", subDistrictId)
      .order("name");

    if (error) {
      console.error("Error fetching villages:", error);
      return [];
    }

    return villages || [];
  } catch (error) {
    console.error("Unexpected error fetching villages:", error);
    return [];
  }
}

export type CatalogProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  slug: string;
  store_id: number;
  stores: {
    id: number;
    name: string;
    slug: string;
    sub_district_id: number;
    village_id: number | null;
    sub_districts: { name: string } | null;
    villages: { name: string } | null;
  } | null;
  product_media: { media_path: string; media_type: "image" | "video" }[];
  product_categories: { category_id: number }[];
};

export type GetCatalogProductsResult = {
  products: CatalogProduct[];
  total: number;
};

export async function getCatalogProducts({
  search = "",
  categoryIds = [],
  subDistrictId,
  villageId,
  priceSort = "asc",
  page = 1,
  limit = 10,
}: {
  search?: string;
  categoryIds?: number[];
  subDistrictId?: number;
  villageId?: number;
  priceSort?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<GetCatalogProductsResult> {
  const supabase = await makeSupabase();

  try {
    let storeIds: number[] | null = null;
    if (subDistrictId !== undefined || villageId !== undefined) {
      let storeQuery = supabase.from("stores").select("id");

      if (subDistrictId !== undefined && subDistrictId !== null) {
        storeQuery = storeQuery.eq("sub_district_id", subDistrictId);
      }
      if (villageId !== undefined && villageId !== null) {
        storeQuery = storeQuery.eq("village_id", villageId);
      }

      const { data: matchStores, error: storeError } = await storeQuery;

      if (storeError) {
        console.error("Error filtering stores by location:", storeError);
        return { products: [], total: 0 };
      }

      if (!matchStores || matchStores.length === 0) {
        return { products: [], total: 0 };
      }

      storeIds = matchStores.map((store) => store.id);
    }

    let productIdsByCategory: number[] | null = null;
    if (categoryIds.length > 0) {
      const { data: productCategories, error: categoryError } = await supabase
        .from("product_categories")
        .select("product_id")
        .in("category_id", categoryIds);

      if (categoryError) {
        console.error("Error filtering by categories:", categoryError);
        return { products: [], total: 0 };
      }

      if (!productCategories || productCategories.length === 0) {
        return { products: [], total: 0 };
      }

      productIdsByCategory = productCategories.map((pc) => pc.product_id);
    }

    let query = supabase
      .from("products")
      .select(
        `
          id,
          title,
          price,
          description,
          slug,
          store_id,
          stores:stores!products_store_id_fkey (
            id,
            name,
            slug,
            sub_district_id,
            village_id,
            sub_districts:sub_districts!stores_sub_district_id_fkey ( name ),
            villages:villages!stores_village_id_fkey ( name )
          ),
          product_media ( media_path, media_type ),
          product_categories ( category_id )
        `,
        { count: "exact" }
      )
      .eq("is_published", true);

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
    if (storeIds) {
      query = query.in("store_id", storeIds);
    }
    if (productIdsByCategory) {
      query = query.in("id", productIdsByCategory);
    }

    const offset = (page - 1) * limit;

    const { data, error, count } = await query
      .order("price", { ascending: priceSort === "asc" })
      .range(offset, offset + limit - 1)
      .returns<CatalogProduct[]>();

    if (error) {
      console.error("Error fetching catalog products:", error);
      return { products: [], total: 0 };
    }

    return {
      products: data ?? [],
      total: count ?? 0,
    };
  } catch (error) {
    console.error("Unexpected error in getCatalogProducts:", error);
    return { products: [], total: 0 };
  }
}

export async function getProductDetail(slug: string) {
  console.log("Fetching product detail for slug:", slug);
  const supabase = await makeSupabase();

  try {
    const { data: product, error } = await supabase
      .from("products")
      .select(
        `
        id,
        title,
        price,
        description,
        slug,
        store_id,
        stores(
          id,
          name,
          slug,
          logo_url,
          owner_user_id,
          sub_district_id,
          village_id,
          sub_districts ( name ),
          villages ( name ),
          users(
            name,
            avatar_url
          ),
          store_social_links (
            platform,
            url
          )
        ),
        product_media ( media_path, media_type, sort_order ),
        product_categories ( 
          categories( id, name )
        )
      `
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      console.error("Error fetching product detail:", error);
      return null;
    }

    console.log("Product detail fetched successfully");
    return product;
  } catch (error) {
    console.error("Unexpected error fetching product detail:", error);
    return null;
  }
}

export async function getRelatedProducts(
  storeId: number,
  currentProductId: number,
  limit = 5
) {
  const supabase = await makeSupabase();

  try {
    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        id,
        title,
        price,
        slug,
        stores:stores!products_store_id_fkey (
          name,
          slug
        ),
        product_media ( media_path, media_type )
      `
      )
      .eq("store_id", storeId)
      .eq("is_published", true)
      .neq("id", currentProductId)
      .limit(limit);

    if (error) {
      console.error("Error fetching related products:", error);
      return [];
    }

    return products || [];
  } catch (error) {
    console.error("Unexpected error fetching related products:", error);
    return [];
  }
}

export async function getProductReviews(productId: number) {
  const supabase = await makeSupabase();

  try {
    const { data: reviews, error } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return reviews || [];
  } catch (error) {
    console.error("Unexpected error fetching reviews:", error);
    return [];
  }
}

export async function submitProductReview(
  productId: number,
  reviewerName: string,
  jobTitle: string,
  title: string,
  body: string,
  rating: number
) {
  const supabase = await makeSupabase();

  try {
    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      reviewer_name: reviewerName,
      job_title: jobTitle,
      title: title,
      body: body,
      rating: rating,
      is_published: true,
    });

    if (error) {
      console.error("Error submitting review:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error submitting review:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function incrementProductView(productId: number) {
  const supabase = await makeSupabase();

  try {
    const { error } = await supabase.rpc("increment_product_view", {
      product_id_to_increment: productId,
    });

    if (error) {
      console.error("Error incrementing view:", error);
    }
  } catch (error) {
    console.error("Unexpected error incrementing view:", error);
  }
}
