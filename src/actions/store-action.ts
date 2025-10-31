"use server";

import { createClient } from "@/lib/supabase/server";

// export async function getStoreProfile() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//     error: userError,
//   } = await supabase.auth.getUser();

//   if (userError || !user) {
//     return null;
//   }

//   const { data: store, error: storeError } = await supabase
//     .from("stores")
//     .select("*")
//     .eq("owner_user_id", user.id)
//     .single();

//   if (storeError || !store) {
//     return null;
//   }

//   const { data: socialLinks, error: socialError } = await supabase
//     .from("store_social_links")
//     .select("*")
//     .eq("store_id", store.id);

//   if (socialError) {
//     return null;
//   }

//   return {
//     store,
//     socialLinks: socialLinks || [],
//   };
// }

export async function getStoreProfileData() {
  const supabase = await createClient(); // Asumsi ini client server Anda

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Ambil data user dari public.users
  const { data: userData } = await supabase
    .from("users")
    .select("id, name, avatar_url, role")
    .eq("id", user.id)
    .single();

  if (!userData) return null; // Tidak ada profil user

  // 2. Ambil data toko dari public.stores
  const { data: storeData } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_user_id", user.id)
    .single();

  if (!storeData) return null; // Tidak ada toko (meski seharusnya ada by trigger)

  // 3. Ambil data social links
  const { data: socialLinks } = await supabase
    .from("store_social_links")
    .select("*")
    .eq("store_id", storeData.id);

  // 4. Kembalikan semua data sebagai satu objek
  return {
    user: userData,
    store: storeData,
    socialLinks: socialLinks || [],
  };
}

export async function getDistricts() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("districts")
    .select("id, name")
    .order("name");

  if (error) {
    return [];
  }

  return data || [];
}

export async function getSubDistricts(districtId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sub_districts")
    .select("id, name")
    .eq("district_id", districtId)
    .order("name");

  if (error) {
    return [];
  }

  return data || [];
}

export async function getVillages(subDistrictId: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("villages")
    .select("id, name")
    .eq("sub_district_id", subDistrictId)
    .order("name");

  if (error) {
    console.error("Error fetching villages:", error.message);
    return [];
  }

  return data || [];
}
