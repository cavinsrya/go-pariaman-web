import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="min-h-screen bg-gray-50 p-4">{children}</div>;
}
