import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Edit2, Trash2 } from "lucide-react";
import { useEditableImages } from "@/context/ImageContext";
import { PlayerProfile } from "@/utils/db";

interface PlayerCardProps {
  player: PlayerProfile;
  index: number;
  onEdit?: (player: PlayerProfile) => void;
  onDelete?: (id: string) => void;
}

export default function PlayerCard({ player, index, onEdit, onDelete }: PlayerCardProps) {
  const { isAdmin } = useEditableImages();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card relative overflow-hidden group border border-white/5 rounded-none flex flex-col h-full bg-[#161616]/40"
    >
      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="absolute top-3 right-3 z-30 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit?.(player)}
            className="p-2 bg-charcoal/90 hover:bg-gold text-white hover:text-charcoal border border-white/10 hover:border-gold cursor-pointer transition-colors"
            title="Edit Player Info"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete?.(player.id)}
            className="p-2 bg-charcoal/90 hover:bg-red-600 text-red-500 hover:text-white border border-white/10 hover:border-red-600 cursor-pointer transition-colors"
            title="Delete Player"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Player Image area */}
      <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-charcoal-medium to-charcoal flex items-center justify-center overflow-hidden border-b border-white/5">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,78,59,0.25),rgba(255,255,255,0))]" />
        
        {player.imageSrc ? (
          <Image
            src={player.imageSrc}
            alt={player.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-95 group-hover:brightness-90"
          />
        ) : (
          /* Silhouette / Icon fallback */
          <div className="w-20 h-20 rounded-full border border-gold/20 flex items-center justify-center text-gold/30 bg-charcoal/50 group-hover:scale-105 group-hover:border-gold/50 group-hover:text-gold transition-all duration-500 z-10">
            <User className="w-10 h-10" />
          </div>
        )}
      </div>

      {/* Info fields layout */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">
            Athlete Profile {index + 1}
          </span>
          <h4 className="text-lg font-oswald font-semibold text-white uppercase tracking-wide mb-4">
            {player.name}
          </h4>
          
          <div className="space-y-2.5 text-xs text-gray-400">
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-gray-500 uppercase tracking-wider font-medium">Position</span>
              <span className="text-gray-400 font-bold uppercase">{player.position}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-gray-500 uppercase tracking-wider font-medium">Team</span>
              <span className="text-gray-400 font-bold uppercase">{player.team}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1.5">
              <span className="text-gray-500 uppercase tracking-wider font-medium">Focus</span>
              <span className="text-gray-400 font-semibold">{player.focus}</span>
            </div>
          </div>
        </div>

        {player.quote && (
          <p className="text-gray-500 text-xs italic mt-6 border-l-2 border-gold/20 pl-3 leading-relaxed">
            "{player.quote}"
          </p>
        )}
      </div>
    </motion.div>
  );
}
