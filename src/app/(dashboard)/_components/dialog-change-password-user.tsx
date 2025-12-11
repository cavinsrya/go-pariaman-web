"use client";

import { changePassword } from "../admin/user/action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Profile } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

interface DialogChangePasswordProps {
  open: boolean;
  refetch: () => void;
  currentData: Profile | undefined;
  handleChangeAction: (open: boolean) => void;
}

export default function DialogChangePassword({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: DialogChangePasswordProps) {
  const [state, formAction, isPending] = useActionState(changePassword, {
    status: "idle",
    errors: {
      _form: [],
    },
  });

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Password berhasil diubah");
      refetch();
      handleChangeAction(false);
    }

    if (state.status === "error" && state.errors) {
      toast.error("Gagal mengubah password", {
        description: state.errors._form?.[0] || "Terjadi kesalahan",
      });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Ubah password untuk user: {currentData?.name}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="id" value={currentData?.id} />
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password Baru</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukkan password baru"
                required
              />
              {state.errors?.password && (
                <p className="text-sm text-red-500">
                  {state.errors.password[0]}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Masukkan kembali password baru"
                required
              />
              {state.errors?.confirmPassword && (
                <p className="text-sm text-red-500">
                  {state.errors.confirmPassword[0]}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleChangeAction(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
