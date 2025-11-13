"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/img";
import {
  ImageMedia,
  type ImageMediaConfig,
  type SlideInput,
  type MediaItem,
} from "@/config/content-img";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

// --- type guards & normalizer (tanpa any) ---
function isSlideString(v: unknown): v is string {
  return typeof v === "string";
}
function isSlideObject(v: unknown): v is MediaItem {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  const okCld = typeof obj.cldId === "string";
  const okAlt = obj.alt === undefined || typeof obj.alt === "string";
  return okCld && okAlt;
}
function normalizeSlide(s: SlideInput): MediaItem {
  return isSlideString(s) ? { cldId: s, alt: "Hero media 01" } : s;
}

export default function Hero() {
  // pastikan ImageMedia terketik sebagai ImageMediaConfig
  const media: ImageMediaConfig = ImageMedia;

  // slides untuk HERO MEDIA 01 (KANAN)
  const slides: MediaItem[] =
    media.hero01Carousel && media.hero01Carousel.length > 0
      ? media.hero01Carousel
          .filter((x): x is SlideInput => isSlideString(x) || isSlideObject(x))
          .map(normalizeSlide)
      : [media.hero01];

  const autoplay = useRef(
    Autoplay({
      delay: 3500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section className="py-10 md:py-16">
      <div className="grid gap-8 md:grid-cols-2">
        {/* LEFT: copy + CTA + HERO MEDIA 02 (statis) */}
        <div className="flex h-full flex-col justify-between order-2 md:order-1">
          <div className="flex flex-col gap-6 md:gap-3 xl:gap-6">
            <h1 className="text-pretty text-4xl font-extrabold tracking-tight md:text-4xl lg:text-6xl">
              UMKM Pariaman
              <br />
              <span className="inline-block align-baseline italic text-white rounded-md bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 px-2 py-0.5 leading-tight">
                Go Digital
              </span>
            </h1>

            <p className="max-w-prose text-base font-medium text-muted-foreground md:text-sm">
              Temukan kurasi produk terbaik dari pelaku UMKM Kota Pariaman,
              mulai dari kuliner, kerajinan, hingga fashion. Cari brand lokal,
              lihat profil usaha, dan terhubung langsung.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="https://pariamankota.go.id/site/home">
                <Button className="rounded-full px-5 md:text-xs font-bold text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br cursor-pointer">
                  <ArrowUpRight />
                  Website Kota
                </Button>
              </Link>
              <Link href="https://www.instagram.com/mediacenterkotapariaman/">
                <Button
                  variant="outline"
                  className="rounded-full px-5 bg-transparent md:text-xs font-bold border border-teal-400 text-teal-400"
                >
                  Social Media
                </Button>
              </Link>
            </div>
          </div>

          {/* HERO MEDIA 02 (statis) */}
          <div className="mt-4">
            <div className="relative overflow-hidden rounded-3xl bg-muted ring-1 ring-border aspect-[5/3] md:aspect-[16/9] md:w-[85%]">
              <Image
                src={img.cld(media.hero02.cldId, "f_auto,q_auto")}
                alt={media.hero02.alt ?? "Hero media 02"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 767px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>

        {/* RIGHT: HERO MEDIA 01 (carousel autoplay) */}
        <div className="order-1 md:order-2">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[autoplay.current]}
          >
            <CarouselContent>
              {slides.map((s, i) => (
                <CarouselItem key={`${s.cldId}-${i}`}>
                  <div className="relative overflow-hidden rounded-3xl bg-muted ring-1 ring-border aspect-[16/10] md:aspect-[10/11] xl:aspect-square">
                    <Image
                      src={img.cld(s.cldId, "f_auto,q_auto")}
                      alt={s.alt ?? "Hero media 01"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 767px) 100vw, 42vw"
                      priority={i === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
