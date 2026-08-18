import React from "react";
import { ArrowUp } from "lucide-react";
import { useEditableImages } from "@/context/ImageContext";

export default function Footer() {
  const { isAdmin, logout, openLoginModal } = useEditableImages();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          {/* Logo & Tagline */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-3xl font-oswald font-black tracking-wider text-white">
                P.G. <span className="text-gold">BROTHERS</span>
              </span>
              <p className="mt-4 max-w-sm text-gray-400 font-light leading-relaxed">
                Supporting Players. Building Teams. Growing Kabaddi. Dedicated to grassroots development, talent encouragement, and sporting opportunities.
              </p>
            </div>
            
            <div className="mt-6 md:mt-0 text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Official Website: <span className="text-white">PGBrothers.org</span>
            </div>
          </div>

          {/* Quick links columns */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8">
            <div>
              <h5 className="text-white font-oswald font-bold uppercase tracking-wider text-xs mb-4">
                Organization
              </h5>
              <ul className="space-y-2.5 text-xs uppercase tracking-wider">
                <li>
                  <a
                    href="#home"
                    onClick={(e) => handleNavClick(e, "#home")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => handleNavClick(e, "#about")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#support"
                    onClick={(e) => handleNavClick(e, "#support")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    What We Support
                  </a>
                </li>
                <li>
                  <a
                    href="#get-involved"
                    onClick={(e) => handleNavClick(e, "#get-involved")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    Get Involved
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-oswald font-bold uppercase tracking-wider text-xs mb-4">
                Kabaddi
              </h5>
              <ul className="space-y-2.5 text-xs uppercase tracking-wider">
                <li>
                  <a
                    href="#stories"
                    onClick={(e) => handleNavClick(e, "#stories")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    Player Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#moments"
                    onClick={(e) => handleNavClick(e, "#moments")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    Moments
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    onClick={(e) => handleNavClick(e, "#gallery")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    onClick={(e) => handleNavClick(e, "#contact")}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p className="text-xs text-gray-500 font-light text-center sm:text-left select-none">
            © 2026 P.G. Brothers. All rights{" "}
            <span
              onClick={isAdmin ? logout : openLoginModal}
              className="cursor-pointer hover:text-gray-400 active:text-gold transition-colors font-light"
              title={isAdmin ? "Click to Exit Edit Mode" : undefined}
            >
              reserved
            </span>
            . Built with passion for grassroots sports.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 bg-charcoal hover:bg-forest-medium/20 text-gray-500 hover:text-gold border border-white/5 hover:border-gold/30 text-xs font-bold uppercase tracking-widest transition-all duration-300"
            aria-label="Scroll to top of page"
          >
            Back to Top <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
