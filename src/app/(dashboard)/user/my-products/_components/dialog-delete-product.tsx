"use client";

import DialogDelete from "@/components/common/dashboard/dialog-delete";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { deleteProduct } from "../action";
import { toast } from "sonner";
import { ProductMedia, ProductWithMedia } from "@/types/product";
import { INITIAL_STATE_DELETE_PRODUCT } from "@/constants/product-constant";

export default function DialogDeleteProduct({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: ProductWithMedia | undefined;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const [deleteProductState, deleteProductAction, isPendingDeleteProduct] =
    useActionState(deleteProduct, INITIAL_STATE_DELETE_PRODUCT);

  const onSubmit = () => {
    if (!currentData) {
      toast.error("Data produk tidak ditemukan untuk dihapus.");
      return;
    }

    if (currentData.id === null || currentData.id === undefined) {
      toast.error("ID Produk tidak valid untuk dihapus.");
      console.error(
        "Attempted to delete product with invalid ID:",
        currentData
      );
      return;
    }

    const productIdString = currentData.id.toString();

    const formData = new FormData();
    formData.append("id", productIdString);

    currentData.product_media?.forEach((media: ProductMedia) => {
      formData.append("media_paths", media.media_path);
    });

    startTransition(() => {
      deleteProductAction(formData);
    });
  };

  const previousStatusRef = useRef(deleteProductState?.status);

  useEffect(() => {
    if (
      deleteProductState?.status !== previousStatusRef.current &&
      deleteProductState?.status !== "idle"
    ) {
      if (deleteProductState?.status === "error") {
        toast.error("Gagal Menghapus Produk", {
          description: deleteProductState.errors?._form?.[0],
        });
      }

      if (deleteProductState?.status === "success") {
        toast.success("Produk Berhasil Dihapus");
        handleChangeAction?.(false);
        refetch();
      }
    }
    previousStatusRef.current = deleteProductState?.status;
  }, [deleteProductState, handleChangeAction, refetch]);
  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteProduct}
      onSubmit={onSubmit}
      title="Produk"
    />
  );
}
