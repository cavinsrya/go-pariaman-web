import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
};
export default function SectionHeading({ title, subtitle, className }: Props) {
  return (
    <div className={cn("mb-6 text-center md:mb-10", className)}>
      <h2 className="text-balance text-2xl font-extrabold tracking-tight md:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
