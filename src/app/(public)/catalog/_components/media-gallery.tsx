"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaItem {
  media_path: string;
  media_type: string;
  sort_order: number;
}

interface MediaGalleryProps {
  media: MediaItem[];
}

export default function MediaGallery({ media }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!media || media.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No media available</span>
      </div>
    );
  }

  const sortedMedia = [...media].sort((a, b) => a.sort_order - b.sort_order);
  const currentMedia = sortedMedia[currentIndex];
  const isVideo = currentMedia.media_type === "video";

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? sortedMedia.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === sortedMedia.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoPlay = () => setIsPlaying(true);
  const handleVideoPause = () => setIsPlaying(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrev();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl ring-1 ring-border">
        {isVideo ? (
          <>
            <video
              ref={videoRef}
              src={currentMedia.media_path}
              className="w-full h-full object-cover"
              preload="metadata"
              playsInline
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoPause}
            />

            {!isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer group"
                aria-label="Play video"
              >
                <div className="bg-white/90 rounded-full p-4 group-hover:bg-white transition-colors">
                  <Play className="w-12 h-12 text-gray-900 fill-gray-900" />
                </div>
              </button>
            )}

            {isPlaying && (
              <button
                onClick={handlePlayPause}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"
                aria-label="Pause video"
              >
                <Pause className="w-6 h-6 text-white fill-white" />
              </button>
            )}
          </>
        ) : (
          <Image
            src={currentMedia.media_path}
            alt={`Product media ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
            priority={currentIndex === 0}
            className="object-cover"
          />
        )}

        {sortedMedia.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg z-10"
              onClick={handlePrev}
              aria-label="Previous media"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg z-10"
              onClick={handleNext}
              aria-label="Next media"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10">
              {currentIndex + 1} / {sortedMedia.length}
            </div>
          </>
        )}
      </div>

      {sortedMedia.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
          {sortedMedia.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsPlaying(false);
              }}
              className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all hover:scale-105 ${
                index === currentIndex
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              aria-label={`View media ${index + 1}`}
            >
              {item.media_type === "video" ? (
                <div className="relative w-full h-full">
                  <video
                    src={item.media_path}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              ) : (
                <Image
                  src={item.media_path}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
