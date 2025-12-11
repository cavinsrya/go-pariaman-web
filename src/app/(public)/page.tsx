import Hero from "../_components/hero";
import InfoCtaSection from "../_components/info-cta-section";
import InfoSection from "../_components/info-section";
import ProdukUmkmSection from "../_components/product-umkm-section";
import UmkmDesaSection from "../_components/umkm-desa-section";
import { getFeaturedProducts, getFeaturedStores } from "./action";

export const metadata = {
  title: "UMKM Pariaman | Beranda",
};

export default async function Home() {
  const [storesData, productsData] = await Promise.all([
    getFeaturedStores(),
    getFeaturedProducts(),
  ]);
  return (
    <div>
      <Hero />
      <InfoSection />
      <UmkmDesaSection stores={storesData} />
      <ProdukUmkmSection products={productsData} />
      <InfoCtaSection />
    </div>
  );
}
