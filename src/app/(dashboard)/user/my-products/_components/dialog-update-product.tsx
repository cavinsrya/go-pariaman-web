"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  UpdateProductForm,
  updateProductSchema,
} from "@/validations/product.validation";
import { updateProduct } from "../action";
import {
  Category,
  ExistingMedia,
  ProductFormState,
  ProductQueryResult,
} from "@/types/product";
import { Dialog } from "@/components/ui/dialog";
import FormProduct from "./form-product";

const INITIAL_STATE_UPDATE_PRODUCT: ProductFormState = {
  status: "idle",
  errors: {
    title: [],
    description: [],
    price: [],
    category_ids: [],
    media: [],
    _form: [],
  },
};

export default function DialogUpdateProduct({
  refetch,
  currentData,
  open,
  handleChangeAction,
  categories,
}: {
  refetch: () => void;
  currentData?: ProductQueryResult;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
  categories: Category[];
}) {
  const form = useForm<UpdateProductForm>({
    resolver: zodResolver(updateProductSchema),
  });

  const [updateProductState, updateProductAction, isPendingUpdateProduct] =
    useActionState(updateProduct, INITIAL_STATE_UPDATE_PRODUCT);

  const [newMediaFiles, setNewMediaFiles] = useState<File[]>([]);
  const [deletedMediaPaths, setDeletedMediaPaths] = useState<string[]>([]);
  const [currentExistingMedia, setCurrentExistingMedia] = useState<
    ExistingMedia[]
  >([]);

  const previousStatusRef = useRef(updateProductState?.status);

  const onSubmit = useCallback(
    form.handleSubmit((data) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);

      data.category_ids.forEach((id) => formData.append("category_ids", id));
      newMediaFiles.forEach((file) => formData.append("media", file));
      deletedMediaPaths.forEach((path) =>
        formData.append("deleted_media_paths", path)
      );
      formData.append("id", currentData?.id.toString() ?? "");

      startTransition(() => {
        updateProductAction(formData);
      });
    }),
    [
      form,
      newMediaFiles,
      deletedMediaPaths,
      currentData?.id,
      updateProductAction,
    ]
  );

  useEffect(() => {
    if (
      updateProductState?.status !== previousStatusRef.current &&
      updateProductState?.status !== "idle"
    ) {
      if (updateProductState?.status === "error") {
        toast.error("Gagal Memperbarui Produk", {
          description: updateProductState.errors?._form?.[0],
        });
      }

      if (updateProductState?.status === "success") {
        toast.success("Produk Berhasil Diperbarui");
        form.reset();
        setNewMediaFiles([]);
        setDeletedMediaPaths([]);
        setCurrentExistingMedia([]);
        handleChangeAction?.(false);
        refetch();
      }
    }

    previousStatusRef.current = updateProductState?.status;
  }, [updateProductState, form, refetch, handleChangeAction]);

  useEffect(() => {
    if (currentData && open) {
      form.setValue("title", currentData.title || "");
      form.setValue("description", currentData.description || "");
      form.setValue("price", currentData.price?.toString() || "");

      const categoryIds =
        currentData.product_categories?.map((relation) =>
          relation.category_id.toString()
        ) || [];
      form.setValue("category_ids", categoryIds);

      setCurrentExistingMedia(currentData.product_media || []);
      setNewMediaFiles([]);
      setDeletedMediaPaths([]);
    }
  }, [currentData, open, form]);

  const handleDeleteExistingMedia = useCallback((mediaPath: string) => {
    setCurrentExistingMedia((prev) =>
      prev.filter((media) => media.media_path !== mediaPath)
    );
    setDeletedMediaPaths((prev) => [...prev, mediaPath]);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormProduct
        form={form}
        onSubmit={onSubmit}
        isLoading={isPendingUpdateProduct}
        type="Update"
        categories={categories}
        onMediaChange={setNewMediaFiles}
        existingMedia={currentExistingMedia}
        onDeleteExistingMedia={handleDeleteExistingMedia}
      />
    </Dialog>
  );
}
