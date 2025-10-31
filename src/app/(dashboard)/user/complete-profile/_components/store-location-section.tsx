"use client";

import { useEffect, useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { getSubDistricts, getVillages } from "@/actions/store-action";
import FormSelect from "@/components/common/dashboard/form-select";
import FormTextarea from "@/components/common/dashboard/form-textarea";
import { LocationData } from "@/types/store";
import { PARIAMAN_ID, PARIAMAN_NAME } from "@/constants/location-profile";
import type { UpdateStoreProfileForm } from "@/validations/auth.validation";

/**
 * ✅ Fixed Auto-fill Location:
 * - District always set (Pariaman)
 * - Sub-district auto-filled from database
 * - Village auto-filled from database
 * - No need to re-select when editing other fields
 */

interface StoreLocationSectionProps {
  form: UseFormReturn<UpdateStoreProfileForm>;
  initialDistrictId?: number | string | null;
  initialSubDistrictId?: number | string | null;
  initialVillageId?: number | string | null;
}

export default function StoreLocationSection({
  form,
  initialDistrictId,
  initialSubDistrictId,
  initialVillageId,
}: StoreLocationSectionProps) {
  const { setValue, watch } = form;

  const [subDistricts, setSubDistricts] = useState<LocationData[]>([]);
  const [villages, setVillages] = useState<LocationData[]>([]);
  const [isLoadingSubDistricts, setIsLoadingSubDistricts] = useState(false);
  const [isLoadingVillages, setIsLoadingVillages] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const selectedSubDistrict = watch("sub_district_id");

  // ✅ Memoized select options
  const subDistrictOptions = useMemo(
    () =>
      subDistricts.map((sd) => ({
        value: sd.id.toString(),
        label: sd.name,
      })),
    [subDistricts]
  );

  const villageOptions = useMemo(
    () =>
      villages.map((v) => ({
        value: v.id.toString(),
        label: v.name,
      })),
    [villages]
  );

  // ✅ Effect 1: Initialize ALL location data on mount (ONE TIME ONLY)
  useEffect(() => {
    let isMounted = true;

    const initializeLocation = async () => {
      // ✅ Get current form values to verify they're set
      const currentDistrict = form.getValues("district_id");
      const currentSubDistrict = form.getValues("sub_district_id");
      const currentVillage = form.getValues("village_id");

      console.log("🚀 Starting location initialization");
      console.log("📦 Props received:", {
        initialDistrictId,
        initialSubDistrictId,
        initialVillageId,
      });
      console.log("📋 Current form values:", {
        currentDistrict,
        currentSubDistrict,
        currentVillage,
      });

      try {
        // 1. Set district (always Pariaman) - IMMEDIATELY
        setValue("district_id", String(PARIAMAN_ID), { shouldDirty: false });
        console.log("✅ District set:", PARIAMAN_ID);

        // 2. Fetch sub-districts
        setIsLoadingSubDistricts(true);
        console.log("⏳ Fetching sub-districts...");
        const subDistrictsData = await getSubDistricts(PARIAMAN_ID);

        if (!isMounted) {
          console.log("⚠️ Component unmounted, aborting");
          return;
        }

        console.log(
          "✅ Sub-districts fetched:",
          subDistrictsData.length,
          "items"
        );
        setSubDistricts(subDistrictsData);
        setIsLoadingSubDistricts(false);

        // Convert initial values to numbers
        const subDistrictId = initialSubDistrictId
          ? Number(initialSubDistrictId)
          : null;
        const villageId = initialVillageId ? Number(initialVillageId) : null;

        console.log("📍 Converted IDs:", { subDistrictId, villageId });

        // 3. If we have initial sub-district, set it and fetch villages
        if (subDistrictId && subDistrictId > 0) {
          const subDistrictExists = subDistrictsData.some(
            (sd) => sd.id === subDistrictId
          );

          console.log("🔍 Sub-district exists?", subDistrictExists);

          if (subDistrictExists) {
            // ✅ Set sub-district value IMMEDIATELY
            setValue("sub_district_id", String(subDistrictId), {
              shouldDirty: false,
            });
            console.log("✅ Sub-district set:", subDistrictId);

            // Verify it was set
            const verifySubDistrict = form.getValues("sub_district_id");
            console.log(
              "🔍 Verify sub-district value after setValue:",
              verifySubDistrict
            );

            // 4. Fetch villages for this sub-district
            setIsLoadingVillages(true);
            console.log(
              "⏳ Fetching villages for sub-district:",
              subDistrictId
            );
            const villagesData = await getVillages(subDistrictId);

            if (!isMounted) {
              console.log("⚠️ Component unmounted, aborting");
              return;
            }

            console.log("✅ Villages fetched:", villagesData.length, "items");
            setVillages(villagesData);
            setIsLoadingVillages(false);

            // 5. If we have initial village, set it
            if (villageId && villageId > 0) {
              const villageExists = villagesData.some(
                (v) => v.id === villageId
              );

              console.log("🔍 Village exists?", villageExists);

              if (villageExists) {
                // ✅ Set village value IMMEDIATELY
                setValue("village_id", String(villageId), {
                  shouldDirty: false,
                });
                console.log("✅ Village set:", villageId);

                // Verify it was set
                const verifyVillage = form.getValues("village_id");
                console.log(
                  "🔍 Verify village value after setValue:",
                  verifyVillage
                );
              } else {
                console.warn("⚠️ Village ID not found in list:", villageId);
              }
            } else {
              console.log("ℹ️ No initial village ID to set");
            }
          } else {
            console.warn(
              "⚠️ Sub-district ID not found in list:",
              subDistrictId
            );
          }
        } else {
          console.log("ℹ️ No initial sub-district ID to set");
        }

        // Mark as initialized to enable user interaction effects
        setIsInitialized(true);
        console.log("🎉 Location initialization complete!");

        // Final verification
        const finalValues = {
          district: form.getValues("district_id"),
          subDistrict: form.getValues("sub_district_id"),
          village: form.getValues("village_id"),
        };
        console.log("✅ Final form values:", finalValues);
      } catch (error) {
        console.error("❌ Error initializing location:", error);
        if (isMounted) {
          setIsLoadingSubDistricts(false);
          setIsLoadingVillages(false);
          setIsInitialized(true);
        }
      }
    };

    // Only run if we have the necessary data
    if (initialSubDistrictId === undefined && initialVillageId === undefined) {
      console.log("⏸️ Waiting for initial data...");
      return;
    }

    initializeLocation();

    return () => {
      isMounted = false;
      console.log("🧹 Location component cleanup");
    };
  }, [initialSubDistrictId, initialVillageId, setValue, form]);

  // ✅ Effect 2: Handle USER CHANGES to sub-district (NOT initial load)
  useEffect(() => {
    // Skip if not initialized yet (initial load is handled above)
    if (!isInitialized) return;

    // If no sub-district selected, clear villages
    if (!selectedSubDistrict) {
      setVillages([]);
      setValue("village_id", "", { shouldDirty: true }); // Mark as dirty for user change
      return;
    }

    const subDistrictId = Number.parseInt(selectedSubDistrict, 10);
    if (isNaN(subDistrictId)) return;

    // ✅ Check if this is different from initial value (user changed it)
    const initialSubDistrictStr = initialSubDistrictId
      ? String(initialSubDistrictId)
      : "";

    // If it's the same as initial, don't fetch again (already done in Effect 1)
    if (selectedSubDistrict === initialSubDistrictStr && villages.length > 0) {
      return;
    }

    // This is a USER CHANGE - fetch new villages
    let isMounted = true;

    const fetchVillages = async () => {
      setIsLoadingVillages(true);
      try {
        const villagesData = await getVillages(subDistrictId);

        if (!isMounted) return;

        setVillages(villagesData);

        // Reset village selection ONLY on user change (not initial load)
        setValue("village_id", "", { shouldDirty: true });
      } catch (error) {
        console.error("Error fetching villages:", error);
      } finally {
        if (isMounted) {
          setIsLoadingVillages(false);
        }
      }
    };

    fetchVillages();

    return () => {
      isMounted = false;
    };
  }, [
    selectedSubDistrict,
    isInitialized,
    villages.length,
    initialSubDistrictId,
    setValue,
  ]);

  return (
    <div className="space-y-4">
      <FormTextarea
        form={form}
        name="address"
        label="Alamat Lengkap"
        placeholder="Jalan, nomor, RT/RW, dll"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormSelect
          form={form}
          name="district_id"
          label="Wilayah"
          selectItem={[{ value: String(PARIAMAN_ID), label: PARIAMAN_NAME }]}
          placeholder={PARIAMAN_NAME}
        />

        <FormSelect
          form={form}
          name="sub_district_id"
          label="Kecamatan"
          selectItem={subDistrictOptions}
          disabled={isLoadingSubDistricts || subDistricts.length === 0}
          placeholder={isLoadingSubDistricts ? "Memuat..." : "Pilih kecamatan"}
        />
      </div>

      <FormSelect
        form={form}
        name="village_id"
        label="Kelurahan / Desa"
        selectItem={villageOptions}
        disabled={
          isLoadingVillages || villages.length === 0 || !selectedSubDistrict
        }
        placeholder={
          isLoadingVillages
            ? "Memuat..."
            : !selectedSubDistrict
            ? "Pilih kecamatan dulu"
            : villages.length === 0
            ? "Tidak ada data kelurahan"
            : "Pilih kelurahan/desa"
        }
      />
    </div>
  );
}
