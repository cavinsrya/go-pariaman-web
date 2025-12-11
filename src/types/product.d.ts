import type { FieldValues, UseFormReturn, Path } from "react-hook-form";
import type { FormEvent } from "react"; 

export type ProductFormState = {
  status?: "success" | "error" | "idle";
  errors?: {
    title?: string[];
    description?: string[];
    price?: string[];
    media?: string[];
    category_ids?: string[];
    _form?: string[];
  };
};

export type Category = {
  id: number;
  name: string;
};

export type ProductMedia = {
  media_path: string;
  media_type: "image" | "video"
};


export type ProductCategoryRelation = {
  category_id: number; 
};


export type ProductQueryResult = {
  id: number;
  title: string;
  price: number;
  description: string;
  created_at: string;
  product_media: ProductMedia[];
  product_categories: ProductCategoryRelation[];
};

export type ProductWithMedia = ProductQueryResult;

export type ExistingMedia = {
  id?: number | string; 
  media_path: string;
  media_type: "image" | "video";
};

export type FormProductProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  categories: Category[];
  onMediaChange: (files: File[]) => void;
  existingMedia?: ExistingMedia[];
  onDeleteExistingMedia?: (mediaPath: string) => void;
};

type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image?: string; 
  onDelete: () => void;
  onEdit: () => void;
};

export type ProductWithMedia = ProductQueryResult; 
