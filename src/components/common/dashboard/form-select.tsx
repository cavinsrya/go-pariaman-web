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
} from "../../ui/select";
import { cn } from "@/lib/utils";

export default function FormSelect<T extends FieldValues>({
  form,
  name,
  label,
  selectItem,
  placeholder,
  disabled,
}: {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  selectItem: { value: string | number; label: string; disabled?: boolean }[];
  disabled?: boolean;
}) {
  return (
    <Controller
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => {
        // pastikan selalu string (bukan undefined/number)
        const currentValue = field.value == null ? "" : String(field.value);

        return (
          <Field>
            <FieldLabel>{label}</FieldLabel>

            <FieldContent>
              <Select
                value={currentValue}
                onValueChange={(v) => {
                  field.onChange(v);
                  field.onBlur(); // tandai touched
                }}
                disabled={disabled}
              >
                <SelectTrigger
                  className={cn("w-full", {
                    "border-destructive": !!fieldState.error,
                  })}
                >
                  <SelectValue placeholder={placeholder ?? `Pilih ${label}`} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {selectItem.map((item) => (
                      <SelectItem
                        key={String(item.value)}
                        value={String(item.value)} // <- string selalu
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

            <FieldError className="text-xs">
              {fieldState.error?.message}
            </FieldError>
          </Field>
        );
      }}
    />
  );
}
