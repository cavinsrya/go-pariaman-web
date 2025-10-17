import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6">
      <div className="absolute top-4 right-4"></div>
      <div className="flex w-full max-w-sm flex-col gap-6">{children}</div>
    </div>
  );
}
