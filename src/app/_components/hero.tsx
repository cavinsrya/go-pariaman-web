import Image from "next/image";
import { Button } from "@/components/ui/button";
import { img } from "@/lib/img";
import { ImageMedia } from "@/config/content-img";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="py-10 md:py-16">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex h-full flex-col justify-between order-2 md:order-1">
          <div className="flex flex-col gap-6 md:gap-3 xl:gap-6">
            <h1 className="text-pretty text-4xl font-extrabold tracking-tight md:text-4xl lg:text-6xl">
              UMKM Pariaman
              <br />
              Go Digital
            </h1>
            <p className="max-w-prose text-base font-medium text-muted-foreground md:text-sm">
              Temukan dan dukung produk lokal terbaik dari UMKM Kota Pariaman,
              kini hadir lebih dekat lewat media promosi digital.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="https://pariamankota.go.id/site/home">
                <Button className="rounded-full px-5 md:text-xs cursor-pointer">
                  Website Kota
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-full px-5 bg-transparent md:text-xs"
              >
                Social Media
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <div
              className="relative overflow-hidden rounded-3xl bg-muted ring-1 ring-border
                            aspect-[5/3] md:aspect-[16/9] md:w-[85%]"
            >
              <Image
                src={img.cld(ImageMedia.hero02.cldId, "f_auto,q_auto")}
                alt="Hero media 02"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 767px) 100vw, 42vw"
              />
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div
            className="relative overflow-hidden rounded-3xl bg-muted ring-1 ring-border
                          aspect-[16/10] md:aspect-[10/11] xl:aspect-square"
          >
            <Image
              src={img.cld(ImageMedia.hero01.cldId, "f_auto,q_auto")}
              alt="Hero media 01"
              fill
              className="object-cover"
              sizes="(max-width: 767px) 100vw, 42vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
