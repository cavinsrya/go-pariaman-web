"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";

interface CatalogProductCardProps {
  id: number;
  title: string;
  price: number;
  image?: string;
  storeName: string;
  storeSlug: string;
  location: string;
}

export default function CatalogProductCard({
  id,
  title,
  price,
  image,
  storeName,
  storeSlug,
  location,
}: CatalogProductCardProps) {
  return (
    <Link href={`/catalog/${id}`} className="block h-full">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col p-0 cursor-pointer hover:ring-2 hover:ring-primary/20">
        <CardContent className="p-0">
          <div className="relative w-full aspect-[4/3] bg-gray-200">
            {image ? (
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-4 flex-1">
          <div className="w-full flex-1">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
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
