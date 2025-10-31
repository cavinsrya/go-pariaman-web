import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Store } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  image?: string | null;
  title: string;
  price: number;
  store?: string | null;
  location?: string | null;
  imgAlt?: string;
  slug: string;
  storeSlug?: string;
};

const InfoRow = ({
  icon: Icon,
  text,
}: {
  icon: React.ElementType<LucideProps>;
  text?: string | null;
}) => {
  if (!text) return null;
  return (
    <div className="flex flex-row gap-1 items-center group/info">
      <Icon className="size-2.5 sm:size-3 text-muted-foreground flex-shrink-0 group-hover/info:text-primary transition-colors" />
      <span className="text-[10px] sm:text-[10px] text-muted-foreground line-clamp-1 group-hover/info:text-foreground transition-colors">
        {text}
      </span>
    </div>
  );
};

export default function ProductCard({
  title,
  image,
  price,
  store,
  location,
  imgAlt = "Gambar Produk",
  slug,
  storeSlug,
}: ProductCardProps) {
  const finalImageUrl = image || "/placeholder.svg?height=400&width=400";

  return (
    <Link href={`/catalog/${slug}`} className="block group h-full">
      <Card
        className={cn(
          "w-full overflow-hidden rounded-lg shadow-md border-border p-0",
          "h-full flex flex-col",
          "transition-all duration-300 ease-out hover:shadow-xl hover:border-primary/10 hover:-translate-y-1 cursor-pointer"
        )}
      >
        <CardContent className="p-0 relative overflow-hidden">
          <div className="relative aspect-square w-full bg-muted">
            <Image
              src={finalImageUrl || "/placeholder.svg"}
              alt={imgAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </CardContent>

        <CardFooter className="p-2.5 sm:p-3 flex flex-col items-start gap-1.5 sm:gap-2 flex-1 bg-card">
          <h3 className="text-xs sm:text-sm font-semibold line-clamp-2 w-full group-hover:text-primary transition-colors leading-snug">
            {title}
          </h3>

          <div className="space-y-0.5 sm:space-y-1 w-full">
            <InfoRow icon={Store} text={store} />
            <InfoRow icon={MapPin} text={location} />
          </div>

          <div className="mt-auto w-full pt-2 border-t border-border/50">
            <p className="text-xs sm:text-sm font-bold text-primary text-right">
              Rp {price.toLocaleString("id-ID")}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
