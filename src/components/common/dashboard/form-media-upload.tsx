"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExistingMedia } from "@/types/product";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
} from "@/validations/product.validation";
import { ImagePlus, X, Video, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

interface FormMediaUploadProps {
  label?: string;
  maxFiles?: number;
  existingMedia?: ExistingMedia[];
  onDeleteExistingMedia?: (mediaPath: string) => void;
  onFilesChange?: (files: File[]) => void;
}

export default function FormMediaUpload({
  label = "Media Upload",
  maxFiles = 5,
  existingMedia = [],
  onDeleteExistingMedia,
  onFilesChange,
}: FormMediaUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const totalFiles =
        existingMedia.length + selectedFiles.length + files.length;

      if (totalFiles > maxFiles) {
        toast.error(`Maksimal ${maxFiles} file media`);
        return;
      }

      // Validate each file
      const validFiles: File[] = [];
      const newPreviewUrls: string[] = [];

      for (const file of files) {
        const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
        const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);

        if (!isImage && !isVideo) {
          toast.error(`${file.name}: Format tidak didukung`);
          continue;
        }

        const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
        if (file.size > maxSize) {
          const maxSizeMB = isVideo ? 50 : 5;
          toast.error(`${file.name}: Ukuran maksimal ${maxSizeMB}MB`);
          continue;
        }

        validFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...selectedFiles, ...validFiles];
        const updatedPreviews = [...previewUrls, ...newPreviewUrls];

        setSelectedFiles(updatedFiles);
        setPreviewUrls(updatedPreviews);
        onFilesChange?.(updatedFiles);
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [selectedFiles, previewUrls, existingMedia.length, maxFiles, onFilesChange]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      const updatedPreviews = previewUrls.filter((_, i) => i !== index);

      // Revoke object URL to prevent memory leak
      URL.revokeObjectURL(previewUrls[index]);

      setSelectedFiles(updatedFiles);
      setPreviewUrls(updatedPreviews);
      onFilesChange?.(updatedFiles);
    },
    [selectedFiles, previewUrls, onFilesChange]
  );

  const handleRemoveExisting = useCallback(
    (mediaPath: string) => {
      onDeleteExistingMedia?.(mediaPath);
    },
    [onDeleteExistingMedia]
  );

  const getFileType = (file: File): "image" | "video" => {
    return file.type.startsWith("video/") ? "video" : "image";
  };

  const remainingSlots = maxFiles - existingMedia.length - selectedFiles.length;
  const acceptedTypes = [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(
    ","
  );

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>

      {/* File Input Button */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={remainingSlots <= 0}
          className="w-full sm:w-auto"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Pilih Gambar/Video
        </Button>
        <span className="text-sm text-muted-foreground">
          {remainingSlots} / {maxFiles} slot tersisa
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Info */}
      <p className="text-xs text-muted-foreground">
        Format: JPG, PNG, WebP, GIF (max 5MB) | MP4, WebM, OGG, MOV (max 50MB)
      </p>

      {/* Preview Grid */}
      {(existingMedia.length > 0 || selectedFiles.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* Existing Media */}
          {existingMedia.map((media) => (
            <div key={media.media_path} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                {media.media_type === "video" ? (
                  <div className="relative w-full h-full">
                    <video
                      src={media.media_path}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={media.media_path}
                    alt="Product media"
                    fill
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveExisting(media.media_path)}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                {media.media_type === "video" ? (
                  <Video className="w-3 h-3" />
                ) : (
                  <ImageIcon className="w-3 h-3" />
                )}
              </div>
            </div>
          ))}

          {/* New Files Preview */}
          {selectedFiles.map((file, index) => {
            const fileType = getFileType(file);
            return (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                  {fileType === "video" ? (
                    <div className="relative w-full h-full">
                      <video
                        src={previewUrls[index]}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={previewUrls[index]}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                  {fileType === "video" ? (
                    <Video className="w-3 h-3" />
                  ) : (
                    <ImageIcon className="w-3 h-3" />
                  )}
                  <span className="truncate max-w-[80px]">{file.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
