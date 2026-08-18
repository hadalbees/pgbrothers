"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Shield,
  Award,
  Users,
  Compass,
  Zap,
  Target,
  Trophy,
  Heart,
  TrendingUp,
  Mail,
  ChevronRight,
  MousePointerClick,
  Sparkles,
  Lock,
  Unlock,
  LogOut,
  RefreshCw,
  X,
  Plus,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import SupportCard from "@/components/SupportCard";
import PlayerCard from "@/components/PlayerCard";
import AchievementCard from "@/components/AchievementCard";
import Gallery from "@/components/Gallery";
import ContactForm from "@/components/ContactForm";
import { useEditableImages } from "@/context/ImageContext";
import { PlayerProfile, AchievementItem } from "@/utils/db";

// Helper wrapper component for static images that enables direct client-side edits
function EditableImageWrapper({
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
  const { isAdmin, getImageSrc, updateImageOverride, resetImageOverride, overrides } = useEditableImages();
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

export default function Home() {
  const {
    getImageSrc,
    players,
    achievements,
    isAdmin,
    login,
    logout,
    addOrUpdatePlayerProfile,
    removePlayerProfile,
    addOrUpdateAchievement,
    removeAchievement,
    resetAllToDefault,
    loading,
    openLoginModal,
  } = useEditableImages();

  const [editingPlayer, setEditingPlayer] = useState<Partial<PlayerProfile> | null>(null);
  const [playerImageFile, setPlayerImageFile] = useState<File | null>(null);

  const [editingAchievement, setEditingAchievement] = useState<Partial<AchievementItem> | null>(null);
  const [achievementImageFile, setAchievementImageFile] = useState<File | null>(null);

  const handleAddAchievement = () => {
    setEditingAchievement({
      category: "TEAM • UNITY",
      title: "",
      description: "",
      imageSrc: "/images/team_group.jpg",
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elRect = el.getBoundingClientRect().top;
      const elPosition = elRect - bodyRect;
      const offsetPosition = elPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleAddPlayer = () => {
    setEditingPlayer({
      name: "",
      position: "",
      team: "P.G. Brothers",
      focus: "",
      quote: "",
      imageSrc: "",
    });
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal"
        >
          {/* Hero background image */}
          <div className="absolute inset-0 z-0">
            <EditableImageWrapper path="/images/team_group.jpg" className="w-full h-full">
              <Image
                src={getImageSrc("/images/team_group.jpg")}
                alt="P.G. Brothers Kabaddi Team"
                fill
                priority
                className="object-cover object-center filter brightness-[0.25] saturate-[0.8] contrast-[1.05]"
              />
            </EditableImageWrapper>
            {/* Cinematic overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/90 to-charcoal" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#0a0a0a_100%)]" />
            {/* Athletic subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 flex flex-col items-center text-center">
            {/* Premium Gold Sub-banner */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-2 mb-6"
            >
              <div className="h-[1px] w-8 bg-gold" />
              <span className="text-gold font-oswald text-xs font-bold uppercase tracking-[0.25em]">
                P.G. BROTHERS ORGANIZATION
              </span>
              <div className="h-[1px] w-8 bg-gold" />
            </motion.div>

            {/* Main Hero Header */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-oswald font-extrabold text-white tracking-tight uppercase leading-none max-w-5xl"
            >
              Supporting the Players <br />
              <span className="text-gradient-gold">Who Keep Kabaddi Moving.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-gray-300 text-lg sm:text-xl font-light max-w-3xl leading-relaxed"
            >
              PGBrothers.org is committed to supporting Kabaddi players, teams and grassroots sporting communities by creating encouragement, opportunities and a stronger platform for the game.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
            >
              <a
                href="#about"
                onClick={(e) => handleNavClick(e, "#about")}
                className="w-full sm:w-auto px-8 py-4 bg-forest-medium hover:bg-gold text-white hover:text-charcoal text-xs font-bold uppercase tracking-widest border border-gold/25 hover:border-gold rounded-none transition-all duration-300 shadow-lg hover:shadow-gold/10 text-center"
              >
                Our Mission
              </a>
              <a
                href="#support"
                onClick={(e) => handleNavClick(e, "#support")}
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white text-xs font-bold uppercase tracking-widest border border-white/20 hover:border-white rounded-none transition-all duration-300 text-center"
              >
                Support Kabaddi
              </a>
            </motion.div>

          </div>
        </section>

        {/* HERO STATEMENT */}
        <section
          id="statement"
          className="relative py-20 bg-charcoal border-y border-white/5 overflow-hidden"
        >
          {/* Subtle design element */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-forest-dark/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
                THE SOUL OF THE GAME
              </span>
              <h2 className="text-3xl sm:text-5xl font-oswald font-black text-white uppercase tracking-wider mb-6">
                Kabaddi is more than a game.
              </h2>
              <div className="h-[2px] bg-gold w-16 mx-auto mb-8" />
              <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-6">
                Kabaddi is built on courage, discipline, teamwork and relentless determination. Behind every raid, every tackle and every victory is a player who has invested time, effort and belief into the game.
              </p>
              <p className="text-gold font-oswald font-bold text-lg uppercase tracking-widest">
                PGBrothers.org exists to support that journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 md:py-32 bg-charcoal-light relative">
          {/* Side accents */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-32 bg-gold/30" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              {/* Text Area */}
              <div className="lg:col-span-7">
                <SectionHeading
                  badge="About Us"
                  title="Our Purpose"
                  subtitle="We stand behind the athletes who give their all to the ground."
                />

                <div className="space-y-6 text-gray-300 text-base md:text-lg font-light leading-relaxed">
                  <p>
                    <strong className="text-white font-semibold">PGBrothers.org</strong> is focused on strengthening the Kabaddi community by supporting players, encouraging teams and creating greater opportunities for athletes to participate, compete and progress.
                  </p>
                  <p>
                    We believe talented players should have the encouragement and support needed to continue their sporting journey. From grassroots grounds to competitive tournaments, our goal is to help create an environment where dedication can turn into opportunity.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold bg-charcoal-medium">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Trustworthy</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Authentic Support</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-gold/20 flex items-center justify-center text-gold bg-charcoal-medium">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Community</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest">Grassroots Focus</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic/Image Collage Area */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-square w-full max-w-md mx-auto border border-white/5 p-4 bg-charcoal">
                  <div className="absolute inset-0 border border-gold/15 scale-[0.98] pointer-events-none" />
                  
                  {/* Embedded Authentic image with overlay crop */}
                  <div className="relative w-full h-full overflow-hidden">
                    <EditableImageWrapper path="/images/grassroots_support.png" className="w-full h-full">
                      <Image
                        src={getImageSrc("/images/grassroots_support.png")}
                        alt="Supporting grassroots Kabaddi"
                        fill
                        sizes="(max-w-768px) 100vw, 40vw"
                        className="object-cover filter contrast-[1.05] brightness-90 saturate-[0.9]"
                      />
                    </EditableImageWrapper>
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Corner Accent Box */}
                  <div className="absolute -bottom-4 -right-4 p-4 bg-forest-medium border border-gold/20 text-center z-10 hidden sm:block">
                    <span className="block text-3xl font-oswald font-black text-gold">100%</span>
                    <span className="block text-[8px] font-bold text-white uppercase tracking-widest">Player Focused</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT WE SUPPORT SECTION */}
        <section id="support" className="py-24 md:py-32 bg-charcoal relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,78,59,0.1),transparent_50%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Areas of Focus"
              title="What We Support"
              subtitle="Our support is structured across six key pillars to address the specific needs of athletes and teams."
              centered
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
              <SupportCard
                number="01"
                title="Player Support"
                description="Helping Kabaddi players receive encouragement and support as they continue developing their sporting journey."
                iconName="Heart"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleNavClick(e, "#contact")}
              />
              <SupportCard
                number="02"
                title="Team Development"
                description="Supporting team participation, teamwork and a stronger competitive environment for Kabaddi players."
                iconName="Users"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleNavClick(e, "#contact")}
              />
              <SupportCard
                number="03"
                title="Grassroots Kabaddi"
                description="Encouraging Kabaddi at the grassroots level and helping young and emerging players stay connected to the sport."
                iconName="Compass"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleNavClick(e, "#contact")}
              />
              <SupportCard
                number="04"
                title="Tournament Participation"
                description="Supporting players and teams as they participate in local and competitive Kabaddi tournaments."
                iconName="Trophy"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleNavClick(e, "#contact")}
              />
              <SupportCard
                number="05"
                title="Talent Encouragement"
                description="Recognizing dedication, performance and commitment so that promising players are encouraged to continue pursuing the game."
                iconName="Award"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleNavClick(e, "#contact")}
              />
              <SupportCard
                number="06"
                title="Sporting Opportunities"
                description="Working toward opportunities that can help players gain exposure, experience and confidence through Kabaddi."
                iconName="TrendingUp"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleNavClick(e, "#contact")}
              />
            </div>
          </div>
        </section>

        {/* WHY KABADDI SECTION */}
        <section className="py-24 md:py-32 bg-charcoal-light border-y border-white/5 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Editorial Intro */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
                    Core Attributes
                  </span>
                  <h3 className="text-4xl sm:text-5xl font-oswald font-bold text-white uppercase leading-none tracking-tight mb-6">
                    The Game Builds <br />
                    <span className="text-gradient-gold">More Than Players.</span>
                  </h3>
                  <div className="h-[2px] bg-gold w-16 mb-8" />
                  <p className="text-gray-400 text-lg font-light leading-relaxed mb-6">
                    Kabaddi develops qualities that extend far beyond the playing surface. It instills values that shape character, resilience, and communities.
                  </p>
                </div>

                <div className="p-6 bg-charcoal border-l-4 border-gold border-y border-r border-white/5 mt-6 lg:mt-0">
                  <p className="text-white font-oswald font-semibold text-base uppercase tracking-wider mb-2">
                    Our Core Belief
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed font-light">
                    "When we support Kabaddi, we support the people and communities built around it."
                  </p>
                </div>
              </div>

              {/* Qualities Grid */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Courage", desc: "Every raid demands confidence, quick decisions, and the bravery to face the opponent's territory." },
                  { title: "Discipline", desc: "Every match rewards thorough preparation, consistent fitness routines, and tactical compliance." },
                  { title: "Teamwork", desc: "Every single point depends on collective effort, instant synchronization, and unwavering defense support." },
                  { title: "Resilience", desc: "Every setback, failed raid, or lost match creates another opportunity to learn, improve, and fight back." },
                  { title: "Fitness", desc: "The high-intensity game demands peak physical strength, explosive speed, agility, and lung capacity." },
                  { title: "Character", desc: "Rigorous competition teaches players how to win with humility and respond to challenges with determination." },
                ].map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="p-6 border border-white/5 hover:border-gold/10 bg-charcoal/30 flex gap-4 items-start group"
                  >
                    <div className="text-gold font-oswald font-extrabold text-lg mt-0.5 group-hover:scale-110 transition-transform">
                      /
                    </div>
                    <div>
                      <h4 className="text-base font-oswald font-bold text-white uppercase tracking-wider mb-2 group-hover:text-gold transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PLAYER JOURNEY SECTION */}
        <section id="journey" className="py-24 md:py-32 bg-charcoal relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Progression Path"
              title="From the Ground to Greater Opportunities"
              subtitle="The developmental path of a Kabaddi player requires consistent growth, structured effort, and support at every stage."
              centered
            />

            {/* Horizontal/Vertical Timeline */}
            <div className="mt-16 md:mt-24 relative">
              {/* Timeline Connector Line */}
              <div className="absolute top-[40px] left-4 md:left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%-80px)] md:w-[calc(100%-120px)] md:h-[2px] bg-gradient-to-r md:from-gold/10 md:via-gold/50 md:to-gold/10 bg-gold/30 pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-6 gap-8 md:gap-4 relative z-10">
                {[
                  { stage: "01", name: "Discover", desc: "A player discovers Kabaddi on local grounds and develops an initial passion for the sport." },
                  { stage: "02", name: "Train", desc: "Rigorous daily practice, physical fitness, discipline, and consistency begin shaping the athlete." },
                  { stage: "03", name: "Compete", desc: "Entering local matches and tournaments to gain vital experience under pressure." },
                  { stage: "04", name: "Develop", desc: "Real-game experience creates stronger tactical skills, confidence, and deeper understanding." },
                  { stage: "05", name: "Represent", desc: "Earning opportunities to represent established teams and compete at higher tournament levels." },
                  { stage: "06", name: "Inspire", desc: "Successful athlete journeys motivate and inspire the next generation to step onto the Kabaddi ground." },
                ].map((item, idx) => (
                  <motion.div
                    key={item.stage}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="flex flex-row md:flex-col items-start text-left md:text-center px-4 group"
                  >
                    {/* Circle Node */}
                    <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 rounded-full bg-charcoal border-2 border-gold flex items-center justify-center z-10 mx-auto group-hover:bg-gold transition-colors duration-300 shadow-md">
                      <span className="text-sm md:text-lg font-oswald font-extrabold text-gold group-hover:text-charcoal transition-colors">
                        {item.stage}
                      </span>
                    </div>

                    {/* Content Box */}
                    <div className="ml-6 md:ml-0 md:mt-6 text-left md:text-center flex-grow">
                      <h4 className="text-lg font-oswald font-bold text-white uppercase tracking-wider mb-2 group-hover:text-gold transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto font-light">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SPIRIT SECTION */}
        <section className="relative py-32 md:py-48 bg-charcoal overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 z-0">
            <EditableImageWrapper path="/images/player_lineup.jpg" className="w-full h-full">
              <Image
                src={getImageSrc("/images/player_lineup.jpg")}
                alt="Kabaddi team spirit"
                fill
                className="object-cover object-center filter brightness-[0.2] saturate-[0.7]"
              />
            </EditableImageWrapper>
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-left">
              <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
                Collective Strength
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-oswald font-black text-white uppercase tracking-tight leading-none mb-6">
                No Player Stands Alone.
              </h2>
              <div className="h-[3px] bg-gold w-24 mb-8" />
              
              <div className="space-y-4 text-gray-300 text-base md:text-lg font-light leading-relaxed">
                <p>
                  Kabaddi is a team sport built entirely on trust. Every defender depends on another player's backup. Every raid creates collective responsibility. Every single victory belongs to the team.
                </p>
                <p>
                  PGBrothers.org believes that supporting the game means supporting the entire sporting community — players, teams, coaches, families, organizers and the young athletes watching from the sidelines.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ACHIEVEMENTS / MOMENTS SECTION */}
        <section id="moments" className="py-24 md:py-32 bg-charcoal-light relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Moments that Matter"
              title="Dedication in Action"
              subtitle="Every tournament creates a story. Every trophy represents effort. Every team photograph captures a journey."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {achievements.map((item, idx) => (
                <AchievementCard
                  key={item.id}
                  achievement={item}
                  index={idx}
                  onEdit={(a) => setEditingAchievement(a)}
                  onDelete={(id) => {
                    if (confirm("Are you sure you want to delete this achievement card?")) {
                      removeAchievement(id);
                    }
                  }}
                />
              ))}

              {/* Admin Add Achievement Card */}
              {isAdmin && (
                <div
                  onClick={handleAddAchievement}
                  className="border-2 border-dashed border-gold/20 hover:border-gold/50 flex flex-col items-center justify-center p-6 text-center aspect-[4/3] w-full cursor-pointer group transition-all duration-300 bg-charcoal/20 hover:bg-gold/5"
                >
                  <div className="w-12 h-12 rounded-none border border-gold/20 flex items-center justify-center text-gold/40 group-hover:scale-105 group-hover:border-gold/50 group-hover:text-gold transition-all duration-300 mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-gold font-oswald font-bold uppercase tracking-wider text-xs">
                    Add New Moment
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* TROPHY FEATURE SECTION */}
        <section className="relative py-28 md:py-36 bg-charcoal overflow-hidden border-b border-white/5">
          {/* Subtle trophy shine background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05),transparent_60%)] animate-pulse-slow pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Trophy Images Showcase */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <EditableImageWrapper path="/images/cup_presentation.jpg" className="relative aspect-[3/5] w-full overflow-hidden border border-gold/10 group">
                  <Image
                    src={getImageSrc("/images/cup_presentation.jpg")}
                    alt="Kabaddi Championship Gold Trophy"
                    fill
                    className="object-cover object-center filter grayscale contrast-[1.1] brightness-[0.8] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-20 animate-shine pointer-events-none" />
                </EditableImageWrapper>
                <EditableImageWrapper path="/images/team_group.jpg" className="relative aspect-[3/5] w-full overflow-hidden border border-gold/10 group mt-8">
                  <Image
                    src={getImageSrc("/images/team_group.jpg")}
                    alt="Winner Trophy Display"
                    fill
                    className="object-cover object-center filter grayscale contrast-[1.1] brightness-[0.8] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-shimmer opacity-0 group-hover:opacity-20 animate-shine pointer-events-none" />
                </EditableImageWrapper>
              </div>

              {/* Editorial block */}
              <div className="lg:col-span-6">
                <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
                  Reward of Sweat
                </span>
                <h3 className="text-4xl sm:text-5xl font-oswald font-bold text-white uppercase tracking-tight leading-none mb-6">
                  Every Trophy <br />
                  <span className="text-gradient-gold">Has a Story.</span>
                </h3>
                <div className="h-[2px] bg-gold w-16 mb-8" />
                
                <div className="space-y-6 text-gray-300 text-base md:text-lg font-light leading-relaxed">
                  <p>
                    A trophy is more than an object of metal or wood. It represents the practices nobody saw, the early mornings, the demanding training matches that tested the team, and the players who stayed committed.
                  </p>
                  <p>
                    It stands for the people who stood behind the team—organizers, families, supporters, and fellow athletes.
                  </p>
                  <p className="text-white font-oswald font-bold uppercase tracking-wider text-base mt-8 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gold" />
                    We celebrate the effort behind every achievement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLAYER STORIES SECTION */}
        <section id="stories" className="py-24 md:py-32 bg-charcoal-light relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="max-w-2xl">
                <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
                  Talent Showcase
                </span>
                <h3 className="text-4xl sm:text-5xl font-oswald font-bold text-white uppercase tracking-tight leading-none">
                  The People Behind the Game
                </h3>
                <div className="h-[2px] bg-gold w-16 mt-4 mb-5" />
                <p className="text-gray-400 text-base font-light">
                  Every Kabaddi player has a story of early mornings, demanding practice sessions, tough matches, setbacks, comebacks, and the determination to keep playing.
                </p>
              </div>
              <p className="text-gray-500 text-xs italic mt-4 md:mt-0 max-w-xs md:text-right border-l-2 md:border-l-0 md:border-r-2 border-gold/25 pl-4 md:pl-0 pr-0 md:pr-4">
                PGBrothers.org aims to give these journeys greater visibility, encouragement, and platform exposure.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {players.map((player, idx) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  index={idx}
                  onEdit={(p) => setEditingPlayer(p)}
                  onDelete={(id) => {
                    if (confirm("Are you sure you want to delete this player profile?")) {
                      removePlayerProfile(id);
                    }
                  }}
                />
              ))}

              {/* Admin Add Player Card */}
              {isAdmin && (
                <div
                  onClick={handleAddPlayer}
                  className="border-2 border-dashed border-gold/20 hover:border-gold/50 flex flex-col items-center justify-center p-8 text-center min-h-[400px] cursor-pointer group transition-all duration-300 bg-charcoal/20 hover:bg-gold/5"
                >
                  <div className="w-16 h-16 rounded-none border border-gold/20 flex items-center justify-center text-gold/40 group-hover:scale-105 group-hover:border-gold/50 group-hover:text-gold transition-all duration-300 mb-4">
                    <Plus className="w-8 h-8" />
                  </div>
                  <span className="text-gold font-oswald font-bold uppercase tracking-wider text-xs">
                    Add New Player Profile
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* COMMUNITY SECTION */}
        <section className="py-24 md:py-32 bg-charcoal relative border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Social Impact"
              title="Building a Stronger Kabaddi Community"
              subtitle="Kabaddi grows when players, teams and communities grow together. We want to encourage a sporting culture where young players can discover the game, experienced players can contribute, and teams find support."
              centered
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { title: "Players", desc: "Encourage and support athletes by providing platforms, resources, and recognition to fuel their athletic careers.", icon: Heart },
                { title: "Teams", desc: "Strengthen participation, coordination, and teamwork by supporting squad tournament entries and matches.", icon: Users },
                { title: "Community", desc: "Keep Kabaddi growing at the grassroots level, making the sport accessible to younger demographics.", icon: Compass },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-8 border border-white/5 bg-[#161616]/30 text-center flex flex-col items-center hover:border-gold/20 transition-colors"
                  >
                    <div className="w-12 h-12 bg-forest-medium/10 text-gold border border-gold/20 flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-oswald font-bold text-white uppercase tracking-wider mb-3">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SUPPORT SECTION */}
        <section id="support-cta" className="relative py-28 md:py-36 bg-charcoal border-y border-white/5 overflow-hidden">
          {/* Background image overlay */}
          <div className="absolute inset-0 z-0 opacity-15">
            <EditableImageWrapper path="/images/tournament_group.jpg" className="w-full h-full">
              <Image
                src={getImageSrc("/images/tournament_group.jpg")}
                alt="Kabaddi background"
                fill
                className="object-cover"
              />
            </EditableImageWrapper>
          </div>
          {/* Solid color gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-charcoal/95 to-[#0a0a0a] z-0" />

          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
              Contribute to the Movement
            </span>
            <h3 className="text-4xl sm:text-6xl font-oswald font-bold text-white uppercase tracking-tight mb-6">
              Help Us Support Kabaddi.
            </h3>
            <div className="h-[2px] bg-gold w-16 mx-auto mb-8" />
            
            <p className="text-gray-300 text-lg md:text-xl font-light leading-relaxed mb-10 max-w-2xl mx-auto">
              Your support can help create more opportunities for players, teams and grassroots Kabaddi communities. We focus on direct sporting support where it counts.
            </p>

            {/* List of support areas in columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left max-w-3xl mx-auto mb-12 text-xs uppercase tracking-wider font-semibold text-gray-300 border border-white/5 bg-[#121212]/50 p-6">
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Player Support</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Team Support</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Tournament Entry</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Sporting Equipment</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Training Support</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Grassroots Initiatives</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Talent Development</div>
              <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-gold" /> Kabaddi Events</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="w-full sm:w-auto px-8 py-4 bg-gold text-charcoal hover:bg-white text-xs font-bold uppercase tracking-widest transition-all duration-300 text-center"
              >
                Support the Game
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-white/20 hover:border-white text-xs font-bold uppercase tracking-widest transition-all duration-300 text-center"
              >
                Get Involved
              </a>
            </div>
          </div>
        </section>

        {/* GET INVOLVED SECTION */}
        <section id="get-involved" className="py-24 md:py-32 bg-charcoal-light relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Collaborate"
              title="There's a Place for Everyone in the Game."
              subtitle="Whether you play, support, coordinate or represent, your contribution plays a vital role in our collective sports growth."
              centered
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { title: "Player", desc: "Want to take your Kabaddi journey forward?", action: "Join the Community" },
                { title: "Team", desc: "Looking for support or collaboration?", action: "Connect with us" },
                { title: "Supporter", desc: "Want to contribute to Kabaddi development?", action: "Support Kabaddi" },
                { title: "Organization", desc: "Interested in partnering with us?", action: "Partner with us" },
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 border border-white/5 bg-charcoal/40 flex flex-col justify-between h-full group hover:border-gold/20 transition-all"
                >
                  <div>
                    <span className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3 block">
                      Category 0{idx + 1}
                    </span>
                    <h4 className="text-xl font-oswald font-bold text-white uppercase tracking-wider mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-xs font-light leading-relaxed mb-6">
                      {item.desc}
                    </p>
                  </div>
                  
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "#contact")}
                    className="flex items-center text-xs font-bold uppercase tracking-wider text-white group-hover:text-gold transition-colors gap-1.5 focus:outline-none"
                  >
                    {item.action} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERSHIP SECTION */}
        <section className="py-24 bg-charcoal relative overflow-hidden border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
              Synergistic Network
            </span>
            <h3 className="text-3xl sm:text-4xl font-oswald font-bold text-white uppercase tracking-tight mb-4">
              Partnerships that Move the Game Forward
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-2xl mx-auto mb-8">
              Supporting Kabaddi requires a strong sporting ecosystem. PGBrothers.org welcomes meaningful collaborations with individuals, teams, sporting organizations, businesses and supporters who believe in developing Kabaddi and creating better opportunities for players.
            </p>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "#contact")}
              className="inline-block px-6 py-3 bg-forest-medium hover:bg-gold text-white hover:text-charcoal border border-gold/15 text-xs font-bold uppercase tracking-wider transition-all duration-300"
            >
              Become a Partner
            </a>
          </div>
        </section>

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-24 md:py-32 bg-charcoal-light relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              badge="Visual Archives"
              title="The Kabaddi Journey"
              subtitle="Real Players. Real Games. Real Effort. Real Stories. Explore visual representations of grassroots and tournament matches."
              centered
            />

            <Gallery />
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section className="py-24 md:py-32 bg-charcoal relative overflow-hidden border-y border-white/5">
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase mb-4 block">
              Qualitative Value
            </span>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-oswald font-black text-white uppercase leading-none tracking-tight mb-8">
              Our Impact Starts <br />
              <span className="text-gradient-gold">With One Player.</span>
            </h3>
            <div className="h-[2px] bg-gold w-16 mx-auto mb-10" />

            <div className="space-y-6 text-gray-300 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              <p>A player who receives encouragement can continue.</p>
              <p>A team that receives support can compete.</p>
              <p>A young athlete who sees an opportunity can believe.</p>
              <p>And a community that believes in its players can help Kabaddi grow.</p>
              
              <p className="text-gold font-oswald font-bold text-lg uppercase tracking-wider mt-8">
                That is the impact we want to create.
              </p>
            </div>
          </div>
        </section>

        {/* FUTURE VISION */}
        <section className="py-20 bg-charcoal-light text-center relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest text-gold uppercase mb-3 block">
              Forward Outlook
            </span>
            <h3 className="text-3xl sm:text-4xl font-oswald font-bold text-white uppercase tracking-wider mb-6">
              The Next Generation is Waiting.
            </h3>
            <p className="text-gray-400 text-base font-light leading-relaxed mb-6">
              Our vision is to contribute to a stronger Kabaddi ecosystem where talented players have greater encouragement, teams have better opportunities to participate, and young athletes can see a future in the sport they love.
            </p>
            <p className="text-white font-oswald font-bold uppercase tracking-wider text-base">
              Today we support the game. Tomorrow we want to help shape its future.
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 md:py-32 bg-charcoal relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
              {/* Left Column Info */}
              <div className="lg:col-span-5 flex flex-col justify-between py-2">
                <div>
                  <SectionHeading
                    badge="Connect"
                    title="Let's Talk Kabaddi."
                    subtitle="Whether you are a player, team, supporter, organization or potential partner, we would love to hear from you."
                  />

                  <div className="space-y-6 text-gray-400 text-sm font-light mt-8">
                    <p>
                      Are you an athlete needing training support or shoe equipment? Are you a captain/coach representing a local Kabaddi squad looking to participate in upcoming competitive games? Or a community supporter looking to co-sponsor grassroots events?
                    </p>
                    <p>
                      Fill out the form and submit your request. We will review your message and reply as soon as possible.
                    </p>
                  </div>
                </div>

                {/* Important alert block */}
                <div className="mt-8 p-4 bg-forest-medium/10 border border-gold/15 text-xs text-gold/80 leading-relaxed font-light">
                  <strong>Important Notice:</strong> PGBrothers.org works directly with sporting initiatives. All submissions are evaluated individually. We are dedicated to providing support directly to players and grassroots structures.
                </div>
              </div>

              {/* Right Column Form */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* FLOATING ADMIN CONTROLS */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 items-end">
          <button
            onClick={() => {
              if (confirm("This will clear all uploaded images, customized players, and reset the website to its original factory state. Are you sure?")) {
                resetAllToDefault();
              }
            }}
            className="px-4 py-2 bg-charcoal border border-red-900/50 hover:border-red-500 text-red-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl flex items-center gap-2 cursor-pointer"
            title="Reset Entire Site to Factory Seed Defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-charcoal border border-white/10 hover:border-gold text-white hover:text-charcoal hover:bg-gold text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Edit Mode
          </button>
        </div>
      )}

      {/* PLAYER EDIT / ADD MODAL */}
      {editingPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-charcoal border border-gold/30 p-8 my-8 relative shadow-2xl">
            <button
              onClick={() => {
                setEditingPlayer(null);
                setPlayerImageFile(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-wider mb-6">
              {editingPlayer.id ? "Edit Player Profile" : "Add Player Profile"}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const profile: PlayerProfile = {
                  id: editingPlayer.id || `player_${Date.now()}`,
                  name: editingPlayer.name || "Unnamed Player",
                  position: editingPlayer.position || "Raider",
                  team: editingPlayer.team || "P.G. Brothers",
                  focus: editingPlayer.focus || "Grassroots Development",
                  quote: editingPlayer.quote || "",
                  imageSrc: editingPlayer.imageSrc || "",
                };
                await addOrUpdatePlayerProfile(profile, playerImageFile);
                setEditingPlayer(null);
                setPlayerImageFile(null);
              } catch (err) {
                alert("Error saving player profile");
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Player Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPlayer.name || ""}
                    onChange={(e) => setEditingPlayer({...editingPlayer, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      Position
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPlayer.position || ""}
                      onChange={(e) => setEditingPlayer({...editingPlayer, position: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      Team Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPlayer.team || ""}
                      onChange={(e) => setEditingPlayer({...editingPlayer, team: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Focus / Experience
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPlayer.focus || ""}
                    onChange={(e) => setEditingPlayer({...editingPlayer, focus: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Quote / Bio
                  </label>
                  <textarea
                    rows={3}
                    value={editingPlayer.quote || ""}
                    onChange={(e) => setEditingPlayer({...editingPlayer, quote: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Player Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPlayerImageFile(e.target.files?.[0] || null)}
                    className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                  />
                  {editingPlayer.imageSrc && !playerImageFile && (
                    <p className="text-[10px] text-gray-500 mt-1">Has profile picture. Upload a new one to replace.</p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-gold text-charcoal font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 text-xs cursor-pointer"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPlayer(null);
                    setPlayerImageFile(null);
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
      {/* MOMENT EDIT / ADD MODAL */}
      {editingAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-charcoal border border-gold/30 p-8 my-8 relative shadow-2xl">
            <button
              onClick={() => {
                setEditingAchievement(null);
                setAchievementImageFile(null);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-oswald font-bold text-white uppercase tracking-wider mb-6">
              {editingAchievement.id ? "Edit Moment Details" : "Add Moment"}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const item: AchievementItem = {
                  id: editingAchievement.id || `moment_${Date.now()}`,
                  imageSrc: editingAchievement.imageSrc || "/images/team_group.jpg",
                  category: editingAchievement.category || "TEAM • UNITY",
                  title: editingAchievement.title || "Championship Moment",
                  description: editingAchievement.description || "",
                };
                await addOrUpdateAchievement(item, achievementImageFile);
                setEditingAchievement(null);
                setAchievementImageFile(null);
              } catch (err) {
                alert("Error saving moment details");
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Moment Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAchievement.title || ""}
                    onChange={(e) => setEditingAchievement({...editingAchievement, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Category Tag / Subtitle
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAchievement.category || ""}
                    onChange={(e) => setEditingAchievement({...editingAchievement, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Description
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={editingAchievement.description || ""}
                    onChange={(e) => setEditingAchievement({...editingAchievement, description: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/10 focus:border-gold text-white text-xs rounded-none focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAchievementImageFile(e.target.files?.[0] || null)}
                    className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-white/10 file:text-white hover:file:bg-white/20 file:cursor-pointer"
                  />
                  {editingAchievement.imageSrc && !achievementImageFile && (
                    <p className="text-[10px] text-gray-500 mt-1">Has photo. Upload a new file to replace.</p>
                  )}
                </div>
              </div>
              
              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  className="flex-grow py-3 bg-gold text-charcoal font-bold uppercase tracking-widest hover:bg-white transition-colors duration-300 text-xs cursor-pointer"
                >
                  Save Moment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAchievement(null);
                    setAchievementImageFile(null);
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
    </>
  );
}
