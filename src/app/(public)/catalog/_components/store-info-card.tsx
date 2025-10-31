"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type StoreUser = {
  name: string;
  avatar_url?: string | null;
};

interface StoreInfoCardProps {
  store: {
    id: number;
    name: string;
    slug: string;
    logo_url?: string | null;
    sub_district_name?: string | null;
    village_name?: string | null;
    users?: StoreUser | null;
  };
}

export default function StoreInfoCard({ store }: StoreInfoCardProps) {
  const location =
    store.village_name || store.sub_district_name || "Kota Pariaman";

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Store Logo */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 ring-1 ring-border">
            {store.logo_url ? (
              <Image
                src={store.logo_url}
                alt={store.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Logo
              </div>
            )}
          </div>

          {/* Store Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-1">{store.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          {/* Visit Profile Button */}
          <Link href={`/store/${store.slug}`}>
            <Button variant="outline" size="sm" className="flex-shrink-0">
              Kunjungi Toko
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
