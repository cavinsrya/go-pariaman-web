"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import FilterSidebar from "./_components/filter-sidebar";
import CatalogProductCard from "./_components/catalog-product-card";
import CatalogPagination from "./_components/catalog-pagination";
import ProductCardSkeleton from "./_components/product-card-skeleton";
import { getCatalogFilters, getCatalogProducts } from "./action";
import type { CatalogProduct } from "./action";
import { useCatalogFilters } from "@/hooks/use-catalog-filters";
import { useDebouncedCallback } from "use-debounce";

interface Filters {
  categories: Array<{ id: number; name: string }>;
  subDistricts: Array<{ id: number; name: string }>;
}

export default function CatalogPage() {
  // ✅ Use custom hook for filter state
  const filters = useCatalogFilters();

  const [catalogFilters, setCatalogFilters] = useState<Filters>({
    categories: [],
    subDistricts: [],
  });
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const limit = 10;

  // ✅ Memoized total pages
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // ✅ Load filters on mount
  useEffect(() => {
    const loadFilters = async () => {
      setIsLoadingFilters(true);
      const data = await getCatalogFilters();
      setCatalogFilters(data);
      setIsLoadingFilters(false);
    };
    loadFilters();
  }, []);

  // ✅ Debounced search to avoid too many API calls
  const debouncedSearch = useDebouncedCallback((value: string) => {
    filters.handleSearchChange(value);
  }, 500); // 500ms delay

  // ✅ Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const data = await getCatalogProducts({
          search: filters.search,
          categoryIds: filters.selectedCategories,
          subDistrictId: filters.selectedSubDistrict || undefined,
          villageId: filters.selectedVillage || undefined,
          priceSort: filters.priceSort,
          page: filters.page,
          limit,
        });

        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
        setTotal(0);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [
    filters.search,
    // ✅ Use JSON.stringify to avoid unnecessary re-renders from array reference changes
    JSON.stringify(filters.selectedCategories),
    filters.selectedSubDistrict,
    filters.selectedVillage,
    filters.priceSort,
    filters.page,
  ]);

  // ✅ Format location for display
  const getLocationDisplay = (product: CatalogProduct): string => {
    const store = product.stores;
    if (!store) return "Lokasi Tidak Diketahui";

    const village = store.villages?.name;
    const subDistrict = store.sub_districts?.name;

    if (village && subDistrict) {
      return `${village}, ${subDistrict}`;
    }
    if (subDistrict) {
      return subDistrict;
    }
    return "Kota Pariaman";
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Katalog Produk</h1>
          <p className="text-muted-foreground">
            Temukan produk berkualitas dari UMKM lokal
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Cari produk yang ingin kamu cari"
              defaultValue={filters.search}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="default"
            size="lg"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Filter className="w-5 h-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex md:gap-6">
          {/* Sidebar */}
          {!isLoadingFilters && (
            <FilterSidebar
              categories={catalogFilters.categories}
              subDistricts={catalogFilters.subDistricts}
              selectedCategories={filters.selectedCategories}
              selectedSubDistrict={filters.selectedSubDistrict}
              selectedVillage={filters.selectedVillage}
              priceSort={filters.priceSort}
              onCategoryChange={filters.handleCategoryChange}
              onSubDistrictChange={filters.handleSubDistrictChange}
              onVillageChange={filters.handleVillageChange}
              onPriceSortChange={filters.handlePriceSortChange}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Menampilkan {products.length > 0 ? "1" : "0"} -{" "}
                {Math.min(limit * filters.page, total)} dari {total} produk
              </p>
            </div>

            {/* Loading State */}
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-8">
                  {products.map((product) => (
                    <CatalogProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      price={product.price}
                      image={product.product_media[0]?.media_path}
                      mediaType={product.product_media?.[0]?.media_type}
                      storeName={product.stores?.name ?? "Nama Toko"}
                      storeSlug={product.slug ?? "#"}
                      location={getLocationDisplay(product)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <CatalogPagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={filters.setPage}
                  />
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-muted-foreground text-lg mb-2">
                  Tidak ada produk yang sesuai dengan pencarian Anda
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Coba ubah filter atau kata kunci pencarian
                </p>
                {(filters.selectedCategories.length > 0 ||
                  filters.selectedSubDistrict !== null ||
                  filters.search !== "") && (
                  <Button variant="outline" onClick={filters.resetFilters}>
                    Reset Semua Filter
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
