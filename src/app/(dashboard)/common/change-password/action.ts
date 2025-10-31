"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import { changePasswordSchema } from "@/validations/auth.validation";
import { revalidatePath } from "next/cache";

export async function changePassword(
  prevState: AuthFormState,
  formData: FormData
) {
  const validatedFields = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["User not found"],
      },
    };
  }

  // Verify current password by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: validatedFields.data.currentPassword,
  });

  if (signInError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Current password is incorrect"],
      },
    };
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: validatedFields.data.newPassword,
  });

  if (updateError) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [updateError.message],
      },
    };
  }

  revalidatePath("/", "layout");

  return {
    status: "success",
  };
}
