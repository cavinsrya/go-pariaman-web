import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getStoreData,
  type ProductForStore,
  type ReviewForStore,
  type StoreSocialLink,
} from "./action";
import CatalogProductCard from "@/app/(public)/catalog/_components/catalog-product-card";

export default async function StoreProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await getStoreData(slug);
  if (!data) notFound();

  const { store, products, reviews } = data;

  const owner = store.users;
  const villageName = store.villages?.name ?? undefined;
  const subDistrictName = store.sub_districts?.name ?? undefined;
  const districtName = store.districts?.name ?? undefined;
  const socialLinks: StoreSocialLink[] = store.store_social_links ?? [];

  const locationParts = [villageName, subDistrictName, districtName].filter(
    (v): v is string => Boolean(v)
  );
  const locationString = locationParts.join(", ") || "Lokasi tidak tersedia";

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce<number>(
            (sum, r: ReviewForStore) => sum + r.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalog">Katalog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{store.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Store Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Cover */}
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
            {store.cover_url && (
              <Image
                src={store.cover_url || "/placeholder.svg"}
                alt={store.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* Store Info Card */}
          <div className="bg-background rounded-lg shadow-lg p-6 md:p-8 -mt-20 relative z-10">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              {/* Logo */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border-4 border-background shadow-md">
                {store.logo_url && (
                  <Image
                    src={store.logo_url || "/placeholder.svg"}
                    alt={store.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {store.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{locationString}</span>
                  </div>
                  {store.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{store.phone}</span>
                    </div>
                  )}
                </div>
                {store.description && (
                  <p className="text-muted-foreground line-clamp-2">
                    {store.description}
                  </p>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-sm font-semibold mb-3">
                    Temukan kami di:
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary"
                      >
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">
          Produk Toko ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="text-muted-foreground">Belum ada produk</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product: ProductForStore) => {
              return (
                <CatalogProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.product_media[0]?.media_path}
                  storeName={store.name}
                  storeSlug={product.slug}
                  location={locationString}
                  mediaType={product.product_media?.[0]?.media_type}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-bold mb-6">
          Ulasan Pelanggan ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">Belum ada ulasan</p>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(avgRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {avgRating} dari 5 ({reviews.length} ulasan)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review: ReviewForStore) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold">{review.reviewer_name}</p>
                        {review.job_title && (
                          <p className="text-xs text-muted-foreground">
                            {review.job_title}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && (
                      <p className="font-medium text-sm mb-2">{review.title}</p>
                    )}
                    {review.body && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {review.body}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(review.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
