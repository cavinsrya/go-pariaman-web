import FormCheckbox from "@/components/common/dashboard/form-checkbox";
import FormInput from "@/components/common/dashboard/form-input";
import FormMediaUpload from "@/components/common/dashboard/form-media-upload";
import FormTextarea from "@/components/common/dashboard/form-textarea";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormProductProps } from "@/types/product";
import { Loader2 } from "lucide-react";
import { memo } from "react";
import { FieldValues, Path } from "react-hook-form";

function FormProduct<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  categories,
  onMediaChange,
  existingMedia,
  onDeleteExistingMedia,
}: FormProductProps<T>) {
  const categoryItems = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{type} Produk</DialogTitle>
        <DialogDescription>
          {type === "Create"
            ? "Tambahkan produk baru ke toko Anda"
            : "Lakukan perubahan pada produk Anda"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          form={form}
          name={"title" as Path<T>}
          label="Nama Produk"
          placeholder="Masukkan nama produk"
        />

        <FormTextarea
          form={form}
          name={"description" as Path<T>}
          label="Deskripsi Produk"
          placeholder="Masukkan deskripsi produk minimal 10 karakter"
          rows={4}
          cols={5}
        />

        <FormCheckbox
          form={form}
          name={"category_ids" as Path<T>}
          label="Kategori Produk"
          items={categoryItems}
          className="grid grid-cols-2 gap-2"
        />

        <FormInput
          form={form}
          name={"price" as Path<T>}
          label="Harga Produk"
          placeholder="Masukkan harga produk"
          type="number"
        />

        <FormMediaUpload
          label="Media (Foto/Video)"
          maxFiles={5}
          existingMedia={existingMedia}
          onDeleteExistingMedia={onDeleteExistingMedia}
          onFilesChange={onMediaChange}
        />

        <DialogFooter className="flex gap-2">
          <DialogClose asChild className="flex-1">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br text-white font-bold cursor-pointer hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              type
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

export default memo(FormProduct) as typeof FormProduct;
