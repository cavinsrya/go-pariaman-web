"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type FeaturedStore = {
  id: number;
  name: string;
  slug: string; 
  logo_url: string | null;
  description: string | null;
};

type FeaturedProduct = {
  id: number;
  title: string;
  price: number;
  slug: string;
  store: {
    name: string;
    slug: string;
    sub_district: { name: string | null } | null;
    village: { name: string | null } | null;
  } | null;
  product_media: { media_path: string, media_type: "image" | "video" }[];
};

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
          } catch {}
        },
      },
    }
  );
}

export async function getFeaturedStores(): Promise<FeaturedStore[]> {
  const supabase = await makeSupabase();
  const { data, error } = await supabase
    .from("stores")
    .select(
      "id, name, slug, logo_url, description, users:owner_user_id(name, avatar_url)"
    ) 
    .eq("is_published", true) 
    .order("created_at", { ascending: false }) 
    .limit(8); 

  if (error) {
    console.error("Error fetching featured stores:", error);
    return [];
  }
  return data || [];
}


export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const supabase = await makeSupabase();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id, title, price, slug,
      store:stores!products_store_id_fkey (
        name, slug,
        sub_district:sub_districts!stores_sub_district_id_fkey ( name ),
        village:villages!stores_village_id_fkey ( name )
      ),
      product_media ( media_path, media_type )
    `
    )
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<FeaturedProduct[]>();

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
  return data ?? [];
}
