import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ArrowUpRight, Heart } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Daily', href: '/' },
    { label: 'Affirmations', href: '/affirmations' },
    { label: 'Categories', href: '/categories' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-3 sm:top-5 z-50 px-4 max-w-4xl mx-auto w-full transition-all duration-200">
      {/* Floating Pill Bar */}
      <div className="bg-white text-[#111215] rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-xl shadow-black/5 border border-purple-100 flex items-center justify-between gap-3 sm:gap-6 backdrop-blur-md">
        
        {/* Brand */}
        <Link 
          to="/" 
          className="group flex items-center gap-2.5 font-display text-base sm:text-lg font-bold tracking-tight text-[#111215] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-full shrink-0"
        >
          <Heart className="w-6 h-6 text-[#8B5CF6] fill-[#8B5CF6]/20 transition-transform duration-300 group-hover:scale-110" />
          <span className="font-semibold tracking-tight text-[#111215] text-base">Daily Declarations</span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-neutral-600">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors duration-150 text-sm font-medium hover:text-[#8B5CF6] ${
                  isActive ? 'text-[#8B5CF6] font-semibold' : 'text-neutral-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 text-neutral-400 hover:text-[#8B5CF6] hover:bg-purple-50 rounded-full transition-colors cursor-pointer text-xs"
              title="Search affirmations (⌘K)"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Subscribe CTA */}
          <Link
            to="/subscribe"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] rounded-full transition-all duration-200 shadow-md shadow-purple-500/20 cursor-pointer"
          >
            <span>Subscribe</span>
            <ArrowUpRight className="w-3.5 h-3.5 hidden sm:inline" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 hover:text-[#8B5CF6] rounded-full hover:bg-purple-50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 bg-white rounded-2xl shadow-xl border border-purple-100 p-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 hover:text-[#8B5CF6] hover:bg-purple-50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
