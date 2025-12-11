import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col p-0">
      <CardContent className="p-0">
        <div className="relative w-full aspect-[4/3] bg-gray-200 animate-pulse" />
      </CardContent>

      <CardFooter className="flex flex-col gap-3 p-4 flex-1">
        <div className="w-full flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />

          {/* Store Name Skeleton */}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>

          {/* Location Skeleton */}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>

          {/* Price Skeleton */}
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/3 mt-2" />
        </div>
      </CardFooter>
    </Card>
  );
}
