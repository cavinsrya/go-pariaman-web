"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Store, Video } from "lucide-react";

interface CatalogProductCardProps {
  id: number;
  title: string;
  price: number;
  image?: string;
  imgAlt?: string;
  storeName: string;
  storeSlug: string;
  location: string;
  mediaType?: "image" | "video";
}

export default function CatalogProductCard({
  id,
  title,
  price,
  image,
  storeName,
  imgAlt = "Gambar Produk",
  storeSlug,
  location,
  mediaType = "image",
}: CatalogProductCardProps) {
  const isVideo = mediaType === "video" && image;

  return (
    <Link href={`/catalog/${storeSlug}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col p-0 cursor-pointer hover:ring-2 hover:ring-primary/20 group">
        <CardContent className="p-0 relative">
          <div className="relative aspect-square w-full bg-muted">
            {!image ? (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            ) : isVideo ? (
              <>
                <video
                  src={image}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] sm:text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                  <Video className="w-3 h-3" />
                  Video
                </div>
              </>
            ) : (
              <Image
                src={image}
                alt={imgAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-4 flex-1">
          <div className="w-full flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {title}
            </h3>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Store className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{storeName}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>

            <p className="text-base font-bold text-primary">
              Rp {price.toLocaleString("id-ID")}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
