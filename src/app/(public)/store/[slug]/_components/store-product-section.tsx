"use client";

import Link from "next/link";
import CatalogProductCard from "@/app/(public)/catalog/_components/catalog-product-card";

interface Product {
  id: number;
  title: string;
  price: number;
  slug: string;
  total_views: number;
  product_media: { media_path: string; media_type: string }[];
}

interface StoreProductsSectionProps {
  products: Product[];
  storeName: string;
  storeSlug: string;
}

export default function StoreProductsSection({
  products,
  storeName,
  storeSlug,
}: StoreProductsSectionProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Belum ada produk di toko ini</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Produk Toko ({products.length})</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const firstImage = product.product_media?.[0]?.media_path;
          return (
            <Link key={product.id} href={`/catalog/${product.id}`}>
              <CatalogProductCard
                id={product.id}
                title={product.title}
                price={product.price}
                image={firstImage}
                storeName={storeName}
                storeSlug={storeSlug}
                location={`${product.total_views} kunjungan`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
