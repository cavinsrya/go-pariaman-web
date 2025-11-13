"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Edit, Trash2, Video, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  image?: string;
  mediaType?: "image" | "video";
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({
  title,
  price,
  image,
  mediaType = "image",
  onEdit,
  onDelete,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] bg-muted">
          {image ? (
            mediaType === "video" ? (
              <div className="relative w-full h-full group">
                <video
                  src={image}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Video className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  Video
                </div>
              </div>
            ) : (
              <Image
                src={image}
                alt={title}
                fill
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{title}</h3>
        <p className="text-xl font-bold text-blue-900">{formatPrice(price)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
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
          className="flex-1 bg-transparent flex items-center justify-center gap-2 text-black hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 cursor-pointer"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
