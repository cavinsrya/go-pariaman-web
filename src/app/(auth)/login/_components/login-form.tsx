"use client";

import FormInput from "@/components/common/dashboard/form-input";
import { Button } from "@/components/ui/button";
import {
  INITIAL_LOGIN_FORM,
  INITIAL_STATE_LOGIN_FORM,
} from "@/constants/auth-constant";
import { LoginForm, loginSchemaForm } from "@/validations/auth.validation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";

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
    <div className="py-30">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl border border-gray-200">
        <div className="relative hidden lg:block lg:w-1/2 bg-cover">
          <Image
            src="https://wfluxkclddzzzcgoioeb.supabase.co/storage/v1/object/public/images/assets/login.png"
            alt="Login Illustration"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side form */}
        <div className="w-full p-8 lg:w-1/2">
          <div className="space-y-3">
            {/* Header: tombol kembali kiri, logo tetap di tengah */}
            <div className="relative flex items-center justify-center">
              <div className="absolute left-0">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-0 text-sm text-gray-600 hover:text-gray-800"
                >
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali</span>
                  </Link>
                </Button>
              </div>

              <Image
                src="https://res.cloudinary.com/dohpngcuj/image/upload/v1760430546/mainlogo_z9im0h.png"
                alt="App Logo"
                width={100}
                height={80}
                priority
                className="h-10 w-auto"
              />
            </div>

            <h2 className="text-2xl font-bold text-gray-700 text-center">
              UMKM Pariaman
            </h2>
            <p className="text-gray-600 text-center">
              Salamaik baliak! Silahkan Login untuk masuk ke Dashboard dan
              kelola konten Kamu
            </p>
          </div>

          {/* Form */}
          <form
            id="form-rhf-login"
            onSubmit={onSubmit}
            className="mt-4 space-y-2"
          >
            <FormInput
              form={form}
              name="email"
              label="Email"
              type="email"
              placeholder="Masukan Email kamu"
            />
            <FormInput
              form={form}
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
            />
            <div className="pt-2">
              <Button
                type="submit"
                className="w-full text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 shadow-lg shadow-teal-500/50 rounded-lg font-bold py-2 cursor-pointer"
                disabled={isPendingLogin}
              >
                {isPendingLogin ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </form>

          {/* Footer small link */}
          <div className="mt-4 flex items-center justify-between">
            <span className="border-b w-1/5 md:w-1/4" />
            <span className="text-xs text-gray-500 uppercase">Daftar</span>
            <span className="border-b w-1/5 md:w-1/4" />
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            Ingin mendaftarkan UMKM Anda? Silakan hubungi pengelola melalui
            kontak yang tersedia
          </p>
        </div>
      </div>
    </div>
  );
}
