"use client";

import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Review {
  id: number;
  reviewer_name: string;
  job_title?: string;
  title: string;
  body: string;
  rating: number;
  created_at: string;
}

interface ReviewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviews: Review[];
}

export default function ReviewsDialog({
  open,
  onOpenChange,
  reviews,
}: ReviewsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Semua Ulasan ({reviews.length})</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
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
                  <p className="text-sm text-muted-foreground mb-2">
                    {review.body}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString("id-ID")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
