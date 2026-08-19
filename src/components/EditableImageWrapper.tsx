"use client";
 
import React from "react";
import { useEditableImages } from "@/context/ImageContext";
 
export default function EditableImageWrapper({
  path,
  children,
  className = "",
  label = "Replace Image",
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
  label?: string;
}) {
  const { isAdmin, updateImageOverride, resetImageOverride, overrides } = useEditableImages();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const isOverridden = !!overrides[path];
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await updateImageOverride(path, file);
      } catch (err) {
        alert("Failed to update image. Please make sure it is a valid image file.");
      }
    }
  };
 
  return (
    <div className={`relative group/editable ${className}`}>
      {children}
      {isAdmin && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/editable:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2 z-30">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-gold hover:bg-white text-charcoal text-xs font-bold uppercase tracking-wider transition-colors duration-200 shadow-md cursor-pointer pointer-events-auto"
            >
              {label}
            </button>
            {isOverridden && (
              <button
                onClick={() => resetImageOverride(path)}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors duration-200 shadow-md cursor-pointer pointer-events-auto"
              >
                Reset
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
