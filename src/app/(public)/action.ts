// Di file action.ts Anda
"use server";

import { createClient } from "@/lib/supabase/server"; // Gunakan server client
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Tipe data sederhana untuk hasil query (sebaiknya definisikan lebih detail di .d.ts)
export type FeaturedStore = {
  id: number;
  name: string;
  slug: string; // Tambahkan slug untuk link
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
  product_media: { media_path: string }[];
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
/**
 * Mengambil data UMKM unggulan (misal 8 terbaru)
 */
export async function getFeaturedStores(): Promise<FeaturedStore[]> {
  const supabase = await makeSupabase();
  const { data, error } = await supabase
    .from("stores")
    .select(
      "id, name, slug, logo_url, description, users:owner_user_id(name, avatar_url)"
    ) // Ambil kolom yang dibutuhkan
    .eq("is_published", true) // Hanya yang sudah publish
    .order("created_at", { ascending: false }) // Urutkan (misal terbaru)
    .limit(8); // Batasi jumlah

  if (error) {
    console.error("Error fetching featured stores:", error);
    return [];
  }
  return data || [];
}

/**
 * Mengambil data Produk unggulan (misal 10 terbaru)
 */
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
      product_media ( media_path )
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
