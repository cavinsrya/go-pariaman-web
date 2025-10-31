"use client";

import SectionHeading from "@/components/common/landing/section-heading";
import UmkmCard from "@/components/common/landing/umkm-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface UmkmDesaSectionProps {
  stores?: Array<{
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
    description: string | null;
    users?: {
      name: string | null;
      avatar_url: string | null;
    } | null;
  }>;
}

export default function UmkmDesaSection({ stores = [] }: UmkmDesaSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <SectionHeading title="UMKM Unggulan" />
      {stores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-base">
            Belum ada UMKM unggulan.
          </p>
        </div>
      ) : (
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background/95 backdrop-blur-sm hover:bg-background border-2"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full shadow-lg bg-background/95 backdrop-blur-sm hover:bg-background border-2"
            onClick={scrollRight}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-12"
          >
            <div className="flex gap-5 sm:gap-6">
              {stores.map((store) => {
                const users = store.users;
                return (
                  <div
                    key={store.id}
                    className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0"
                  >
                    <UmkmCard
                      title={store.name}
                      excerpt={store.description || "Deskripsi tidak tersedia"}
                      logoUrl={store.logo_url}
                      slug={store.slug}
                      avatar_url={users?.avatar_url}
                      name={users?.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
