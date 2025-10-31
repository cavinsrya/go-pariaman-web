"use client";

import { Label } from "@/components/ui/label";
import { Preview } from "@/types/general";
import { Camera, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

interface FormImageProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  preview: Preview | undefined;
  setPreview: Dispatch<SetStateAction<Preview | undefined>>;
  type: "profile" | "cover";
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

const formatFileSize = (bytes: number): string => {
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

export default function FormImage<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPreview,
  type,
}: FormImageProps<T>) {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // ✅ Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("File tidak valid", {
        description: "Hanya file gambar yang diperbolehkan (JPG, PNG, dll)",
      });
      e.target.value = ""; // Reset input
      return;
    }

    // ✅ Validate file size (2MB max)
    if (file.size > MAX_FILE_SIZE) {
      const fileSize = formatFileSize(file.size);
      toast.error("Ukuran file terlalu besar", {
        description: `File Anda ${fileSize}. Maksimal ukuran file adalah 2 MB.`,
      });
      e.target.value = ""; // Reset input
      return;
    }

    // File valid - create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview({
        displayUrl: reader.result as string,
        file: file,
      });
      // Register file with form
      form.setValue(name, file as any, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setPreview(undefined);
    form.setValue(name, undefined as any, { shouldValidate: true });
    // Reset file input
    const fileInput = document.getElementById(name) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      {/* Info text */}
      <p className="text-xs text-muted-foreground">
        Format: JPG, PNG. Maksimal: 2 MB
      </p>

      <div
        className={`relative border-2 border-dashed rounded-lg overflow-hidden ${
          type === "cover" ? "aspect-video" : "aspect-square"
        } ${
          preview?.displayUrl
            ? "border-primary"
            : "border-gray-300 hover:border-primary"
        } transition-colors group cursor-pointer`}
      >
        {preview?.displayUrl ? (
          <>
            <Image
              src={preview.displayUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-destructive/90"
              aria-label="Hapus gambar"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Show file size if new file */}
            {preview.file && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatFileSize(preview.file.size)}
              </div>
            )}
          </>
        ) : (
          <label
            htmlFor={name}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
          >
            <Camera className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600 font-medium">
              Klik untuk unggah
            </span>
            <span className="text-xs text-gray-500 mt-1">Maks 2 MB</span>
          </label>
        )}

        <input
          id={name}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Show validation error from form */}
      {form.formState.errors[name] && (
        <p className="text-sm text-destructive">
          {form.formState.errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}
