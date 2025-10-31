"use client";

import {
  CreateProductForm,
  createProductSchema,
} from "@/validations/product.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  startTransition,
  useActionState,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useForm } from "react-hook-form";
import { createProduct } from "../action";
import { toast } from "sonner";
import { Category, ProductFormState } from "@/types/product";
import FormProduct from "./form-product";

const INITIAL_STATE_CREATE_PRODUCT: ProductFormState = {
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

const INITIAL_CREATE_PRODUCT_FORM: CreateProductForm = {
  title: "",
  description: "",
  price: "",
  category_ids: [],
  media: [],
};

export default function DialogCreateProduct({
  refetch,
  categories,
}: {
  refetch: () => void;
  categories: Category[];
}) {
  const form = useForm<CreateProductForm>({
    resolver: zodResolver(createProductSchema),
    defaultValues: INITIAL_CREATE_PRODUCT_FORM,
  });

  const [createProductState, createProductAction, isPendingCreateProduct] =
    useActionState(createProduct, INITIAL_STATE_CREATE_PRODUCT);

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  // ✅ Optimized: Use useCallback for stable reference
  const handleMediaChange = useCallback(
    (files: File[]) => {
      // ✅ Fixed: Proper type assertion (no 'any')
      form.setValue("media", files, { shouldValidate: true });
      setMediaFiles(files);
    },
    [form]
  );

  const onSubmit = form.handleSubmit(
    (data) => {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);

      data.category_ids.forEach((id) => {
        formData.append("category_ids", id);
      });

      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      startTransition(() => {
        createProductAction(formData);
      });
    },
    (errors) => {
      console.error("Client-side validation errors:", errors);
      toast.error("Form tidak valid, periksa kembali isian Anda.");
    }
  );

  useEffect(() => {
    if (createProductState?.status === "error") {
      toast.error("Gagal Membuat Produk", {
        description: createProductState.errors?._form?.[0],
      });
    }

    if (createProductState?.status === "success") {
      toast.success("Produk Berhasil Dibuat");
      form.reset();
      setMediaFiles([]);

      // ✅ Better dialog closing - find and click the close button
      const closeButton = document.querySelector<HTMLButtonElement>(
        '[role="dialog"] button[aria-label="Close"]'
      );
      if (closeButton) {
        closeButton.click();
      }

      refetch();
    }
  }, [createProductState, form, refetch]);

  return (
    <FormProduct
      form={form}
      onSubmit={onSubmit}
      isLoading={isPendingCreateProduct}
      type="Create"
      categories={categories}
      onMediaChange={handleMediaChange}
      existingMedia={[]}
      onDeleteExistingMedia={() => {}}
    />
  );
}
