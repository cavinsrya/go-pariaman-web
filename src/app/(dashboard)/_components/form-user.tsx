import FormImage from "@/components/common/dashboard/form-image";
import FormInput from "@/components/common/dashboard/form-input";
import FormSelect from "@/components/common/dashboard/form-select";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROLE_LIST } from "@/constants/auth-constant";
import { Preview } from "@/types/general";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormUser<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
  preview,
  setPreview,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
  preview?: Preview;
  setPreview?: (preview: Preview) => void;
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{type} User</DialogTitle>
        <DialogDescription>
          {type === "Create"
            ? "Daftarkan User Baru Disini"
            : "Update Data User Disini"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        {type === "Create" && (
          <FormInput
            form={form}
            name={"email" as Path<T>}
            label="Email"
            placeholder="Masukan Email disini"
            type="email"
          />
        )}
        <FormInput
          form={form}
          name={"name" as Path<T>}
          label="Name"
          placeholder="Masukan Nama Pemilik Akun"
        />
        <FormSelect
          form={form}
          name={"role" as Path<T>}
          label="Role"
          selectItem={ROLE_LIST}
        />
        {type === "Create" && (
          <FormInput
            form={form}
            name={"password" as Path<T>}
            label="Password"
            placeholder="******"
            type="password"
          />
        )}
        <DialogFooter className="flex gap-2">
          <DialogClose asChild className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="w-full flex-1 bg-blue-900 text-white font-bold"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : type}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
