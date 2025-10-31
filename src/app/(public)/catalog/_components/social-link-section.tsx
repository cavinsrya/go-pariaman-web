"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Instagram,
  Facebook,
  Music2,
  ShoppingBag,
  Utensils,
} from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksSectionProps {
  socialLinks: SocialLink[];
}

const platformConfig: Record<
  string,
  {
    icon: React.ReactNode;
    label: string;
    color: string;
    section: "top" | "bottom";
  }
> = {
  whatsapp: {
    icon: <MessageCircle className="w-5 h-5" />,
    label: "WhatsApp",
    color: "bg-green-500 hover:bg-green-600",
    section: "top",
  },
  instagram: {
    icon: <Instagram className="w-5 h-5" />,
    label: "Instagram",
    color: "bg-pink-500 hover:bg-pink-600",
    section: "top",
  },
  facebook: {
    icon: <Facebook className="w-5 h-5" />,
    label: "Facebook",
    color: "bg-blue-600 hover:bg-blue-700",
    section: "top",
  },
  tiktok: {
    icon: <Music2 className="w-5 h-5" />,
    label: "TikTok",
    color: "bg-black hover:bg-gray-800",
    section: "top",
  },
  gofood: {
    icon: <Utensils className="w-5 h-5" />,
    label: "GoFood",
    color: "bg-red-500 hover:bg-red-600",
    section: "bottom",
  },
  shopee: {
    icon: <ShoppingBag className="w-5 h-5" />,
    label: "Shopee",
    color: "bg-orange-500 hover:bg-orange-600",
    section: "bottom",
  },
  tokopedia: {
    icon: <ShoppingBag className="w-5 h-5" />,
    label: "Tokopedia",
    color: "bg-green-600 hover:bg-green-700",
    section: "bottom",
  },
};

export default function SocialLinksSection({
  socialLinks,
}: SocialLinksSectionProps) {
  const topLinks = socialLinks.filter(
    (link) => platformConfig[link.platform.toLowerCase()]?.section === "top"
  );
  const bottomLinks = socialLinks.filter(
    (link) => platformConfig[link.platform.toLowerCase()]?.section === "bottom"
  );

  return (
    <div className="space-y-6">
      {/* Top Section - Social Media */}
      {topLinks.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {topLinks.map((link) => {
            const config = platformConfig[link.platform.toLowerCase()];
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  className={`w-full text-white ${config.color}`}
                  size="lg"
                >
                  {config.icon}
                  <span>{config.label}</span>
                </Button>
              </a>
            );
          })}
        </div>
      )}

      {/* Bottom Section - Marketplace */}
      {bottomLinks.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-muted-foreground mb-3">
            Kami juga tersedia di:
          </p>
          <div className="flex gap-3 flex-wrap">
            {bottomLinks.map((link) => {
              const config = platformConfig[link.platform.toLowerCase()];
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  title={config.label}
                >
                  {config.icon}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
