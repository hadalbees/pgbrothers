import React from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

interface SupportCardProps {
  number: string;
  title: string;
  description: string;
  iconName: keyof typeof Icons;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function SupportCard({ number, title, description, iconName, onClick }: SupportCardProps) {
  const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 flex flex-col justify-between group relative overflow-hidden h-full border-t-[3px] border-t-transparent hover:border-t-gold cursor-pointer"
    >
      {/* Background glow hover effect */}
      <div className="absolute inset-0 bg-shimmer -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out pointer-events-none" />
      
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-forest-medium/10 border border-gold/15 rounded-none text-gold group-hover:bg-gold group-hover:text-charcoal transition-all duration-300">
            {IconComponent && <IconComponent className="w-6 h-6" />}
          </div>
          <span className="text-4xl font-oswald font-extrabold text-gold/30 group-hover:text-gold transition-colors duration-300">
            {number}
          </span>
        </div>
        
        <h3 className="text-xl font-oswald font-bold text-white uppercase tracking-wider mb-3 group-hover:text-gold transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed font-light">
          {description}
        </p>
      </div>

      <div className="mt-6 flex items-center text-xs font-bold text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-1 uppercase tracking-widest">
        Give Support <Icons.ChevronRight className="w-3 h-3" />
      </div>
    </motion.div>
  );
}
