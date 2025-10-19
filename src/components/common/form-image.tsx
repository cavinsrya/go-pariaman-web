import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileImage } from "lucide-react";
import { getImageData } from "@/lib/utils";
import { Preview } from "@/types/general";

export default function FormImage<T extends FieldValues>({
  form,
  name,
  label,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>

          <FieldContent>
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg object-cover">
                <AvatarImage src={preview?.displayUrl} alt="preview" />
                <AvatarFallback className="rounded-lg">
                  <FileImage className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>

              <Input
                type="file"
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                disabled={field.disabled}
                onChange={async (event) => {
                  field.onChange(event);
                  const { file, displayUrl } = getImageData(event);
                  if (file) {
                    setPreview?.({ file, displayUrl });
                  }
                }}
              />
            </div>
          </FieldContent>

          <FieldError className="text-xs">
            {fieldState.error?.message}
          </FieldError>
        </Field>
      )}
    />
  );
}
