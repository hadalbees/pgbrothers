"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Our Support", href: "#support" },
  { name: "Player Stories", href: "#stories" },
  { name: "Moments", href: "#moments" },
  { name: "Gallery", href: "#gallery" },
  { name: "Get Involved", href: "#get-involved" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple active section highlights
      const sections = navLinks.map((link) => link.href.substring(1));
      sections.push("home");
      
      let currentSection = "home";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            currentSection = section;
            break;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.substring(1);
    const el = document.getElementById(targetId);
    if (el) {
      const offset = 80; // height of sticky navbar
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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "py-4 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gold/10 shadow-lg"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <span className="text-2xl font-oswald font-black tracking-wider text-white group-hover:text-gold transition-colors">
              P.G. <span className="text-gold group-hover:text-white transition-colors">BROTHERS</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-semibold tracking-wider uppercase transition-all duration-200 relative py-1 focus:outline-none ${
                    isActive
                      ? "text-gold font-bold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden lg:flex items-center">
            <a
              href="#support"
              onClick={(e) => handleNavClick(e, "#support")}
              className="group flex items-center gap-1.5 px-5 py-2.5 bg-forest-medium hover:bg-gold text-white hover:text-charcoal text-xs font-bold uppercase tracking-wider border border-gold/20 hover:border-gold rounded-none transition-all duration-300 shadow-md hover:shadow-gold/10"
            >
              Support Kabaddi
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-gold p-1.5 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/98 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6 items-center justify-center flex-grow">
              {navLinks.map((link, idx) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-2xl font-oswald font-semibold tracking-widest uppercase focus:outline-none ${
                    activeSection === link.href.substring(1)
                      ? "text-gold"
                      : "text-gray-300"
                  }`}
                >
                  {link.name}
                </motion.a>
              ))}
              
              <motion.a
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: navLinks.length * 0.05 }}
                href="#support"
                onClick={(e) => handleNavClick(e, "#support")}
                className="mt-8 flex items-center justify-center gap-2 w-full max-w-xs py-4 bg-forest-medium hover:bg-gold text-white hover:text-charcoal font-bold uppercase tracking-widest border border-gold/20 rounded-none transition-all duration-300 text-sm"
              >
                Support Kabaddi
                <ArrowUpRight className="w-4 h-4" />
              </motion.a>
            </div>

            <div className="text-center text-gray-500 text-xs mt-auto">
              © 2026 P.G. Brothers. All rights reserved.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
