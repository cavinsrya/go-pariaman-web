import { Button } from "@/components/ui/button";
import Image from "next/image";
import { img } from "@/lib/img";
import { ImageMedia } from "@/config/content-img";
import StatItem from "@/components/common/landing/stat-item";

export default function InfoSection() {
  return (
    <section className="py-6 md:py-10">
      <div className="relative">
        <div className="rounded-3xl bg-gradient-to-b from-white to-slate-100 p-6 md:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr_1fr] pb-13 md:pb-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Go Pariaman
              </h2>
              <div className="text-sm md:text-xs leading-relaxed text-muted-foreground">
                <p>
                  Kota Pariaman dikenal dengan keindahan pantai, budaya
                  Minangkabau yang kuat, serta potensi UMKM yang terus
                  berkembang. Dari kuliner khas hingga kerajinan tangan,
                  produk-produk lokal Pariaman mencerminkan kearifan dan
                  kreativitas masyarakatnya.
                </p>
                <br />
                <p>
                  Website ini hadir untuk membantu UMKM Kota Pariaman lebih
                  mudah dikenal luas. Dengan platform digital, produk lokal
                  dapat dipromosikan secara efektif, menjangkau pasar lebih
                  besar, dan meningkatkan daya saing di era digital.
                </p>
              </div>
            </div>
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <Image
                src={img.cld(ImageMedia.sec02img01.cldId, "f_auto,q_auto")}
                alt="Hero Image 1"
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1023px) 33vw, 33vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-6">
              <div className="relative aspect-[4/3] md:aspect-[3/4] lg:aspect-[3/2] w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
                <Image
                  src={img.cld(ImageMedia.sec02img02.cldId, "f_auto,q_auto")}
                  alt="Hero Image 2"
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 33vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="flex md:flex-col lg:flex-row items-center justify-between rounded-2xl bg-background p-3 ring-1 ring-border md:gap-2">
                <span className="text-sm md:text-xs">
                  Ingin Tahu Lebih Banyak?
                </span>
                <Button size="sm" className="rounded-full px-4 md:text-xs">
                  Hubungi Kami
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute z-10 inset-x-0 -bottom-[30px] md:-bottom-10 mx-auto grid w-full max-w-[20rem] md:max-w-[36rem] lg:max-w-[48rem] rounded-[28px] px-6 py-5 grid-cols-6 md:px-8
          bg-gradient-to-r from-[#87D5F5] via-[#E3BBFD] to-[#20C7D0]"
        >
          <StatItem label="Total UMKM" value="350+" />
          <StatItem label="Kuliner" value="120+" />
          <StatItem label="Kerajinan" value="50+" />
          <StatItem label="Fashion" value="22+" />
          <StatItem label="Perikanan" value="88+" />
          <StatItem label="Jasa" value="78+" />
        </div>
      </div>
    </section>
  );
}
