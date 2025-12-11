"use client";

import { useEffect, useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { getSubDistricts, getVillages } from "@/actions/store-action";
import FormSelect from "@/components/common/dashboard/form-select";
import FormTextarea from "@/components/common/dashboard/form-textarea";
import { LocationData } from "@/types/store";
import { PARIAMAN_ID, PARIAMAN_NAME } from "@/constants/location-profile";
import type { UpdateStoreProfileForm } from "@/validations/auth.validation";

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

  useEffect(() => {
    let isMounted = true;

    const initializeLocation = async () => {
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
        setValue("district_id", String(PARIAMAN_ID), { shouldDirty: false });
        console.log("✅ District set:", PARIAMAN_ID);

        setIsLoadingSubDistricts(true);
        console.log("⏳ Fetching sub-districts...");
        const subDistrictsData = await getSubDistricts(PARIAMAN_ID);

        if (!isMounted) {
          console.log("⚠️ Component unmounted, aborting");
          return;
        }

        setSubDistricts(subDistrictsData);
        setIsLoadingSubDistricts(false);

        const subDistrictId = initialSubDistrictId
          ? Number(initialSubDistrictId)
          : null;
        const villageId = initialVillageId ? Number(initialVillageId) : null;

        if (subDistrictId && subDistrictId > 0) {
          const subDistrictExists = subDistrictsData.some(
            (sd) => sd.id === subDistrictId
          );

          if (subDistrictExists) {
            setValue("sub_district_id", String(subDistrictId), {
              shouldDirty: false,
            });

            setIsLoadingVillages(true);
            console.log(
              "⏳ Fetching villages for sub-district:",
              subDistrictId
            );
            const villagesData = await getVillages(subDistrictId);

            if (!isMounted) {
              return;
            }
            setVillages(villagesData);
            setIsLoadingVillages(false);

            if (villageId && villageId > 0) {
              const villageExists = villagesData.some(
                (v) => v.id === villageId
              );

              console.log("🔍 Village exists?", villageExists);

              if (villageExists) {
                setValue("village_id", String(villageId), {
                  shouldDirty: false,
                });

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

        setIsInitialized(true);
        console.log("🎉 Location initialization complete!");

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

  useEffect(() => {
    if (!isInitialized) return;

    if (!selectedSubDistrict) {
      setVillages([]);
      setValue("village_id", "", { shouldDirty: true });
      return;
    }

    const subDistrictId = Number.parseInt(selectedSubDistrict, 10);
    if (isNaN(subDistrictId)) return;

    const initialSubDistrictStr = initialSubDistrictId
      ? String(initialSubDistrictId)
      : "";

    if (selectedSubDistrict === initialSubDistrictStr && villages.length > 0) {
      return;
    }

    let isMounted = true;

    const fetchVillages = async () => {
      setIsLoadingVillages(true);
      try {
        const villagesData = await getVillages(subDistrictId);

        if (!isMounted) return;

        setVillages(villagesData);
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
