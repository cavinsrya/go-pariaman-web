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

export const metadata = {
  title: "UMKM Pariaman | Detail Produk",
};

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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductDetail(slug);
  if (!product) notFound();

  const productId = product.id;

  incrementProductView(productId).catch(() => {});

  const [relatedProducts, reviews] = await Promise.all([
    getRelatedProducts(product.store_id, productId),
    getProductReviews(productId),
  ]);
  const categories = normalizeCategories(
    product.product_categories as ProductCategoryServer[] | undefined
  );

  const storeObj = Array.isArray(product.stores)
    ? product.stores[0]
    : product.stores ?? null;

  const socialLinks =
    (storeObj?.store_social_links ?? []).map(
      (l: { platform: string; url: string }) => ({
        platform: l.platform,
        url: l.url,
      })
    ) ?? [];

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

  const formattedRelatedProducts = relatedProducts.map((rp) => ({
    ...rp,
    stores: Array.isArray(rp.stores) ? rp.stores[0] : rp.stores,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
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

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MediaGallery media={product.product_media || []} />
          </div>
          <div className="lg:col-span-7">
            {categories.length > 0 && (
              <div className="mb-2">
                <Badge variant="outline" className="rounded-full">
                  {categories.map((c) => c.name).join(", ")}
                </Badge>
              </div>
            )}

            <h1 className="text-pretty text-2xl font-extrabold tracking-tight md:text-4xl">
              {product.title}
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">Mulai Dari</p>
            <p className="text-2xl font-bold text-primary">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            <Separator className="my-6" />

            <div className="space-y-3">
              <h2 className="font-semibold">Deskripsi:</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="py-8">
              {storeForInfoCard && <StoreInfoCard store={storeForInfoCard} />}
            </div>

            {socialLinks.length > 0 && (
              <SocialLinksSection socialLinks={socialLinks} />
            )}
          </div>
        </div>

        <div className="py-8">
          <ReviewsSection
            productId={productId}
            reviews={reviews}
            totalReviews={reviews.length}
          />
        </div>

        {formattedRelatedProducts.length > 0 && (
          <div className="py-8">
            <RelatedProducts products={formattedRelatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
