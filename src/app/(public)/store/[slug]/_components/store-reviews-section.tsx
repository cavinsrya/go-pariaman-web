"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Review {
  id: number;
  product_id: number;
  reviewer_name: string;
  job_title?: string;
  title?: string;
  body?: string;
  rating: number;
  created_at: string;
  products?: { title: string };
}

interface StoreReviewsSectionProps {
  reviews: Review[];
}

export default function StoreReviewsSection({
  reviews,
}: StoreReviewsSectionProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Belum ada ulasan untuk produk di toko ini
        </p>
      </div>
    );
  }

  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = (totalRating / reviews.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Ulasan Pelanggan ({reviews.length})
        </h2>

        <div className="flex items-center gap-4 mb-8 p-4 bg-muted rounded-lg">
          <div>
            <div className="flex gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={
                    i < Math.round(Number(averageRating))
                      ? "w-5 h-5 fill-yellow-400 text-yellow-400"
                      : "w-5 h-5 text-gray-300"
                  }
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {averageRating} dari 5 ({reviews.length} ulasan)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{review.reviewer_name}</p>
                  {review.job_title && (
                    <p className="text-xs text-muted-foreground">
                      {review.job_title}
                    </p>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < review.rating
                          ? "w-4 h-4 fill-yellow-400 text-yellow-400"
                          : "w-4 h-4 text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              {review.products?.title && (
                <p className="text-xs text-muted-foreground mb-2">
                  Produk: {review.products.title}
                </p>
              )}

              {review.title && (
                <p className="font-medium text-sm mb-2">{review.title}</p>
              )}

              {review.body && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {review.body}
                </p>
              )}

              <p className="text-xs text-muted-foreground mt-3">
                {new Date(review.created_at).toLocaleDateString("id-ID")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
