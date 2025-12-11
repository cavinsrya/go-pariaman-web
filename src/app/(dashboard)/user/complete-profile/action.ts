"use server";

import { uploadFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { CompleteProfileFormState } from "@/types/auth";
import { updateStoreProfileSchema } from "@/validations/auth.validation";

export async function updateStoreProfile(
  prevState: CompleteProfileFormState,
  formData: FormData
): Promise<CompleteProfileFormState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      errors: {
        _form: ["User tidak terautentikasi"],
      },
    };
  }

  const socialLinksData: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("social_links.") && typeof value === "string") {
      const platform = key.replace("social_links.", "");
      const url = value.trim();

      if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
        socialLinksData[platform] = url;
      }
    }
  }

  const getFileOrNull = (key: string) => {
    const value = formData.getAll(key).at(-1);
    if (value instanceof File && value.size > 0) {
      return value;
    }
    if (typeof value === "string" && value.trim() !== "") {
      return value; 
    }
    return null; 
  };

  const validatedFields = updateStoreProfileSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    district_id: formData.get("district_id"),
    sub_district_id: formData.get("sub_district_id"),
    village_id: formData.get("village_id"),
    avatar_url: getFileOrNull("avatar_url"),
    logo_url: getFileOrNull("logo_url"),
    cover_url: getFileOrNull("cover_url"),
    social_links: socialLinksData,
  });

  if (!validatedFields.success) {
    console.error("❌ Validation errors:", validatedFields.error.flatten());
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: ["Periksa kembali isian form Anda"],
      },
    };
  }

  console.log("✅ Validation passed:", {
    hasAvatar: !!validatedFields.data.avatar_url,
    hasLogo: !!validatedFields.data.logo_url,
    hasCover: !!validatedFields.data.cover_url,
  });

  let avatarUrl: string | null = null;
  if (validatedFields.data.avatar_url instanceof File) {
    const oldAvatarPath = formData.get("old_avatar_path") as string | null;
    const { errors, data } = await uploadFile(
      "images",
      "avatars",
      validatedFields.data.avatar_url,
      oldAvatarPath ? oldAvatarPath.split("/images/")[1] : undefined
    );

    if (errors) {
      console.error("❌ Avatar upload failed:", errors);
      return {
        status: "error",
        errors: { _form: ["Gagal mengunggah foto profil"] },
      };
    }

    avatarUrl = data.url;
    console.log("✅ Avatar uploaded:", avatarUrl);
  } else if (typeof validatedFields.data.avatar_url === "string") {
    avatarUrl = validatedFields.data.avatar_url; // Keep existing URL
  }

  let logoUrl: string | null = null;
  if (validatedFields.data.logo_url instanceof File) {
    const oldLogoPath = formData.get("old_logo_path") as string | null;
    const { errors, data } = await uploadFile(
      "images",
      "stores/logos",
      validatedFields.data.logo_url,
      oldLogoPath ? oldLogoPath.split("/images/")[1] : undefined
    );

    if (errors) {
      console.error("❌ Logo upload failed:", errors);
      return {
        status: "error",
        errors: { _form: ["Gagal mengunggah logo toko"] },
      };
    }

    logoUrl = data.url;
    console.log("✅ Logo uploaded:", logoUrl);
  } else if (typeof validatedFields.data.logo_url === "string") {
    logoUrl = validatedFields.data.logo_url; 
  }

  let coverUrl: string | null = null;
  if (validatedFields.data.cover_url instanceof File) {
    const oldCoverPath = formData.get("old_cover_path") as string | null;
    const { errors, data } = await uploadFile(
      "images",
      "stores/covers",
      validatedFields.data.cover_url,
      oldCoverPath ? oldCoverPath.split("/images/")[1] : undefined
    );

    if (errors) {
      console.error("❌ Cover upload failed:", errors);
      return {
        status: "error",
        errors: { _form: ["Gagal mengunggah cover toko"] },
      };
    }

    coverUrl = data.url;
    console.log("✅ Cover uploaded:", coverUrl);
  } else if (typeof validatedFields.data.cover_url === "string") {
    coverUrl = validatedFields.data.cover_url; 
  }

  const { data: storeData, error: storeError } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_user_id", user.id)
    .single();

  if (storeError || !storeData) {
    console.error("❌ Store not found:", storeError);
    return {
      status: "error",
      errors: { _form: ["Toko tidak ditemukan"] },
    };
  }

  const storeUpdateData: Record<string, any> = {
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    address: validatedFields.data.address,
    phone: validatedFields.data.phone,
    district_id: Number.parseInt(validatedFields.data.district_id, 10),
    sub_district_id: Number.parseInt(validatedFields.data.sub_district_id, 10),
    village_id: Number.parseInt(validatedFields.data.village_id, 10),
  };

  if (logoUrl !== null) {
    storeUpdateData.logo_url = logoUrl;
  }
  if (coverUrl !== null) {
    storeUpdateData.cover_url = coverUrl;
  }

  console.log("📝 Updating store with:", {
    ...storeUpdateData,
    logo_url: storeUpdateData.logo_url ? "✅ has value" : "⏭️ skip",
    cover_url: storeUpdateData.cover_url ? "✅ has value" : "⏭️ skip",
  });

  const { error: updateStoreError } = await supabase
    .from("stores")
    .update(storeUpdateData)
    .eq("id", storeData.id);

  if (updateStoreError) {
    console.error("❌ Store update failed:", updateStoreError);
    return {
      status: "error",
      errors: {
        _form: ["Gagal memperbarui toko: " + updateStoreError.message],
      },
    };
  }

  console.log("✅ Store updated successfully");

  if (avatarUrl !== null) {
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({ avatar_url: avatarUrl })
      .eq("id", user.id);

    if (userUpdateError) {
      console.error("❌ User avatar update failed:", userUpdateError);
      return {
        status: "error",
        errors: { _form: ["Gagal memperbarui foto profil"] },
      };
    }

    console.log("✅ User avatar updated");
  }

  await supabase
    .from("store_social_links")
    .delete()
    .eq("store_id", storeData.id);

  if (Object.keys(socialLinksData).length > 0) {
    const socialLinksToInsert = Object.entries(socialLinksData).map(
      ([platform, url]) => ({
        store_id: storeData.id,
        platform,
        url,
        is_enabled: true,
      })
    );

    const { error: socialError } = await supabase
      .from("store_social_links")
      .insert(socialLinksToInsert);

    if (socialError) {
      console.error("❌ Social links update failed:", socialError);
      return {
        status: "error",
        errors: { _form: ["Gagal memperbarui media sosial"] },
      };
    }

    console.log("✅ Social links updated");
  }

  console.log("🎉 Profile update completed successfully");
  return {
    status: "success",
    errors: {},
  };
}
