import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  excerpt?: string;
  imgAlt?: string;
  avatar_url?: string | null;
  name?: string | null;
  imgUrl?: string | null;
  logoUrl?: string | null;
  slug: string;
  className?: string;
};

export default function UmkmCard({
  title,
  excerpt,
  avatar_url,
  name,
  logoUrl,
  slug,
}: Props) {
  return (
    <Link href={`/store/${slug}`} className="block group h-full">
      <div className="relative flex flex-col sm:flex-row w-full bg-card shadow-md hover:shadow-xl border border-border rounded-xl overflow-hidden transition-all duration-300 ease-out h-full group-hover:border-primary/50 group-hover:-translate-y-1">
        <div className="relative p-3 sm:w-2/5 md:w-1/3 shrink-0">
          <div className="relative aspect-square sm:aspect-[3/4] rounded-lg overflow-hidden bg-muted">
            {logoUrl ? (
              <Image
                src={logoUrl || "/placeholder.svg"}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <span className="text-muted-foreground bg-muted text-sm flex items-center justify-center h-full font-medium">
                No Logo
              </span>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
          <div>
            <h4 className="mb-3 text-foreground text-lg sm:text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h4>

            <div className="mb-3 flex items-center gap-2.5">
              <div className="relative h-9 w-9 rounded-full overflow-hidden bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground ring-2 ring-border group-hover:ring-primary/50 transition-all">
                {avatar_url ? (
                  <Image
                    src={avatar_url || "/placeholder.svg"}
                    alt={name ? `Foto ${name}` : "Foto pemilik"}
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                ) : (
                  <span>
                    {(name || title)?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground/80">
                {name ?? "Tanpa Nama"}
              </span>
            </div>

            {excerpt && (
              <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
