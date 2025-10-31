"use client";

import { FieldValues, Path, UseFormReturn, Controller } from "react-hook-form";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type FormCheckboxGroupProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  items: {
    value: string;
    label: string;
  }[];
  className?: string;
  disabled?: boolean;
};

export default function FormCheckbox<T extends FieldValues>({
  form,
  name,
  label,
  items,
  className,
  disabled,
}: FormCheckboxGroupProps<T>) {
  return (
    <Controller
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>{label}</FieldLabel>

          <FieldContent>
            <div className={cn("gap-2", className)}>
              {items.map((item) => {
                // --- PERBAIKAN DI SINI ---
                // Secara eksplisit beri tahu TypeScript bahwa ini adalah array string
                const currentValue: string[] = Array.isArray(field.value)
                  ? field.value
                  : [];
                // --- AKHIR PERBAIKAN ---

                return (
                  <label
                    key={item.value}
                    className="flex flex-row items-start space-x-3 space-y-0 cursor-pointer"
                  >
                    <Checkbox
                      checked={currentValue.includes(item.value)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...currentValue, item.value])
                          : field.onChange(
                              // 'value' di sini sekarang otomatis bertipe 'string'
                              currentValue.filter(
                                (value) => value !== item.value
                              )
                            );
                      }}
                      disabled={field.disabled}
                    />
                    <span className="font-normal text-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item.label}
                    </span>
                  </label>
                );
              })}
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
