"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitProductReview } from "../action";

interface ReviewFormProps {
  productId: number;
  onSuccess: () => void;
}

interface FormData {
  reviewerName: string;
  jobTitle: string;
  title: string;
  body: string;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [formData, setFormData] = useState<FormData>({
    reviewerName: "",
    jobTitle: "",
    title: "",
    body: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await submitProductReview(
        productId,
        formData.reviewerName,
        formData.jobTitle,
        formData.title,
        formData.body,
        rating
      );

      if (result.success) {
        toast.success("Ulasan berhasil dikirim", {
          description: "Ulasan Anda akan ditampilkan setelah disetujui.",
        });

        // Reset form
        setFormData({
          reviewerName: "",
          jobTitle: "",
          title: "",
          body: "",
        });
        setRating(5);

        onSuccess();
      } else {
        toast.error("Gagal mengirim ulasan", {
          description:
            result.error || "Terjadi kesalahan yang tidak diketahui.",
        });
      }
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error("Error", {
        description:
          "Terjadi kesalahan saat mengirim ulasan. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Input */}
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none p-1 rounded hover:bg-yellow-100 transition-colors"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Reviewer Name */}
          <div className="space-y-2">
            <Label htmlFor="reviewerName">
              Nama <span className="text-destructive">*</span>
            </Label>
            <Input
              id="reviewerName"
              name="reviewerName"
              required
              value={formData.reviewerName}
              onChange={handleInputChange}
              placeholder="Nama Anda"
              disabled={isLoading}
            />
          </div>

          {/* Job Title (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Pekerjaan (Opsional)</Label>
            <Input
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              placeholder="Pekerjaan Anda"
              disabled={isLoading}
            />
          </div>

          {/* Review Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Judul Ulasan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Judul singkat ulasan Anda"
              disabled={isLoading}
            />
          </div>

          {/* Review Body */}
          <div className="space-y-2">
            <Label htmlFor="body">
              Ulasan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="body"
              name="body"
              required
              value={formData.body}
              onChange={handleInputChange}
              placeholder="Tulis ulasan lengkap Anda di sini..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Ulasan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
