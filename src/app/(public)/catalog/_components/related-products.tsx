"use client";

import CatalogProductCard from "./catalog-product-card";

interface RelatedProduct {
  id: number;
  title: string;
  price: number;
  slug: string;
  stores: {
    name: string;
    slug: string;
    sub_districts?: { name: string } | null;
    villages?: { name: string } | null;
  } | null;
  product_media: { media_path: string; media_type: string }[];
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  const getLocationDisplay = (product: RelatedProduct): string => {
    const store = product.stores;
    if (!store) return "Kota Pariaman";

    const village = store.villages?.name;
    const subDistrict = store.sub_districts?.name;

    if (village && subDistrict) {
      return `${village}, ${subDistrict}`;
    }
    if (village) {
      return village;
    }
    if (subDistrict) {
      return subDistrict;
    }
    return "Kota Pariaman";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Produk Lain di Toko Ini</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const firstImage = product.product_media?.[0]?.media_path;

          return (
            <CatalogProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={firstImage}
              storeName={product.stores?.name || "Nama Toko"}
              storeSlug={product.stores?.slug || ""}
              location={getLocationDisplay(product)}
            />
          );
        })}
      </div>
    </div>
  );
}
