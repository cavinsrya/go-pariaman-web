"use client";

import DialogDelete from "@/components/common/dashboard/dialog-delete"; // Komponen generik Anda
import { startTransition, useActionState, useEffect, useRef } from "react";
import { deleteProduct } from "../action";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant"; // State generik
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

    // 3. Kirim SEMUA path media yang ada agar bisa dihapus di server
    currentData.product_media?.forEach((media: ProductMedia) => {
      formData.append("media_paths", media.media_path);
    });

    startTransition(() => {
      deleteProductAction(formData);
    });
  };

  const previousStatusRef = useRef(deleteProductState?.status); // Lacak status sebelumnya

  useEffect(() => {
    // Hanya jalankan jika status BERUBAH dan BUKAN lagi 'idle'
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
    // Selalu update status sebelumnya di akhir efek
    previousStatusRef.current = deleteProductState?.status;
  }, [deleteProductState, handleChangeAction, refetch]);
  return (
    // Render komponen DialogDelete generik
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isPendingDeleteProduct}
      onSubmit={onSubmit}
      title="Produk" // 5. Sesuaikan title
    />
  );
}
