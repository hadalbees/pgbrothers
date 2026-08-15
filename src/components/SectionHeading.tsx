import React from "react";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({
  badge,
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 md:mb-16 max-w-3xl ${
        centered ? "mx-auto text-center" : "text-left"
      }`}
    >
      {badge && (
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-gold mb-3 px-3 py-1 bg-forest-medium/30 border border-gold/10 rounded-full">
          {badge}
        </span>
      )}
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-oswald font-bold tracking-tight text-white uppercase leading-none">
        {title}
      </h2>
      <div
        className={`h-[3px] bg-gradient-to-r from-gold via-forest-medium to-transparent w-24 mt-4 mb-5 ${
          centered ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
