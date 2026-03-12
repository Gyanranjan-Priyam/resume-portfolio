"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselImage {
  src: string;
  tag: string;
  isRight: boolean;
}

export function ImageCarousel({
  images,
  title,
}: {
  images: CarouselImage[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const scrollTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, total - 1));
      setCurrent(clamped);
      trackRef.current?.children[clamped]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    },
    [total]
  );

  const prev = () => scrollTo(current - 1);
  const next = () => scrollTo(current + 1);

  // Auto-slide
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => {
        const nextIdx = prev >= total - 1 ? 0 : prev + 1;
        trackRef.current?.children[nextIdx]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
        return nextIdx;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Array.from(track.children).indexOf(
              entry.target as HTMLElement
            );
            if (idx !== -1) setCurrent(idx);
          }
        }
      },
      { root: track, threshold: 0.6 }
    );

    Array.from(track.children).forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  const isVideo = (src: string) =>
    src.endsWith(".mp4") || src.endsWith(".webm");

  return (
    <div className="group/carousel relative overflow-hidden rounded-xl border bg-muted">
      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-video w-full shrink-0 snap-center"
          >
            {isVideo(img.src) ? (
              <video
                src={img.src}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={img.src}
                alt={`${title} screenshot ${i + 1}`}
                fill
                className={
                  img.tag === "small" ? "object-contain" : "object-cover"
                }
                sizes="(max-width: 768px) 100vw, 768px"
              />
            )}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow-md backdrop-blur-sm transition-all hover:bg-background disabled:pointer-events-none disabled:opacity-0 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={next}
            disabled={current === total - 1}
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1.5 shadow-md backdrop-blur-sm transition-all hover:bg-background disabled:pointer-events-none disabled:opacity-0 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}

      {/* Counter */}
      {total > 1 && (
        <span className="absolute top-3 right-3 z-10 rounded-full bg-background/70 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
          {current + 1} / {total}
        </span>
      )}
    </div>
  );
}
