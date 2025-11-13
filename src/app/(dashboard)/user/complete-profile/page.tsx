import { getStoreProfileData } from "@/actions/store-action";
import { getDistricts } from "@/actions/store-action";
import StoreProfileForm from "./_components/complete-profile";
import { redirect } from "next/navigation";

export default async function CompleteProfilePage() {
  const profileData = await getStoreProfileData();
  const districts = await getDistricts();

  if (!profileData) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <StoreProfileForm
        userData={profileData.user}
        storeData={profileData.store}
        socialLinks={profileData.socialLinks}
        districts={districts}
      />
    </div>
  );
}
