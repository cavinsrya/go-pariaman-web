import SectionHeading from "@/components/common/landing/section-heading";
import { ProductCard } from "@/components/common/product-card";
import ProductGallery from "./_components/product-gallery";
import ReviewCard from "./_components/review-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Data mock sederhana untuk demo
function getProduct(id: string) {
  const base = {
    id: "p-1",
    title: "Pempek Kapal Selam Jeol",
    category: "Kuliner",
    price: 20000,
    store: "Jeol Food",
    location: "Pasar Pariaman",
    description:
      "“Pempek Jeol merupakan usaha yang berdiri sejak 2021 dan mempunyai 2 cabang dengan jumlah karyawan di masing-masing cabang kurang lebih 3 orang. Penjualannya 60% masih didominasi penjualan online di Shopeefood, Gojek, Shopeefood, Tokopedia, Shopee dan Bibit. Selain pempek, kami juga menjual Batagor dan keduanya menjadi best seller saat weekend untuk oleh-oleh. Pempek Jeol berkomitmen menjadi produk terbaik agar produk premium UMKM Pariaman dengan harga cukup ramah untuk lambung (tidak mengandung cuka) serta menjadi pilihan utama oleh-oleh.”",
    images: [
      {
        src: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760523942/pempek1_zvr8r3.jpg",
        alt: "Foto produk utama",
      },
      {
        src: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760523942/pempek2_avf9wu.jpg",
      },
      {
        src: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760523943/pempek3_bmzueh.jpg",
      },
      {
        src: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760523942/pempek1_zvr8r3.jpg",
      },
    ],
  };
  return base;
}

const MARKETPLACES = [
  {
    key: "tokopedia",
    name: "Tokopedia",
    url: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760529093/tokopedia-logo_hs3pvw.png",
  },
  {
    key: "gofood",
    name: "GoFood",
    url: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760529093/gojek-logo_inb2am.png",
  },
  {
    key: "shopeefood",
    name: "ShopeeFood",
    url: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760529093/shopee-food-logo_uz6ro9.png",
  },
  {
    key: "shopee",
    name: "Shopee",
    url: "https://res.cloudinary.com/dohpngcuj/image/upload/v1760529093/shopee-logo_tuvd9o.png",
  },
];

export default function Page({ params }: { params: { id: string } }) {
  const product = getProduct(params.id);

  const related = [
    {
      id: "p-1",
      title: "Keripik Singkong Balado",
      price: 25000,
      image:
        "https://res.cloudinary.com/dohpngcuj/image/upload/v1760080562/ex_3_pdxzee.png",
      store: "Si Daun",
      location: "Pasar Pariaman",
      category: "Kuliner",
      district: "Pariaman Tengah",
      type: "ready",
    },
    {
      id: "p-2",
      title: "Sate Pariaman Asli",
      price: 25000,
      image:
        "https://res.cloudinary.com/dohpngcuj/image/upload/v1760080563/ex_4_lcvlhu.png",
      store: "Sate Piaman",
      location: "Pasar Pariaman",
      category: "Kuliner",
      district: "Pariaman Utara",
      type: "ready",
    },
    {
      id: "p-3",
      title: "Dimsum Ayam Original",
      price: 26500,
      image:
        "https://res.cloudinary.com/dohpngcuj/image/upload/v1760080562/ex_2_nj5to6.png",
      store: "Dimsum Jeol",
      location: "Pasar Pariaman",
      category: "Kuliner",
      district: "Pariaman Selatan",
      type: "preorder",
    },
    {
      id: "p-4",
      title: "Batagor Jeol Crispy",
      price: 25000,
      image:
        "https://res.cloudinary.com/dohpngcuj/image/upload/v1760080562/ex_1_k2wnqh.png",
      store: "Batagor Jeol",
      location: "Pasar Pariaman",
      category: "Kuliner",
      district: "Pariaman Timur",
      type: "ready",
    },
    {
      id: "p-5",
      title: "Anyaman Pandan Mini Tote",
      price: 75000,
      image:
        "https://res.cloudinary.com/dohpngcuj/image/upload/v1760080562/ex_1_k2wnqh.png",
      store: "Anyam Pisaman",
      location: "Kampung Anyaman",
      category: "Kerajinan",
      district: "Pariaman Utara",
      type: "preorder",
    },
    {
      id: "p-6",
      title: "Batik Pariaman Motif Ombak",
      price: 120000,
      image:
        "https://res.cloudinary.com/dohpngcuj/image/upload/v1760080562/ex_2_nj5to6.png",
      store: "Batik Lestari",
      location: "Sentra Batik",
      category: "Fashion",
      district: "Pariaman Tengah",
      type: "ready",
    },
  ];

  return (
    <Container className="py-8 md:py-12">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Gallery */}
        <div className="lg:col-span-5">
          <ProductGallery images={product.images} />
        </div>

        {/* Detail */}
        <div className="lg:col-span-7">
          <div className="mb-2">
            <Badge variant="outline" className="rounded-full">
              {product.category}
            </Badge>
          </div>
          <h1 className="text-pretty text-2xl font-extrabold tracking-tight md:text-4xl">
            {product.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">Mulai Dari</p>
          <p className="text-2xl font-bold text-primary">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <Separator className="my-6" />

          <div className="space-y-3">
            <h2 className="font-semibold">Description:</h2>
            <p className="text-sm leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-6 flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="avatar"
                />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{product.store}</p>
                <p className="text-xs text-muted-foreground">
                  200 Kali dikunjungi
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full bg-transparent">
                Kunjungi Profile
              </Button>
              <Link
                href={"https://wa.me/62811555888"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="rounded-full bg-green-500 text-white hover:bg-green-600">
                  WhatsApp
                </Button>
              </Link>
              <Button variant="secondary" className="rounded-full">
                Instagram
              </Button>
              <Button variant="secondary" className="rounded-full">
                Tiktok
              </Button>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 font-semibold">Kami Juga Tersedia di:</p>

            <div className="flex flex-wrap items-center gap-3">
              {MARKETPLACES.map((mkt) => {
                const content = (
                  <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 hover:bg-accent transition-colors">
                    <Image
                      src={mkt.url || "/icon-marketplace.jpg"} // fallback kalau logo belum ada
                      alt={`Logo ${mkt.name}`}
                      width={28}
                      height={28}
                      className="shrink-0"
                    />
                    <span className="text-sm">{mkt.name}</span>
                  </div>
                );

                return mkt.url ? (
                  <Link
                    key={mkt.key}
                    href={mkt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={mkt.key}>{content}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <SectionHeading className="mt-12 md:mt-16" title="Ulasan Produk" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ReviewCard
          name="Regina Fitri"
          role="Pegawai Swasta"
          rating={5}
          content="Pempeknya enak banget! Teksturnya kenyal tapi lembut, sausnya gurih dan manisnya seimbang."
        />
        <ReviewCard
          name="Dinda"
          role="Food Blogger"
          rating={5}
          content="Dengan harga segini, daging rasa senak itu tuh luar biasa! Mantap!"
        />
        <ReviewCard
          name="Melani Antika"
          role="Pegawai Swasta"
          rating={4}
          content="Awalnya cuma mau coba satu, eh malah nambah lagi. Cocok buat oleh-oleh!"
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Button variant="outline" className="rounded-full bg-transparent">
          Buat Ulasan
        </Button>
        <Link href="#" className="text-sm text-primary hover:underline">
          Lihat Semua Ulasan
        </Link>
      </div>

      {/* Related products */}
      <SectionHeading
        className="mt-12 md:mt-16"
        title="Produk Lain di Toko ini"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {related.map((r) => (
          <Link key={r.id} href={`/catalog/${r.id}`} className="block">
            <ProductCard
              title={r.title}
              price={`Rp ${r.price.toLocaleString("id-ID")}`}
              image={r.image}
              store={r.store}
              location={r.location}
              imgAlt={r.title}
            />
          </Link>
        ))}
      </div>
    </Container>
  );
}
