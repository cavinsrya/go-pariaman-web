"use client";

import { useActionState } from "react";
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
import { useEffect } from "react";
import { INITIAL_STATE_UPDATE_PASSWORD } from "@/constants/auth-constant";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(
    changePassword,
    INITIAL_STATE_UPDATE_PASSWORD
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success("Password changed successfully!");
      // Reset form
      const form = document.querySelector("form") as HTMLFormElement;
      form?.reset();
    }
  }, [state.status]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Your Password</CardTitle>
        <CardDescription>
          Enter your current password and choose a new one
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Enter your current password"
              disabled={isPending}
              required
            />
            {state.errors?.currentPassword && (
              <p className="text-sm text-destructive">
                {state.errors.currentPassword[0]}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter your new password (min 8 characters)"
              disabled={isPending}
              required
            />
            {state.errors?.newPassword && (
              <p className="text-sm text-destructive">
                {state.errors.newPassword[0]}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              disabled={isPending}
              required
            />
            {state.errors?.confirmPassword && (
              <p className="text-sm text-destructive">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {/* Form Error */}
          {state.errors?._form && state.errors._form.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">
                {state.errors._form[0]}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
