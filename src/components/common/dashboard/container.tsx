import type React from "react";
import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<{ className?: string }>;
export function Container({ className, children }: Props) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
