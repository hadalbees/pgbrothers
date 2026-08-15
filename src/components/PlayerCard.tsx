import React from "react";
import { motion } from "framer-motion";
import { User, ShieldAlert } from "lucide-react";

interface PlayerCardProps {
  index: number;
}

export default function PlayerCard({ index }: PlayerCardProps) {
  // Let's create varying placeholder roles to show the UI design
  const placeholderRoles = [
    { position: "Raider", experience: "Grassroots Development" },
    { position: "Right Corner Defender", experience: "Local Tournaments" },
    { position: "All-Rounder", experience: "Junior Division" },
  ];

  const role = placeholderRoles[index % placeholderRoles.length];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card relative overflow-hidden group border border-white/5 rounded-none flex flex-col h-full bg-[#161616]/40"
    >
      {/* Visual Placeholder for Player Image */}
      <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-charcoal-medium to-charcoal flex items-center justify-center overflow-hidden border-b border-white/5">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,78,59,0.25),rgba(255,255,255,0))]" />
        
        {/* Silhouette / Icon */}
        <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center text-gold/30 bg-charcoal/50 group-hover:scale-105 group-hover:border-gold/50 group-hover:text-gold transition-all duration-500 z-10">
          <User className="w-10 h-10" />
        </div>
        
        {/* Coming Soon overlay */}
        <div className="absolute bottom-4 left-4 right-4 py-2 px-3 bg-charcoal/90 backdrop-blur-sm border border-gold/20 text-center z-20">
          <p className="text-xs font-oswald font-bold tracking-widest text-gold uppercase flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse text-gold" />
            Profile Coming Soon
          </p>
        </div>
      </div>

      {/* Info fields layout placeholder */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
            Athlete Profile {index + 1}
          </span>
          <h4 className="text-lg font-oswald font-semibold text-white/50 uppercase tracking-wide mb-4">
            Under Evaluation
          </h4>
          
          <div className="space-y-2.5 text-xs text-gray-400">
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-gray-500 uppercase tracking-wider font-medium">Position</span>
              <span className="text-gray-400 font-bold uppercase">{role.position}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-gray-500 uppercase tracking-wider font-medium">Team</span>
              <span className="text-gray-400 font-bold uppercase">To Be Announced</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-gray-500 uppercase tracking-wider font-medium">Focus</span>
              <span className="text-gray-400 font-semibold">{role.experience}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-500 text-xs italic mt-6 border-l-2 border-gold/20 pl-3">
          "Dedication in training prepares athletes for opportunities. Detailed journeys and performance statistics will be updated here."
        </p>
      </div>
    </motion.div>
  );
}
