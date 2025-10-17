import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import {
  Controller,
  useForm,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";
import { Input } from "../ui/input";

export default function FormInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  type = "text",
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <FieldGroup>
      <Controller
        name={name}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="gap-1 pt-4">
            <FieldLabel>{label}</FieldLabel>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete="off"
              className="resize-none text-xs"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
