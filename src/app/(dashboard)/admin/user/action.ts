"use server";

import { deleteFile } from "@/actions/storage-action";
import { createClient } from "@/lib/supabase/server";
import { AuthFormState } from "@/types/auth";
import {
  createUserSchema,
  updateUserSchema,
  changePasswordUserManagementSchema,
} from "@/validations/auth.validation";

export async function createUser(prevState: AuthFormState, formData: FormData) {
  const validatedFields = createUserSchema.safeParse({
    email: formData.get("email"),
    name: formData.get("name"),
    password: formData.get("password"),
    role: formData.get("role"),
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

  const { error } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      data: {
        name: validatedFields.data.name,
        role: validatedFields.data.role,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function updateUser(prevState: AuthFormState, formData: FormData) {
  const validatedFields = updateUserSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
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

  const { error } = await supabase
    .from("users")
    .update({
      name: validatedFields.data.name,
      role: validatedFields.data.role,
      avatar_url: validatedFields.data.avatar_url,
    })
    .eq("id", formData.get("id"));

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function changePassword(prevState: AuthFormState, formData: FormData) {
  const validatedFields = changePasswordUserManagementSchema.safeParse({
    password: formData.get("password"),
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

  if (validatedFields.data.password !== validatedFields.data.confirmPassword) {
    return {
      status: "error",
      errors: {
        confirmPassword: ["Password tidak cocok"],
        _form: [],
      },
    };
  }

  const supabase = await createClient({ isAdmin: true });
  const userId = formData.get("id") as string;

  const { error } = await supabase.auth.admin.updateUserById(userId, {
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}

export async function deleteUser(prevState: AuthFormState, formData: FormData) {
  const supabase = await createClient({ isAdmin: true });
  const image = formData.get("avatar_url") as string;
  const { status, errors } = await deleteFile(
    "images",
    image.split("/images/")[1]
  );

  if (status === "error") {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [errors?._form?.[0] ?? "Unknown error"],
      },
    };
  }

  const { error } = await supabase.auth.admin.deleteUser(
    formData.get("id") as string
  );

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return { status: "success" };
}