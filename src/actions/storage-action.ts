"use server";

import { v2 as cloudinary, type UploadApiResponse, type UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getPublicIdFromUrl(fileUrl: string): string | null {
  try {
    if (!fileUrl.includes("cloudinary")) return fileUrl;

    const parts = fileUrl.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) return null;

    const pathParts = parts.slice(uploadIndex + 2);
    const fileNameWithExt = pathParts.join("/");
    const fileName = fileNameWithExt.replace(/\.[^/.]+$/, "");

    return fileName;
  } catch (error) {
    console.error("Error parsing public_id:", error);
    return null;
  }
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  prevUrl?: string
) {
  try {
    if (prevUrl) {
      await deleteFile(bucket, prevUrl);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resourceType = file.type.startsWith("video/") ? "video" : "image";

    const folderName = bucket ? `${bucket}/${path}` : path;
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, "_");
    const publicId = `${Date.now()}_${cleanFileName}`;

    const result = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
          public_id: publicId,
          resource_type: resourceType,
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    if (!result) {
        throw new Error("Upload gagal: Tidak ada respons dari Cloudinary");
    }

    return {
      status: "success",
      data: {
        url: result.secure_url,
        path: result.public_id,
      },
    };

  } catch (error: unknown) { 
    console.error("Cloudinary upload error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Gagal mengunggah file";

    return {
      status: "error",
      errors: {
        _form: [errorMessage],
      },
    };
  }
}

export async function deleteFile(bucket: string, pathOrUrl: string) {
  try {
    const publicId = getPublicIdFromUrl(pathOrUrl);

    if (!publicId) {
      console.log("Invalid file path/url for deletion:", pathOrUrl);
      return { status: "error", errors: { _form: ["Invalid file path"] } };
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image", 
    });

    console.log(`Deleted ${publicId}:`, result);

    return {
      status: "success",
    };
  } catch (error: unknown) { 
    console.error("Cloudinary delete error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus file";

    return {
      status: "error",
      errors: {
        _form: [errorMessage],
      },
    };
  }
}