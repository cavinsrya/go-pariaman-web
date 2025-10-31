import { ProductFormState } from "@/types/product";

export const PRODUCT_MEDIA_TYPES = {
  image: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  video: ["video/mp4", "video/webm", "video/ogg"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_MEDIA_COUNT = 5;

export const INITIAL_STATE_DELETE_PRODUCT: ProductFormState = {
  status: "idle",
  errors: { _form: [] },
};
