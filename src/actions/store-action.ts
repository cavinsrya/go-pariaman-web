"use server";

import { createClient } from "@/lib/supabase/server";

export async function getStoreProfileData() {
  const supabase = await createClient(); 

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("id, name, avatar_url, role")
    .eq("id", user.id)
    .single();

  if (!userData) return null; 

  const { data: storeData } = await supabase
    .from("stores")
    .select("*")
    .eq("owner_user_id", user.id)
    .single();

  if (!storeData) return null; 

  const { data: socialLinks } = await supabase
    .from("store_social_links")
    .select("*")
    .eq("store_id", storeData.id);

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
