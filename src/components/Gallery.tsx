"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2, Trash2, Edit2, Plus } from "lucide-react";
import { useEditableImages, compressImage } from "@/context/ImageContext";
import { GalleryImage } from "@/utils/db";

const categories = ["ALL", "PLAYERS", "TEAMS", "TOURNAMENTS", "TROPHIES", "COMMUNITY"];

export default function Gallery() {
  const { gallery, updateGalleryImages, isAdmin } = useEditableImages();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(gallery);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // State for editing image details
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  
  // Touch coordinates for mobile swipe
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (activeCategory === "ALL") {
      setFilteredImages(gallery);
    } else {
      setFilteredImages(
        gallery.filter((img) => img.categories.includes(activeCategory))
      );
    }
  }, [activeCategory, gallery]);

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
      {/* Admin upload section */}
      {isAdmin && (
        <div className="mb-8 p-6 border border-dashed border-gold/20 bg-charcoal/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-oswald font-bold text-white uppercase tracking-wider">
              Gallery Administration
            </h4>
            <p className="text-xs text-gray-400 font-light mt-1">
              Select multiple photos to upload. Added photos will scale and display instantly.
            </p>
          </div>
          <button
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.accept = "image/*";
              input.onchange = async (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files && files.length > 0) {
                  const newImages = [...gallery];
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    try {
                      const base64 = await compressImage(file);
                      newImages.push({
                        src: base64,
                        title: file.name.substring(0, file.name.lastIndexOf('.')) || file.name,
                        description: "Uploaded image via P.G. Brothers admin portal.",
                        categories: ["ALL", activeCategory !== "ALL" ? activeCategory : "COMMUNITY"],
                      });
                    } catch (err) {
                      console.error("Compression error:", err);
                    }
                  }
                  await updateGalleryImages(newImages);
                }
              };
              input.click();
            }}
            className="px-4 py-2 bg-gold hover:bg-white text-charcoal text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Upload Photo(s)
          </button>
        </div>
      )}

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
            const globalIndex = gallery.findIndex((gImg) => gImg.src === img.src);
            
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

                {/* Admin overlay edit/delete buttons */}
                {isAdmin && (
                  <div className="absolute top-3 right-3 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingImage(img);
                        setEditingImageIndex(globalIndex);
                      }}
                      className="p-2 bg-charcoal/90 hover:bg-gold text-white hover:text-charcoal border border-white/10 hover:border-gold cursor-pointer transition-colors"
                      title="Edit Photo Info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to remove this photo from the gallery?")) {
                          const newGallery = gallery.filter((g) => g.src !== img.src);
                          await updateGalleryImages(newGallery);
                        }
                      }}
                      className="p-2 bg-charcoal/90 hover:bg-red-600 text-red-500 hover:text-white border border-white/10 hover:border-red-600 cursor-pointer transition-colors"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

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
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
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
                className="p-2 hover:bg-white/5 border border-white/10 hover:border-gold/30 hover:text-gold text-white transition-colors duration-300 focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Main Image & Navigation */}
            <div className="flex-grow flex items-center justify-center relative w-full h-[60vh] max-h-[80vh] my-4 select-none">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 p-3 bg-charcoal/70 border border-white/5 hover:border-gold/30 text-white hover:text-gold z-10 transition-colors focus:outline-none cursor-pointer"
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
                className="absolute right-2 md:right-4 p-3 bg-charcoal/70 border border-white/5 hover:border-gold/30 text-white hover:text-gold z-10 transition-colors focus:outline-none cursor-pointer"
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

      {/* EDIT GALLERY IMAGE METADATA MODAL */}
      {editingImage !== null && editingImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-charcoal border border-gold/30 p-8 relative shadow-2xl">
            <button
              onClick={() => {
                setEditingImage(null);
                setEditingImageIndex(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-wider mb-6">
              Edit Image Details
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const newGallery = [...gallery];
                newGallery[editingImageIndex] = editingImage;
                await updateGalleryImages(newGallery);
                setEditingImage(null);
                setEditingImageIndex(null);
              } catch (err) {
                alert("Error saving gallery metadata");
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Image Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingImage.title || ""}
                    onChange={(e) => setEditingImage({...editingImage, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors animate-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingImage.description || ""}
                    onChange={(e) => setEditingImage({...editingImage, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["PLAYERS", "TEAMS", "TOURNAMENTS", "TROPHIES", "COMMUNITY"].map((cat) => {
                      const hasCat = editingImage.categories.includes(cat);
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => {
                            let newCats = [...editingImage.categories];
                            if (hasCat) {
                              newCats = newCats.filter((c) => c !== cat);
                            } else {
                              newCats.push(cat);
                            }
                            // Always ensure 'ALL' is set if it has categories, otherwise fallback
                            if (!newCats.includes("ALL")) {
                              newCats.push("ALL");
                            }
                            setEditingImage({ ...editingImage, categories: newCats });
                          }}
                          className={`px-3 py-1.5 text-[10px] font-bold tracking-wider transition-all duration-300 uppercase cursor-pointer ${
                            hasCat
                              ? "bg-gold text-charcoal border border-gold"
                              : "bg-black/50 text-gray-400 border border-white/10 hover:border-gold/30"
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-gold text-charcoal font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 text-xs cursor-pointer"
                >
                  Save Info
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingImage(null);
                    setEditingImageIndex(null);
                  }}
                  className="px-6 py-3 bg-transparent hover:bg-white/5 text-white border border-white/10 hover:border-white font-bold uppercase tracking-widest transition-colors duration-300 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
