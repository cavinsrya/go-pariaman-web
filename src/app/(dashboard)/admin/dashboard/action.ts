"use server";

import { createClient } from "@/lib/supabase/server";

export type StoreTableRow = {
  id: number;
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  logo_url: string | null;
  slug?: string | null;
  cover_url: string | null;
  owner_user_id?: string;
  sub_district_id?: number | null;
  village_id?: number | null;

  users?: { name: string; avatar_url: string | null } | null;
  sub_districts?: { name: string } | null;
  villages?: { name: string } | null;
  store_social_links?: Array<{
    platform: string;
    url: string;
  }>;
};

export type StoresDataResult = {
  data: StoreTableRow[];
  count: number | null;
};

export async function getStoresData(
  subDistrictId?: number,
  villageId?: number,
  search?: string,
  limit = 10,
  offset = 0
): Promise<StoresDataResult> {
  const supabase = await createClient();

  let query = supabase
    .from("stores")
    .select(
      `
      id, name, phone, address,logo_url,
      cover_url, owner_user_id,
      sub_district_id, village_id, slug, 
      users:owner_user_id(name, avatar_url),
      sub_districts:sub_district_id(name),
      villages:village_id(name)
    `,
      { count: "exact" }
    )
    .eq("is_published", true);

  if (subDistrictId) query = query.eq("sub_district_id", subDistrictId);
  if (villageId) query = query.eq("village_id", villageId);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false })
    .returns<StoreTableRow[]>(); // 

  if (error) {
    console.error("Error fetching stores data:", error);
    return { data: [], count: 0 }; 
  }

  return { data: data || [], count: count || 0 };
}

export async function getStoreDetail(storeId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stores")
    .select(
      `
      id,
      name,
      description,
      phone,
      address,
      logo_url,
      cover_url,
      owner_user_id,
      sub_district_id,
      village_id,
      users:owner_user_id(name, avatar_url),
      sub_districts:sub_district_id(name),
      villages:village_id(name),
      store_social_links(platform, url)
    `
    )
    .eq("id", storeId)
    .single();

  if (error || !data) {
    return { data: null as StoreTableRow | null, error };
  }

  const normalized: StoreTableRow = {
    ...data,
    users: Array.isArray(data.users)
      ? data.users[0] ?? null
      : data.users ?? null,
    sub_districts: Array.isArray(data.sub_districts)
      ? data.sub_districts[0] ?? null
      : data.sub_districts ?? null,
    villages: Array.isArray(data.villages)
      ? data.villages[0] ?? null
      : data.villages ?? null,
    store_social_links: data.store_social_links ?? [],
  };

  return { data: normalized, error: null };
}

export async function getSubDistrictsWithCount() {
  const supabase = await createClient();

  const result = await supabase
    .from("sub_districts")
    .select(
      `
      id,
      name,
      stores(id)
    `
    )
    .eq("district_id", 1);

  return result;
}

export async function getVillagesBySubDistrict(subDistrictId: number) {
  const supabase = await createClient();

  const result = await supabase
    .from("villages")
    .select("id, name")
    .eq("sub_district_id", subDistrictId);

  return result;
}

export async function getTotalStores() {
  const supabase = await createClient();

  const result = await supabase
    .from("stores")
    .select("id", { count: "exact" })
    .eq("is_published", true);

  return result.count || 0;
}
function returns<T>() {
  throw new Error("Function not implemented.");
}
