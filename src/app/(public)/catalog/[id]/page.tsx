import { notFound } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import MediaGallery from "../_components/media-gallery";
import StoreInfoCard from "../_components/store-info-card";
import SocialLinksSection from "../_components/social-link-section";
import ReviewsSection from "../_components/review-section";
import RelatedProducts from "../_components/related-products";
import {
  getProductDetail,
  getRelatedProducts,
  getProductReviews,
  incrementProductView,
} from "../action";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Category = { id: number; name: string };

type ProductCategoryServer =
  | { categories: Category }
  | { categories: Category[] };

type StoreUser = {
  name: string;
  avatar_url?: string | null;
};

type StoreForCard = {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
  village_name?: string | null;
  sub_district_name?: string | null;
  users?: StoreUser | null;
};

/** ---------- Helpers ---------- */
function normalizeCategories(
  pcs: ProductCategoryServer[] | undefined
): Category[] {
  if (!pcs) return [];
  const out: Category[] = [];
  for (const pc of pcs) {
    const c = pc.categories as Category | Category[];
    if (Array.isArray(c)) out.push(...c);
    else if (c) out.push(c);
  }
  return out;
}

function extractName(maybeObjOrArr: unknown): string | null {
  // handle { name: string } | [{ name: string }] | null/undefined
  if (Array.isArray(maybeObjOrArr)) {
    return (maybeObjOrArr[0] as { name?: string } | undefined)?.name ?? null;
  }
  if (maybeObjOrArr && typeof maybeObjOrArr === "object") {
    return (maybeObjOrArr as { name?: string }).name ?? null;
  }
  return null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number.parseInt(id, 10);
  if (Number.isNaN(productId) || productId <= 0) notFound();

  const product = await getProductDetail(productId);
  if (!product) notFound();

  // fire-and-forget
  incrementProductView(productId).catch(() => {});

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product.store_id, productId),
    getProductReviews(productId),
  ]);

  // ✅ categories aman untuk object/array
  const categories = normalizeCategories(
    product.product_categories as ProductCategoryServer[] | undefined
  );

  // ✅ store bisa array/single
  const storeObj = Array.isArray(product.stores)
    ? product.stores[0]
    : product.stores ?? null;

  // ✅ social links aman
  const socialLinks =
    (storeObj?.store_social_links ?? []).map(
      (l: { platform: string; url: string }) => ({
        platform: l.platform,
        url: l.url,
      })
    ) ?? [];

  // ✅ villages & sub_districts bisa array/single → pakai helper extractName
  const storeForInfoCard: StoreForCard | undefined = storeObj
    ? {
        id: storeObj.id,
        name: storeObj.name,
        slug: storeObj.slug,
        logo_url: storeObj.logo_url ?? null,
        village_name: extractName(storeObj.villages),
        sub_district_name: extractName(storeObj.sub_districts),
        users: Array.isArray(storeObj.users)
          ? (storeObj.users[0] as StoreUser | undefined) ?? null
          : (storeObj.users as StoreUser | null) ?? null,
      }
    : undefined;

  // ✅ related products: stores juga bisa array
  const formattedRelatedProducts = relatedProducts.map((rp) => ({
    ...rp,
    stores: Array.isArray(rp.stores) ? rp.stores[0] : rp.stores,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalog">Katalog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column - Media Gallery */}
          <div className="lg:col-span-5">
            <MediaGallery media={product.product_media || []} />
          </div>

          {/* Right Column - Product Info */}
          <div className="lg:col-span-7">
            {/* Category Badge */}
            {categories.length > 0 && (
              <div className="mb-2">
                <Badge variant="outline" className="rounded-full">
                  {categories.map((c) => c.name).join(", ")}
                </Badge>
              </div>
            )}

            {/* Product Title */}
            <h1 className="text-pretty text-2xl font-extrabold tracking-tight md:text-4xl">
              {product.title}
            </h1>

            {/* Price */}
            <p className="mt-2 text-sm text-muted-foreground">Mulai Dari</p>
            <p className="text-2xl font-bold text-primary">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            <Separator className="my-6" />

            {/* Description */}
            <div className="space-y-3">
              <h2 className="font-semibold">Deskripsi:</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Store Info */}
            <div className="py-8">
              {storeForInfoCard && <StoreInfoCard store={storeForInfoCard} />}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <SocialLinksSection socialLinks={socialLinks} />
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-8">
          <ReviewsSection
            productId={productId}
            reviews={reviews}
            totalReviews={reviews.length}
          />
        </div>

        {/* Related Products */}
        {formattedRelatedProducts.length > 0 && (
          <div className="py-8">
            <RelatedProducts products={formattedRelatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
