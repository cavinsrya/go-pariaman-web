"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import useDataTable from "@/hooks/use-data-table";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PlusCircle, AlertCircle } from "lucide-react";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { getCategories, getProductsForUser } from "../action";
import ProductCard from "./product-card";
import DialogCreateProduct from "./dialog-create-product";
import { ProductQueryResult } from "@/types/product";
import PaginationDataTable from "@/components/common/dashboard/pagination-data-table";
import DialogUpdateProduct from "./dialog-update-product";
import DialogDeleteProduct from "./dialog-delete-product";

export default function ProductsManagement() {
  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangeLimit,
    handleChangePage,
    handleChangeSearch,
  } = useDataTable({ defaultLimit: 8 });

  // State for Update/Delete dialogs
  const [selectedAction, setSelectedAction] = useState<{
    data: ProductQueryResult;
    type: "update" | "delete";
  } | null>(null);

  // Query untuk Products dengan caching
  const {
    data: productsResult,
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
    isError: isErrorProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products", currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      const result = await getProductsForUser({
        currentPage,
        currentLimit,
        currentSearch,
      });

      // Return result directly, let error handling happen outside
      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    staleTime: 30000, // ✅ Cache for 30 seconds
    gcTime: 300000, // ✅ Keep in cache for 5 minutes
    retry: 1,
  });

  // Query untuk Categories dengan caching
  const {
    data: categoriesResult,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategories();
      if (!result || result.length === 0) {
        throw new Error("Kategori tidak ditemukan");
      }
      return result;
    },
    staleTime: 600000, // ✅ Categories rarely change - cache 10 minutes
    gcTime: 3600000, // ✅ Keep for 1 hour
    retry: 2,
  });

  // ✅ Handle errors with useEffect instead of onError
  useEffect(() => {
    if (isErrorProducts && productsError) {
      toast.error("Gagal mengambil data produk", {
        description: productsError.message,
      });
    }
  }, [isErrorProducts, productsError]);

  useEffect(() => {
    if (categoriesError) {
      toast.error("Gagal mengambil data kategori", {
        description: categoriesError.message,
      });
    }
  }, [categoriesError]);

  // ✅ Stable callbacks with useCallback
  const handleChangeAction = useCallback((open: boolean) => {
    if (!open) {
      setSelectedAction(null);
    }
  }, []);

  const handleEditClick = useCallback((product: ProductQueryResult) => {
    setSelectedAction({ data: product, type: "update" });
  }, []);

  const handleDeleteClick = useCallback((product: ProductQueryResult) => {
    setSelectedAction({ data: product, type: "delete" });
  }, []);

  // ✅ Memoized total pages calculation
  const totalPages = useMemo(() => {
    if (!productsResult?.count) return 0;
    return Math.ceil(productsResult.count / currentLimit);
  }, [currentLimit, productsResult?.count]);

  // ✅ Memoized products data
  const products = useMemo(() => {
    return productsResult?.data || [];
  }, [productsResult?.data]);

  // ✅ Memoized categories with fallback
  const categories = useMemo(() => {
    return categoriesResult || [];
  }, [categoriesResult]);

  return (
    <div className="w-full container mx-auto py-8 bg-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row mb-6 gap-4 justify-between items-center w-full">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">My Products</h1>
          <span className="text-muted-foreground">
            Kelola daftar produk Anda: tambah, ubah, atau hapus dengan mudah.
          </span>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Cari berdasarkan nama..."
            onChange={(e) => handleChangeSearch(e.target.value)}
            className="flex-1 md:flex-initial md:w-64"
          />

          {/* Create Product Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 shadow-lg shadow-teal-500/50 rounded-lg font-bold py-2 cursor-pointer shrink-0">
                <PlusCircle className="w-4 h-4" />
                Upload Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Buat Produk Baru</DialogTitle>
              </DialogHeader>

              {isLoadingCategories ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-blue-900" />
                  <span className="ml-2 text-muted-foreground">
                    Memuat kategori...
                  </span>
                </div>
              ) : categories.length > 0 ? (
                <DialogCreateProduct
                  categories={categories}
                  refetch={refetchProducts}
                />
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  Kategori tidak ditemukan atau gagal dimuat.
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Products Grid */}
      {isLoadingProducts ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-900" size={40} />
          <span className="ml-3 text-lg text-muted-foreground">
            Memuat produk...
          </span>
        </div>
      ) : isErrorProducts ? (
        <div className="flex flex-col items-center justify-center h-64 text-destructive bg-destructive/10 rounded-lg p-4">
          <AlertCircle className="w-12 h-12 mb-2" />
          <p className="font-semibold">Gagal memuat data produk.</p>
          <p className="text-sm">Silakan coba lagi nanti.</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product: ProductQueryResult) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              image={product.product_media?.[0]?.media_path}
              onDelete={() => handleDeleteClick(product)}
              onEdit={() => handleEditClick(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-16">
          Tidak ada produk ditemukan
          {currentSearch && ` untuk "${currentSearch}"`}.
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationDataTable
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={handleChangePage}
        />
      )}

      {/* Update Dialog */}
      <DialogUpdateProduct
        open={selectedAction?.type === "update"}
        refetch={refetchProducts}
        currentData={
          selectedAction?.type === "update" ? selectedAction.data : undefined
        }
        categories={categories}
        handleChangeAction={handleChangeAction}
      />

      {/* Delete Dialog */}
      <DialogDeleteProduct
        open={selectedAction?.type === "delete"}
        refetch={refetchProducts}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
