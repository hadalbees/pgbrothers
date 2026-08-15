import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AchievementCardProps {
  imageSrc: string;
  category: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function AchievementCard({
  imageSrc,
  category,
  title,
  description,
  onClick,
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={onClick}
      className="group relative overflow-hidden aspect-[4/3] w-full border border-white/5 cursor-pointer"
    >
      {/* Background image with hover zoom */}
      <Image
        src={imageSrc}
        alt={title}
        fill
        sizes="(max-w-768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-[0.75] contrast-[1.05] group-hover:brightness-[0.85]"
      />

      {/* Dark overlay with gold accent line on bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Text Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <span className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1.5 opacity-95">
          {category}
        </span>
        <h4 className="text-xl font-oswald font-bold text-white uppercase tracking-wide leading-tight group-hover:text-gold transition-colors">
          {title}
        </h4>
        <p className="text-gray-300 text-xs mt-1.5 line-clamp-2 font-light max-w-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
