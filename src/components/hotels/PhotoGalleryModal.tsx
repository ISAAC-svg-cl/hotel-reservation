"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PhotoGalleryModalProps {
  images: { id?: string; url: string; alt?: string | null; sortOrder: number; isCover?: boolean }[];
  hotelName: string;
}

export function PhotoGalleryModal({ images, hotelName }: PhotoGalleryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"slideshow" | "grid">("slideshow");

  const total = images.length;

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextPhoto, prevPhoto]);

  return (
    <>
      {/* Bouton d'ouverture de la galerie */}
      <button
        onClick={() => {
          setCurrentIndex(0);
          setIsOpen(true);
        }}
        className="absolute bottom-4 right-4 bg-slate-950/85 hover:bg-slate-900 text-white backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 shadow-xl flex items-center gap-2 text-xs font-semibold transition-all hover:scale-105"
      >
        <Grid className="w-4 h-4 text-amber-400" />
        <span>Afficher toutes les photos ({total})</span>
      </button>

      {/* Modal Lightbox */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {hotelName}
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                  Galerie officielle
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Photo {currentIndex + 1} sur {total}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "slideshow" ? "grid" : "slideshow")}
              >
                {viewMode === "slideshow" ? (
                  <>
                    <Grid className="w-4 h-4 mr-1 text-amber-400" /> Vue Grille
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-4 h-4 mr-1 text-amber-400" /> Diaporama
                  </>
                )}
              </Button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="relative flex-grow flex items-center justify-center my-4 overflow-hidden">
            {viewMode === "slideshow" ? (
              <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
                {/* Previous Button */}
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 sm:left-6 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white transition-transform hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Main Image */}
                <div className="relative w-full h-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900">
                  <Image
                    src={images[currentIndex]?.url || "/images/hotels/novotel-lubumbashi/01.jpg"}
                    alt={images[currentIndex]?.alt || `Photo ${currentIndex + 1} du Novotel Lubumbashi`}
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>

                {/* Next Button */}
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 sm:right-6 z-10 p-3 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-white transition-transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            ) : (
              /* Grid View */
              <div className="w-full h-full overflow-y-auto max-h-[75vh] pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setViewMode("slideshow");
                    }}
                    className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      currentIndex === idx
                        ? "border-amber-500 scale-95 shadow-lg shadow-amber-500/20"
                        : "border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || `Photo ${idx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[10px] px-1.5 py-0.5 rounded text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Thumbnails Strip in Slideshow Mode */}
          {viewMode === "slideshow" && (
            <div className="h-16 flex items-center gap-2 overflow-x-auto py-1 border-t border-slate-800/80">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`relative w-20 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    currentIndex === idx
                      ? "border-amber-500 opacity-100 scale-105"
                      : "border-transparent opacity-40 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
