"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { LoginForm, loginSchemaForm } from "@/validations/auth.validation";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignInForm() {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    INITIAL_STATE_LOGIN_FORM
  );

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    startTransition(() => {
      loginAction(formData);
    });
  });

  useEffect(() => {
    if (loginState?.status === "error") {
      toast.error("Login Failed", {
        description: loginState.errors?._form?.[0],
      });
      startTransition(() => {
        loginAction(null);
      });
    }
  }, [loginState, loginAction]);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-balance text-center text-2xl font-bold">
          Masuk
        </CardTitle>
        <CardDescription className="text-center">
          Selamat Datang di dashboard UMKM Pariaman Go Digital Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form id="form-rhf-demo" onSubmit={onSubmit}>
          <FormInput
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="Masukan Email Kamu"
          />
          <FormInput
            form={form}
            name="password"
            label="Password"
            type="password"
            placeholder="Masukkan kata sandi"
          />
          <CardFooter className="flex flex-col items-stretch gap-3 mt-6 p-0">
            <Button type="submit" className="w-full rounded-md">
              {isPendingLogin ? <Loader2 className="animate-spin" /> : "Masuk"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {"jika ingin terdaftar umkm silahkan hubungi contat pengelola"}
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
