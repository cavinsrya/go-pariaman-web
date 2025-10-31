"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  images: { src: string; alt?: string }[];
  className?: string;
};

export default function ProductGallery({ images, className }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div className={cn("w-full", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl ring-1 ring-border">
        <Image
          src={
            current?.src ||
            "/placeholder.svg?height=600&width=800&query=Gambar%20produk%20utama"
          }
          alt={current?.alt || "Gambar produk"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Pilih gambar ${i + 1}`}
            className={cn(
              "relative aspect-square overflow-hidden rounded-lg ring-1 ring-border transition",
              active === i ? "ring-2 ring-primary" : "hover:opacity-90"
            )}
          >
            <Image
              src={
                img.src ||
                "/placeholder.svg?height=160&width=160&query=Thumbnail%20produk"
              }
              alt={img.alt || `Thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 18vw, 8vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
