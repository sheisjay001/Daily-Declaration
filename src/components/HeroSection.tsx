import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Sparkles, Heart, Sun, Star } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const [showBanner, setShowBanner] = useState(true);

  const categories = [
    'Self-Love',
    'Confidence',
    'Gratitude',
    'Abundance',
    'Peace',
    'Growth'
  ];

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-20 overflow-hidden bg-[#F8F9FA]">
      
      {/* Background Concentric Circles */}
      <div className="hero-concentric-rings select-none pointer-events-none">
        <div className="hero-ring hero-ring-1" />
        <div className="hero-ring hero-ring-2" />
        <div className="hero-ring hero-ring-3" />
        <div className="hero-ring hero-ring-4" />
        <div className="hero-ring hero-ring-5" />
      </div>

      {/* Dismissible Banner */}
      {showBanner && (
        <div className="max-w-4xl mx-auto px-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-full px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span className="font-medium">Start your day with positive affirmations</span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Close"
            >
              <span className="sr-only">Close</span>
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-sm mb-6">
          <Heart className="w-4 h-4 text-[#EC4899] fill-[#EC4899]/20" />
          <span className="text-xs font-mono text-neutral-600 uppercase tracking-wider">Daily Inspiration</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111215] leading-[1.1] mb-6">
          <span className="gradient-text">Speak Life</span> Into Your
          <br />
          Day, Every Day
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed max-w-2xl mx-auto mb-8">
          Daily affirmations and declarations to empower your mind, uplift your spirit, 
          and transform your life one positive thought at a time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] hover:from-[#7C3AED] hover:to-[#DB2777] rounded-full transition-all duration-200 shadow-lg shadow-purple-500/25 cursor-pointer"
          >
            <span>Explore Affirmations</span>
            <ArrowDown className="w-5 h-5" />
          </button>
          <Link
            to="/subscribe"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#111215] bg-white border border-purple-200 hover:border-purple-300 rounded-full transition-all duration-200 shadow-sm cursor-pointer"
          >
            <Sun className="w-5 h-5 text-[#F59E0B]" />
            <span>Get Daily Emails</span>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/category/${category.toLowerCase()}`}
              className="px-4 py-2 rounded-full text-sm font-medium text-neutral-600 bg-white border border-purple-100 hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-all cursor-pointer"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 animate-float opacity-20">
        <Star className="w-8 h-8 text-[#8B5CF6]" />
      </div>
      <div className="absolute top-40 right-20 animate-float opacity-20" style={{ animationDelay: '1s' }}>
        <Heart className="w-6 h-6 text-[#EC4899]" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float opacity-20" style={{ animationDelay: '2s' }}>
        <Sparkles className="w-7 h-7 text-[#F59E0B]" />
      </div>
    </section>
  );
};
