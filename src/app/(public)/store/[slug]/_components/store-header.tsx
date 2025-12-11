"use client";

import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreHeaderProps {
  store: {
    name: string;
    logo_url?: string;
    cover_url?: string;
    description?: string;
    phone?: string;
    address?: string;
    sub_districts?: { name: string };
    total_views: number;
  };
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
        {store.cover_url ? (
          <Image
            src={store.cover_url || "/placeholder.svg"}
            alt={store.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10" />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-background rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border-4 border-background shadow-md">
              {store.logo_url ? (
                <Image
                  src={store.logo_url || "/placeholder.svg"}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Logo
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {store.name}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                {store.sub_districts && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{store.sub_districts.name}</span>
                  </div>
                )}
                {store.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{store.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {store.total_views.toLocaleString("id-ID")} kunjungan
                  </span>
                </div>
              </div>

              {store.description && (
                <p className="text-muted-foreground line-clamp-2">
                  {store.description}
                </p>
              )}
            </div>

            <Button className="w-full md:w-auto">Bagikan Toko</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
