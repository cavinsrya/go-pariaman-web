import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

export default function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  selectItem,
  placeholder,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  selectItem: { value: string; label: string; disabled?: boolean }[];
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <Field>
          {/* Label */}
          <FieldLabel>{label}</FieldLabel>

          {/* Input wrapper */}
          <FieldContent>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={field.disabled}
            >
              <SelectTrigger
                className={cn("w-full", {
                  "border-destructive": fieldState.error,
                })}
              >
                <SelectValue placeholder={placeholder ?? `Pilih ${label}`} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {selectItem.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                      className="capitalize"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FieldContent>

          {/* Error message */}
          <FieldError className="text-xs">
            {fieldState.error?.message}
          </FieldError>
        </Field>
      )}
    />
  );
}
