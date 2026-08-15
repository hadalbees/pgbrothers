"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryImage {
  src: string;
  title: string;
  description: string;
  categories: string[];
}

const categories = ["ALL", "PLAYERS", "TEAMS", "TOURNAMENTS", "TROPHIES", "COMMUNITY"];

const galleryData: GalleryImage[] = [
  {
    src: "/images/team_photo_1.jpg",
    title: "TEAM • TOGETHER",
    description: "A group of players and organizers sharing a moment of unity during a tournament.",
    categories: ["TEAMS", "TOURNAMENTS"],
  },
  {
    src: "/images/trophy_player_2.png",
    title: "VICTORY • CELEBRATION",
    description: "An athlete sitting beside a grand championship trophy with his individual 'Best Player' cup.",
    categories: ["PLAYERS", "TROPHIES", "TOURNAMENTS"],
  },
  {
    src: "/images/grassroots_support.png",
    title: "THE JOURNEY • CONTINUES",
    description: "Encouraging a young athlete with sporting gear to support his training and progression.",
    categories: ["COMMUNITY", "PLAYERS"],
  },
  {
    src: "/images/trophy_player_11.png",
    title: "VICTORY • CELEBRATION",
    description: "A player proudly celebrating a tournament victory with the championship trophy.",
    categories: ["PLAYERS", "TROPHIES", "TOURNAMENTS"],
  },
  {
    src: "/images/team_photo_2.png",
    title: "COMPETITION • COMMITMENT",
    description: "A team posing together under tournament lighting, showcasing collective unity.",
    categories: ["TEAMS", "TOURNAMENTS", "COMMUNITY"],
  },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryData);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Touch coordinates for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (activeCategory === "ALL") {
      setFilteredImages(galleryData);
    } else {
      setFilteredImages(
        galleryData.filter((img) => img.categories.includes(activeCategory))
      );
    }
  }, [activeCategory]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => 
      prev === 0 ? filteredImages.length - 1 : (prev as number) - 1
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => 
      prev === filteredImages.length - 1 ? 0 : (prev as number) + 1
    );
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="w-full">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-10 md:mb-14">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeCategory === category
                ? "bg-gold text-charcoal border border-gold"
                : "bg-charcoal border border-white/5 hover:border-gold/30 text-gray-400 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredImages.map((img, idx) => {
            // Find global index to prevent layout issues
            const globalIndex = galleryData.findIndex((gImg) => gImg.src === img.src);
            
            // Determine sizes for visual variety
            const isWide = idx === 0 || idx === 4;
            
            return (
              <motion.div
                key={img.src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`relative overflow-hidden group border border-white/5 cursor-pointer aspect-video md:aspect-square ${
                  isWide ? "md:col-span-2 lg:col-span-1" : ""
                }`}
                onClick={() => setLightboxIndex(idx)}
              >
                {/* Background image */}
                <Image
                  src={img.src}
                  alt={img.title}
                  fill
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 group-hover:brightness-75"
                />

                {/* Hover overlay details */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex gap-2 mb-1.5">
                        {img.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-[9px] font-bold tracking-widest text-gold bg-forest-medium/30 border border-gold/10 px-1.5 py-0.5 rounded-none"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-lg font-oswald font-bold text-white uppercase tracking-wide">
                        {img.title}
                      </h4>
                      <p className="text-gray-300 text-xs mt-1 line-clamp-2 max-w-sm font-light">
                        {img.description}
                      </p>
                    </div>
                    <div className="p-2 bg-gold/10 border border-gold/20 text-gold rounded-none">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between z-10 py-2">
              <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                {activeCategory} Gallery • {lightboxIndex + 1} of {filteredImages.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 hover:bg-white/5 border border-white/10 hover:border-gold/30 hover:text-gold text-white transition-colors duration-300 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Main Image & Navigation */}
            <div className="flex-grow flex items-center justify-center relative w-full h-[60vh] max-h-[80vh] my-4 select-none">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 p-3 bg-charcoal/70 border border-white/5 hover:border-gold/30 text-white hover:text-gold z-10 transition-colors focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Image Container */}
              <div className="relative w-full h-full max-w-5xl aspect-video md:aspect-auto">
                <Image
                  src={filteredImages[lightboxIndex].src}
                  alt={filteredImages[lightboxIndex].title}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 p-3 bg-charcoal/70 border border-white/5 hover:border-gold/30 text-white hover:text-gold z-10 transition-colors focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Lightbox Footer (Caption) */}
            <div className="text-center z-10 max-w-2xl mx-auto py-4">
              <h4 className="text-xl md:text-2xl font-oswald font-bold text-white uppercase tracking-wider mb-2">
                {filteredImages[lightboxIndex].title}
              </h4>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                {filteredImages[lightboxIndex].description}
              </p>
              
              <div className="flex justify-center gap-1.5 mt-4">
                {filteredImages[lightboxIndex].categories.map((c) => (
                  <span
                    key={c}
                    className="text-[9px] font-bold tracking-widest text-gold/80 px-2 py-0.5 bg-forest-medium/20 border border-gold/10 uppercase"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
