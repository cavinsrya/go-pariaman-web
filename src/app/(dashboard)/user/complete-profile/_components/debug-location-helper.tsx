"use client";

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import type { UpdateStoreProfileForm } from "@/validations/auth.validation";

/**
 * 🐛 Temporary Debug Component
 * Add this to complete-profile.tsx to see what's happening
 *
 * Usage:
 * <DebugLocationHelper form={form} storeData={storeData} />
 */

interface DebugLocationHelperProps {
  form: UseFormReturn<UpdateStoreProfileForm>;
  storeData: any;
}

export default function DebugLocationHelper({
  form,
  storeData,
}: DebugLocationHelperProps) {
  const watchedValues = form.watch();

  useEffect(() => {
    console.group("🔍 FORM DEBUG INFO");
    console.log("Store Data from Props:", {
      district_id: storeData?.district_id,
      sub_district_id: storeData?.sub_district_id,
      village_id: storeData?.village_id,
    });
    console.log("Current Form Values:", {
      district_id: watchedValues.district_id,
      sub_district_id: watchedValues.sub_district_id,
      village_id: watchedValues.village_id,
    });
    console.log("Form State:", {
      isDirty: form.formState.isDirty,
      isSubmitting: form.formState.isSubmitting,
      errors: form.formState.errors,
    });
    console.groupEnd();
  }, [watchedValues, storeData, form.formState]);

  // Visual debug in UI
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed bottom-4 right-4 p-4 bg-black/90 text-white text-xs rounded-lg max-w-md z-50">
        <h4 className="font-bold mb-2">🐛 Debug Info</h4>
        <div className="space-y-1">
          <div>
            <strong>Store Data:</strong>
            <pre className="mt-1 text-[10px]">
              {JSON.stringify(
                {
                  district: storeData?.district_id,
                  subDistrict: storeData?.sub_district_id,
                  village: storeData?.village_id,
                },
                null,
                2
              )}
            </pre>
          </div>
          <div>
            <strong>Form Values:</strong>
            <pre className="mt-1 text-[10px]">
              {JSON.stringify(
                {
                  district: watchedValues.district_id,
                  subDistrict: watchedValues.sub_district_id,
                  village: watchedValues.village_id,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
