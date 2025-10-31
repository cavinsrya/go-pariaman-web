"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductCardProps } from "@/types/product";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default function ProductCard({
  id,
  title,
  price,
  image,
  onDelete,
  onEdit,
}: ProductCardProps) {
  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow p-0 flex flex-col gap-1">
      <CardContent className="p-0">
        <div className="relative w-full aspect-3/2 bg-gray-200">
          {image ? (
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3 p-4 flex-1">
        <div className="w-full flex-1">
          <h3 className="font-semibold text-sm lg:text-lg line-clamp-2">
            {title}
          </h3>
          <p className="text-lg font-bold text-blue-900 mt-2">
            Rp {price.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1 bg-transparent text-black flex items-center justify-center hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 bg-transparent flex items-center justify-center gap-2 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
