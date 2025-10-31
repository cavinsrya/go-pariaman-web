import InfoStepCard from "@/components/common/landing/info-step-card";
import {
  MessageCircleHeart,
  MoveUpRightIcon,
  PhoneCall,
  ScanSearch,
  SquareArrowOutUpRight,
} from "lucide-react";

export default function InfoCtaSection() {
  return (
    <section className="py-10 md:py-16">
      <div className="grid gap-6 rounded-3xl bg-card p-6 ring-1 ring-border md:grid-cols-5 md:p-10">
        <div className="space-y-5 md:col-span-2">
          <div className="grid h-9 w-9 rounded-full place-items-center bg-pink-300">
            <MoveUpRightIcon color="white" size={20} />
          </div>
          <h3 className="text-pretty text-2xl font-bold md:text-3xl">
            Tertarik dengan Produk UMKM Kami? Begini Caranya!
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            Ikuti langkah mudah untuk terhubung langsung dengan UMKM Kota
            Pariaman. Temukan produk favoritmu, hubungi pemiliknya, dan dukung
            pertumbuhan ekonomi lokal
          </p>
        </div>
        <div className="grid gap-4 p-0 md:col-span-3 md:grid-cols-2 justify-items-center">
          <InfoStepCard
            icon={<SquareArrowOutUpRight color="white" />}
            title="Buka Katalog Kami"
            description="Jelajahi daftar UMKM lokal dengan beragam produk unik khas Kota Pariaman"
          />
          <InfoStepCard
            icon={<ScanSearch color="white" />}
            title="Cari UMKM Favoritmu"
            description="Gunakan pencarian atau filter kategori untuk menemukan produk yang kamu suka"
          />
          <InfoStepCard
            icon={<PhoneCall color="white" />}
            title="Klik “Hubungi”"
            description="Langsung terhubung ke WhatsApp pemilik UMKM, pesan produk dengan mudah"
          />
          <InfoStepCard
            icon={<MessageCircleHeart color="white" />}
            title="Dukung UMKM Lokal"
            description="Setiap pembelianmu ikut membantu pertumbuhan ekonomi UMKM Pariaman"
          />
        </div>
      </div>
    </section>
  );
}
