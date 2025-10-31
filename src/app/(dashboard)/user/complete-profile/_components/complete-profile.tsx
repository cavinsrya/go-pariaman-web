"use client";

import {
  useActionState,
  useEffect,
  useState,
  startTransition,
  useMemo,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStoreProfile } from "../action";
import {
  type UpdateStoreProfileForm,
  updateStoreProfileSchema,
} from "@/validations/auth.validation";
import FormInput from "@/components/common/dashboard/form-input";
import FormTextarea from "@/components/common/dashboard/form-textarea";
import FormImage from "@/components/common/dashboard/form-image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { INITIAL_STATE_COMPLETE_PROFILE_USER } from "@/constants/social-platform-constant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationData, SocialLink, StoreData, UserData } from "@/types/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StoreLocationSection from "./store-location-section";
import StoreSocialSection from "./store-social-section";
import type { CompleteProfileFormState } from "@/types/auth";

/**
 * ✅ Fixed:
 * - Added isFormReady state to wait for form initialization
 * - Delayed location component render until form is populated
 * - Better synchronization between parent and child
 */

interface StoreProfileFormProps {
  userData: UserData;
  storeData: StoreData;
  districts: LocationData[];
  socialLinks: SocialLink[];
}

export default function StoreProfileForm({
  storeData,
  userData,
  districts,
  socialLinks,
}: StoreProfileFormProps) {
  const form = useForm<UpdateStoreProfileForm>({
    resolver: zodResolver(updateStoreProfileSchema),
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      address: "",
      district_id: "",
      sub_district_id: "",
      village_id: "",
      social_links: {},
    },
  });

  const { setValue, reset } = form;

  const [state, formAction, isPending] = useActionState(
    updateStoreProfile,
    INITIAL_STATE_COMPLETE_PROFILE_USER
  );

  // ✅ NEW: Track form initialization status
  const [isFormReady, setIsFormReady] = useState(false);

  // Image previews
  const [avatarPreview, setAvatarPreview] = useState<Preview | undefined>(
    userData?.avatar_url
      ? { displayUrl: userData.avatar_url, file: undefined }
      : undefined
  );

  const [logoPreview, setLogoPreview] = useState<Preview | undefined>(
    storeData?.logo_url
      ? { displayUrl: storeData.logo_url, file: undefined }
      : undefined
  );

  const [coverPreview, setCoverPreview] = useState<Preview | undefined>(
    storeData?.cover_url
      ? { displayUrl: storeData.cover_url, file: undefined }
      : undefined
  );

  // ✅ Effect 1: Initialize form data
  useEffect(() => {
    if (storeData && userData) {
      console.log("🔄 Initializing form with data:", {
        district_id: storeData.district_id,
        sub_district_id: storeData.sub_district_id,
        village_id: storeData.village_id,
      });

      // Reset form with ALL data
      reset({
        name: storeData.name || "",
        description: storeData.description || "",
        phone: storeData.phone || "",
        address: storeData.address || "",
        logo_url: storeData.logo_url ?? undefined,
        cover_url: storeData.cover_url ?? undefined,
        avatar_url: userData.avatar_url ?? undefined,
        district_id: storeData.district_id?.toString() || "",
        sub_district_id: storeData.sub_district_id?.toString() || "",
        village_id: storeData.village_id?.toString() || "",
        social_links: {},
      });

      // Set social links
      socialLinks.forEach((link) => {
        if (link.platform && link.url) {
          setValue(`social_links.${link.platform}`, link.url);
        }
      });

      // Update image previews
      if (storeData.logo_url) {
        setLogoPreview({ displayUrl: storeData.logo_url, file: undefined });
      }
      if (storeData.cover_url) {
        setCoverPreview({ displayUrl: storeData.cover_url, file: undefined });
      }
      if (userData.avatar_url) {
        setAvatarPreview({ displayUrl: userData.avatar_url, file: undefined });
      }

      console.log("✅ Form initialized successfully");

      // ✅ Wait a bit to ensure form values are set, then mark as ready
      setTimeout(() => {
        console.log("🎉 Form ready - rendering location component");
        setIsFormReady(true);
      }, 100); // Small delay to ensure form state is updated
    }
  }, [storeData, userData, socialLinks, reset, setValue]);

  // ✅ Effect 2: Handle action state (success/error)
  useEffect(() => {
    if (state.status === "success") {
      toast.success("Profil Toko Berhasil Diperbarui!");
    } else if (state.status === "error") {
      const errorMessage =
        state.errors?._form?.[0] ||
        Object.values(state.errors ?? {}).find(
          (arr) => Array.isArray(arr) && arr.length
        )?.[0] ||
        "Periksa kembali isian form Anda.";

      toast.error("Gagal Memperbarui", { description: errorMessage });
    }
  }, [state]);

  // ✅ Memoized submit handler
  const onSubmit = useCallback(
    form.handleSubmit((data) => {
      const formData = new FormData();

      // Append basic fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "social_links" || key === "avatar_url") return;
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append files
      if (avatarPreview?.file) {
        formData.set("avatar_url", avatarPreview.file);
        if (userData?.avatar_url) {
          formData.append("old_avatar_path", userData.avatar_url);
        }
      }

      if (logoPreview?.file) {
        formData.append("logo_url", logoPreview.file);
        if (storeData?.logo_url) {
          formData.append("old_logo_path", storeData.logo_url);
        }
      }

      if (coverPreview?.file) {
        formData.append("cover_url", coverPreview.file);
        if (storeData?.cover_url) {
          formData.append("old_cover_path", storeData.cover_url);
        }
      }

      // Append social links
      const socialLinksFromForm = data.social_links ?? {};
      Object.entries(socialLinksFromForm).forEach(([platform, url]) => {
        const cleanUrl = String(url ?? "").trim();
        if (cleanUrl) {
          formData.set(`social_links.${platform}`, cleanUrl);
        }
      });

      startTransition(() => {
        formAction(formData);
      });
    }),
    [
      form,
      avatarPreview,
      logoPreview,
      coverPreview,
      userData?.avatar_url,
      storeData?.logo_url,
      storeData?.cover_url,
      formAction,
    ]
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Logo & Cover Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Logo & Foto Sampul</CardTitle>
          <CardDescription>
            Tampilkan identitas toko yang profesional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormImage
              form={form}
              name="avatar_url"
              label="Foto Profil Pemilik"
              preview={avatarPreview}
              setPreview={setAvatarPreview}
              type="profile"
            />
            <FormImage
              form={form}
              name="logo_url"
              label="Upload Logo Toko"
              preview={logoPreview}
              setPreview={setLogoPreview}
              type="profile"
            />
            <div className="md:col-span-2">
              <FormImage
                form={form}
                name="cover_url"
                label="Upload Cover Toko"
                preview={coverPreview}
                setPreview={setCoverPreview}
                type="cover"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Info Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Informasi Toko</CardTitle>
          <CardDescription>Masukkan informasi toko yang sesuai</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={userData?.name || ""}
                disabled
                className="bg-muted/50"
              />
            </div>
            <FormInput
              form={form}
              name="name"
              label="Nama Toko"
              placeholder="Masukkan nama toko"
            />
            <FormInput
              form={form}
              name="phone"
              label="No Handphone"
              placeholder="Masukkan no handphone"
            />
          </div>
          <FormTextarea
            form={form}
            name="description"
            label="Deskripsi Toko"
            placeholder="Jelaskan tentang toko Anda"
            rows={5}
          />
        </CardContent>
      </Card>

      {/* Location & Social Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lokasi & Media Sosial</CardTitle>
          <CardDescription>
            Bantu pembeli menemukan toko dan menghubungi Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Location Section - Wait until form is ready */}
            {isFormReady && storeData ? (
              <StoreLocationSection
                form={form}
                initialDistrictId={storeData.district_id}
                initialSubDistrictId={storeData.sub_district_id}
                initialVillageId={storeData.village_id}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center h-60 bg-muted/30 rounded-lg">
                  <Loader2
                    className="animate-spin text-blue-900 mb-3"
                    size={32}
                  />
                  <span className="text-muted-foreground text-sm">
                    Memuat data lokasi...
                  </span>
                  <span className="text-muted-foreground text-xs mt-1">
                    Mohon tunggu sebentar
                  </span>
                </div>
              </div>
            )}

            {/* Social Links Section */}
            <StoreSocialSection form={form} />
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              disabled={isPending || !isFormReady}
              className="w-64"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Menyimpan..." : "Simpan Profil Toko"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {state.errors?._form && state.errors._form.length > 0 && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {state.errors._form[0]}
        </div>
      )}
    </form>
  );
}
