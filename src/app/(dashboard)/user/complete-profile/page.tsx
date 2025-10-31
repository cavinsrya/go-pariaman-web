// Di page.tsx (halaman server yang memuat form)

import { getStoreProfileData } from "@/actions/store-action"; // Ganti ke fungsi baru
import { getDistricts } from "@/actions/store-action";
import StoreProfileForm from "./_components/complete-profile";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
  const profileData = await getStoreProfileData(); // Panggil fungsi baru
  const districts = await getDistricts();

  if (!profileData) {
    // Ini terjadi jika user tidak login atau data tidak ditemukan
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      {/* Pass datanya secara terpisah:
        - userData={profileData.user}
        - storeData={profileData.store}
        - socialLinks={profileData.socialLinks}
      */}
      <StoreProfileForm
        userData={profileData.user}
        storeData={profileData.store}
        socialLinks={profileData.socialLinks}
        districts={districts}
      />
    </div>
  );
}
