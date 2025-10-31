import {
  Controller,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Textarea } from "../../ui/textarea";

export default function FormTextarea<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  rows = 4,
  cols,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  rows?: number;
  cols?: number;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>

          <FieldContent>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              cols={cols}
              className="resize-none text-xs h-[150px]"
            />
          </FieldContent>

          <FieldError className="text-xs">
            {fieldState.error?.message}
          </FieldError>
        </Field>
      )}
    />
  );
}
