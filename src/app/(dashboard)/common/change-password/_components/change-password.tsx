"use client";

import { useActionState, useEffect, useState } from "react";
import { changePassword } from "../action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { INITIAL_STATE_UPDATE_PASSWORD } from "@/constants/auth-constant";
import { CheckCircle2, Eye, EyeOff, Shield, ShieldAlert } from "lucide-react";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    INITIAL_STATE_UPDATE_PASSWORD
  );

  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRep, setShowRep] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [repPwd, setRepPwd] = useState("");

  const isMatch = repPwd.length > 0 && repPwd === newPwd;

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Password changed successfully!");
      // reset UI
      setNewPwd("");
      setRepPwd("");
      setShowCur(false);
      setShowNew(false);
      setShowRep(false);
      const form = document.querySelector("form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state.status]);

  return (
    <Card className="mx-auto w-full max-w-sm rounded-2xl border-0 shadow-lg space-y-2">
      <CardHeader className="space-y-3">
        <div className="inline-flex h-13 w-13 items-center justify-center rounded-xl text-primary bg-teal-400/10">
          <ShieldAlert color="teal" className="h-7 w-7" aria-hidden />
        </div>
        <CardTitle className="text-2xl font-bold">Change password</CardTitle>
        <CardDescription className="text-[13px] leading-relaxed">
          Halaman ini membantu Anda memperbarui kata sandi dengan aman. Masukkan
          kata sandi saat ini, lalu buat kata sandi baru
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCur ? "text" : "password"}
                placeholder="••••••••••"
                disabled={isPending}
                required
                className="h-11 rounded-xl pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCur((s) => !s)}
                className="absolute inset-y-0 right-2 inline-flex items-center justify-center p-2 text-muted-foreground hover:text-foreground"
                aria-label={showCur ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showCur ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {state.errors?.currentPassword && (
              <p className="text-sm text-destructive">
                {state.errors.currentPassword[0]}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                placeholder="hM64@&de7h"
                disabled={isPending}
                required
                className="h-11 rounded-xl pr-10"
                onChange={(e) => setNewPwd(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="absolute inset-y-0 right-2 inline-flex items-center justify-center p-2 text-muted-foreground hover:text-foreground"
                aria-label={showNew ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showNew ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {state.errors?.newPassword && (
              <p className="text-sm text-destructive">
                {state.errors.newPassword[0]}
              </p>
            )}
          </div>

          {/* Repeat New Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Ulangi Password Baru</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showRep ? "text" : "password"}
                placeholder="••••••••••"
                disabled={isPending}
                required
                className={`h-11 rounded-xl pr-10 ${isMatch ? "pr-12" : ""}`}
                onChange={(e) => setRepPwd(e.target.value)}
              />
              {/* eye toggler */}
              <button
                type="button"
                onClick={() => setShowRep((s) => !s)}
                className="absolute inset-y-0 right-2 inline-flex items-center justify-center p-2 text-muted-foreground hover:text-foreground"
                aria-label={showRep ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showRep ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>

              {/* green check when match */}
              {isMatch && (
                <CheckCircle2
                  className="absolute right-10 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-500"
                  aria-hidden
                />
              )}
            </div>
            {state.errors?.confirmPassword && (
              <p className="text-sm text-destructive">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {/* Form Error (server) */}
          {state.errors?._form?.length ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">
                {state.errors._form[0]}
              </p>
            </div>
          ) : null}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isPending}
            className="mt-1 h-11 w-full rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br font-bold"
          >
            {isPending ? "Memperbarui..." : "Ubah kata sandi"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
