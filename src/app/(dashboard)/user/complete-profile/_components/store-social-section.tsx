"use client";

import { UseFormReturn } from "react-hook-form";
import { SOCIAL_PLATFORMS } from "@/constants/social-platform-constant";
import type { UpdateStoreProfileForm } from "@/validations/auth.validation";

interface StoreSocialSectionProps {
  form: UseFormReturn<UpdateStoreProfileForm>;
}

export default function StoreSocialSection({ form }: StoreSocialSectionProps) {
  const { register } = form;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-3">Media Sosial</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SOCIAL_PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          const fieldName = `social_links.${platform.id}` as const;
          const inputId = `social-${platform.id}`;

          return (
            <div key={platform.id} className="space-y-2">
              <label htmlFor={inputId} className="text-sm font-medium">
                {platform.label}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-input border-e-0 rounded-s-lg">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <input
                  id={inputId}
                  type="url"
                  {...register(fieldName)}
                  placeholder={`URL ${platform.label}`}
                  inputMode="url"
                  autoComplete="off"
                  spellCheck={false}
                  className="block w-full min-w-0 flex-1 rounded-none rounded-e-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
