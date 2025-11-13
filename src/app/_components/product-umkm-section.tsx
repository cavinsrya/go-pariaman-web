"use client";

import ProductCard from "@/components/common/landing/product-card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { ImageMedia } from "@/config/content-img";
import { img } from "@/lib/img";
import Link from "next/link";

interface ProdukUmkmSectionProps {
  products?: Array<{
    id: number;
    title: string;
    price: number;
    slug: string;
    store: {
      name: string;
      slug: string;
      sub_district: { name: string | null } | null;
      village: { name: string | null } | null;
    } | null;
    product_media: { media_path: string; media_type: "image" | "video" }[];
  }>;
}

const toName = (x?: { name: string | null } | null) => x?.name ?? null;

export default function ProdukUmkmSection({
  products = [],
}: ProdukUmkmSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 mb-6 lg:mb-0">
          <div className="sticky top-8 h-[280px] sm:h-[320px] lg:h-[400px] rounded-2xl overflow-hidden ring-1 ring-border shadow-lg group">
            <Image
              src={img.cld(ImageMedia.sec04img01.cldId, "f_auto,q_auto")}
              alt="Produk Kami"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-2">
                Produk Kami
              </h3>
              <p className="text-xs sm:text-sm text-white/90">
                Temukan produk unggulan UMKM
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="relative">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-base">
                  Belum ada produk unggulan.
                </p>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background/95 backdrop-blur-sm hover:bg-background border-2"
                    onClick={scrollLeft}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background/95 backdrop-blur-sm hover:bg-background border-2"
                    onClick={scrollRight}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>

                  <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto scroll-smooth [scrollbar-width:thin] [scrollbar-color:theme(colors.border)_transparent] pb-4 px-0 sm:px-12"
                  >
                    <div className="flex gap-4 sm:gap-5">
                      {products.map((product) => {
                        const store = product.store; // objek atau null
                        const storeName = store?.name ?? "Toko";
                        const storeSlug = store?.slug;
                        const locationName =
                          [toName(store?.village), toName(store?.sub_district)]
                            .filter(Boolean)
                            .join(", ") || null;

                        return (
                          <div
                            key={product.id}
                            className="w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] flex-shrink-0"
                          >
                            <ProductCard
                              image={product.product_media?.[0]?.media_path}
                              mediaType={product.product_media?.[0]?.media_type}
                              title={product.title}
                              store={storeName}
                              location={locationName}
                              price={product.price}
                              slug={product.slug}
                              storeSlug={storeSlug}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Link href="/catalog">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br font-semibold px-8 shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Lihat Semua Katalog
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
