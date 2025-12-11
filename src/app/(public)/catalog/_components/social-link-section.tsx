"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  SocialPlatform,
  SOCIAL_PLATFORMS,
} from "@/constants/social-platform-constant";
interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
}

type PlatformMeta = {
  color: string;
  section: "top" | "bottom";
};

const PLATFORM_META: Record<string, PlatformMeta> = {
  whatsapp: {
    color:
      "text-black shadow shadow-md shadow-green-500/20 border border-green-500 bg-white hover:bg-green-600 hover:text-white font-bold",
    section: "top",
  },
  instagram: {
    color:
      "text-black shadow shadow-md shadow-red-500/20 border border-red-500 bg-white hover:bg-pink-600 hover:text-white cursor-pointer font-bold",
    section: "top",
  },
  facebook: {
    color:
      "text-black shadow shadow-md shadow-blue-500/20 border border-blue-500 bg-white hover:bg-blue-700 hover:text-white cursor-pointer font-bold",
    section: "top",
  },
  tiktok: {
    color:
      "text-black shadow shadow-md shadow-pink-500/20 border border-pink-500 bg-white hover:bg-gray-800 hover:text-white cursor-pointer font-bold",
    section: "top",
  },
  gofood: {
    color:
      "text-black shadow shadow-md bg-white hover:bg-red-600 hover:text-white cursor-pointer font-bold",
    section: "bottom",
  },
  shopee: {
    color:
      "text-black shadow shadow-md bg-white hover:bg-orange-600 hover:text-white cursor-pointer font-bold",
    section: "bottom",
  },
  tokopedia: {
    color:
      "text-black shadow shadow-md bg-white hover:bg-green-700 hover:text-white cursor-pointer font-bold",
    section: "bottom",
  },
};

type PlatformConfig = SocialPlatform & PlatformMeta;

function resolvePlatform(platformRaw: string): PlatformConfig | null {
  const key = platformRaw.toLowerCase();

  const base = SOCIAL_PLATFORMS.find((p) => p.id === key);
  const meta = PLATFORM_META[key];

  if (!base || !meta) return null;

  return {
    ...base,
    ...meta,
  };
}

export default function SocialLinksSection({
  socialLinks,
}: SocialLinksSectionProps) {
  const resolved = socialLinks
    .map((link) => {
      const config = resolvePlatform(link.platform);
      return config ? { link, config } : null;
    })
    .filter(
      (item): item is { link: SocialLink; config: PlatformConfig } =>
        item !== null
    );

  const topLinks = resolved.filter((item) => item.config.section === "top");
  const bottomLinks = resolved.filter(
    (item) => item.config.section === "bottom"
  );

  return (
    <div className="space-y-6">
      {topLinks.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {topLinks.map(({ link, config }) => {
            const Icon = config.icon;
            return (
              <a
                key={config.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className={`w-full text-white ${config.color}`}
                  size="lg"
                >
                  <Icon className="w-5 h-5" />
                  <span>{config.label}</span>
                </Button>
              </a>
            );
          })}
        </div>
      )}

      {bottomLinks.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-3">
            Kami juga tersedia di:
          </p>
          <div className="flex gap-3 flex-wrap">
            {bottomLinks.map(({ link, config }) => {
              const Icon = config.icon;
              return (
                <a
                  key={config.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title={config.label}
                >
                  <Icon className="w-8 h-8" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
