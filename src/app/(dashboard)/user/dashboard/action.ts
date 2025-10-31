"use server";

import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../../../../database.types";
// Helper untuk mendapatkan store_id milik user
async function getUserStoreId(supabase: SupabaseClient<Database>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_user_id", user.id)
    .single();

  return store?.id || null;
}

/**
 * Mengambil daftar produk milik user untuk mengisi dropdown
 */
type ProductDropdownItem = { id: number; title: string };
export async function getUserProductsForDropdown(): Promise<
  ProductDropdownItem[]
> {
  const supabase = await createClient();
  const storeId = await getUserStoreId(supabase);

  if (!storeId) return [];

  const { data: products, error } = await supabase
    .from("products")
    .select("id, title")
    .eq("store_id", storeId)
    .order("title");

  if (error) {
    console.error("Error fetching user products:", error);
    return [];
  }
  return products || [];
}

/**
 * Tipe data untuk hasil analitik
 */
export type AnalyticsDataPoint = {
  date: string;
  product_title: string;
  views: number;
};

export type TimeRange = "7d" | "30d" | "12m" | "all";

/**
 * Mengambil data analitik untuk grafik
 */

type RpcAnalyticsResult = {
  view_date: string;
  product_title: string | null;
  count: number | string;
};
export async function getProductViewAnalytics(params: {
  productId: "all" | number;
  timeRange: TimeRange;
}): Promise<AnalyticsDataPoint[]> {
  const { productId, timeRange } = params;
  const supabase = await createClient();
  const storeId = await getUserStoreId(supabase);

  if (!storeId) return [];

  // --- Logika untuk menerjemahkan filter
  let groupBy: "day" | "month" | "year";
  let startDate: string | null = null;
  const now = new Date();
  switch (timeRange) {
    case "7d":
      groupBy = "day";
      startDate = new Date(now.setDate(now.getDate() - 7)).toISOString();
      break;
    case "30d":
      groupBy = "day";
      startDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
      break;
    case "12m":
      groupBy = "month";
      startDate = new Date(now.setMonth(now.getMonth() - 12)).toISOString();
      break;
    default:
      groupBy = "year";
      startDate = null;
      break;
  }

  // Panggil RPC
  const { data, error } = await supabase
    .rpc("get_product_views_analytics", {
      p_store_id: storeId,
      p_product_id: productId === "all" ? null : productId,
      p_group_by: groupBy,
      p_start_date: startDate,
    })
    .returns<RpcAnalyticsResult[]>();

  if (error) {
    console.error("Error fetching analytics from RPC:", error);
    return [];
  }

  if (!Array.isArray(data)) {
    console.error(
      "RPC call succeeded but did not return an array. Data received:",
      data
    );
    return [];
  }

  if (!data) return [];

  // --- Format data dengan product_title
  return data.map((row: RpcAnalyticsResult) => ({
    date: new Date(row.view_date).toLocaleDateString("en-CA"),
    product_title: row.product_title || "Unknown",
    views: Number(row.count) || 0,
  }));
}
