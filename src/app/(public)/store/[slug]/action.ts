"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type StoreSocialLink = { platform: string; url: string };
export type StoreUser = { name: string; avatar_url: string | null };
export type StoreLocation = { name: string } | null;

export type ProductForStore = {
  id: number;
  title: string;
  price: number;
  slug: string;
  total_views?: number;
  product_media: { media_path: string, media_type: "image" | "video" }[];
};

export type ReviewForStore = {
  id: number;
  reviewer_name: string;
  job_title: string | null;
  title: string | null;
  body: string | null;
  rating: number;
  created_at: string;
};

export type StoreDataResult = {
  store: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    phone: string | null;
    logo_url: string | null;
    cover_url: string | null;
    address: string | null;
    total_views?: number;
    users: StoreUser | null;
    districts: StoreLocation;
    sub_districts: StoreLocation;
    villages: StoreLocation;
    store_social_links: StoreSocialLink[];
  };
  products: ProductForStore[];
  reviews: ReviewForStore[];
} | null;

// Bentuk mentah hasil SELECT (social links masih punya is_enabled)
type RawStoreRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  logo_url: string | null;
  cover_url: string | null;
  address: string | null;
  total_views?: number;
  users: StoreUser | null;
  districts: StoreLocation;
  sub_districts: StoreLocation;
  villages: StoreLocation;
  store_social_links:
    | { platform: string; url: string; is_enabled: boolean }[]
    | null;
};

export async function getStoreData(slug: string): Promise<StoreDataResult> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // ✅ KUNCI: ketik di single<RawStoreRow>() (atau gunakan .returns<RawStoreRow[]>().single())
  const { data: store, error: storeError } = await supabase
    .from("stores")
    .select(
      `
      *,
      users!stores_owner_user_id_fkey ( name, avatar_url ),
      districts ( name ),
      sub_districts ( name ),
      villages ( name ),
      store_social_links ( platform, url, is_enabled )
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single<RawStoreRow>();

  if (storeError || !store) {
    console.error("Error fetching store data:", storeError);
    return null;
  }

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, title, price, slug, product_media(media_path, media_type)")
    .eq("store_id", store.id) // ✅ sekarang store.id sudah terketik
    .eq("is_published", true)
    .returns<ProductForStore[]>();

  if (productsError) {
    console.error("Error fetching store products:", productsError);
  }

  const productIds = (products ?? []).map((p) => p.id);

  const { data: reviews, error: reviewsError } = await supabase
    .from("product_reviews")
    .select("id, reviewer_name, job_title, title, body, rating, created_at")
    .eq("is_published", true)
    .in("product_id", productIds.length ? productIds : [-1])
    .returns<ReviewForStore[]>();

  if (reviewsError) {
    console.error("Error fetching store reviews:", reviewsError);
  }

  // ✅ Narrow & hilangkan implicit any saat destructuring
  const enabledSocialLinks: StoreSocialLink[] = (store.store_social_links ?? [])
    .filter(
      (l): l is { platform: string; url: string; is_enabled: boolean } =>
        Boolean(l) && l.is_enabled === true
    )
    .map(({ platform, url }: { platform: string; url: string }) => ({
      platform,
      url,
    }));

  // ✅ Spread aman: 'store' sudah bertipe RawStoreRow (bukan union error)
  return {
    store: { ...store, store_social_links: enabledSocialLinks },
    products: products ?? [],
    reviews: reviews ?? [],
  };
}
