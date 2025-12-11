"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReviewForm from "./review-form";
import ReviewsDialog from "./review-dialog";

interface Review {
  id: number;
  reviewer_name: string;
  job_title?: string;
  title: string;
  body: string;
  rating: number;
  created_at: string;
}

interface ReviewsSectionProps {
  productId: number;
  reviews: Review[];
  totalReviews: number;
}

export default function ReviewsSection({
  productId,
  reviews,
  totalReviews,
}: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const displayedReviews = reviews.slice(0, 3);
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Ulasan Produk</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(averageRating))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {averageRating} ({totalReviews} ulasan)
            </span>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>Buat Ulasan</Button>
      </div>

      {showForm && (
        <ReviewForm
          productId={productId}
          onSuccess={() => setShowForm(false)}
        />
      )}

      <div className="space-y-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {displayedReviews.map((review) => (
          <Card key={review.id} className="max-h-56">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold">{review.reviewer_name}</p>
                  {review.job_title && (
                    <p className="text-sm text-muted-foreground">
                      {review.job_title}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {review.title && (
                <p className="font-medium text-sm mb-1">{review.title}</p>
              )}
              <p className="text-sm text-muted-foreground">{review.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalReviews > 3 && (
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={() => setShowAllReviews(true)}
        >
          Lihat Semua Ulasan ({totalReviews})
        </Button>
      )}

      <ReviewsDialog
        open={showAllReviews}
        onOpenChange={setShowAllReviews}
        reviews={reviews}
      />
    </div>
  );
}
