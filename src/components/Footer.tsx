import React from 'react';
import { Heart, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-purple-100 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-[#8B5CF6] fill-[#8B5CF6]/20" />
              <span className="font-display font-bold text-lg text-[#111215]">Daily Declarations</span>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
              Daily affirmations and declarations to inspire, uplift, and empower you on your journey. Start each day with positive intentions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-[#111215] mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li><a href="/" className="hover:text-[#8B5CF6] transition-colors">Daily Affirmations</a></li>
              <li><a href="/categories" className="hover:text-[#8B5CF6] transition-colors">Categories</a></li>
              <li><a href="/about" className="hover:text-[#8B5CF6] transition-colors">About Us</a></li>
              <li><a href="/subscribe" className="hover:text-[#8B5CF6] transition-colors">Subscribe</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-[#111215] mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              <a href="#" className="p-2 bg-purple-50 rounded-full text-[#8B5CF6] hover:bg-purple-100 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-neutral-500">
              Made with <Heart className="w-3 h-3 inline text-[#EC4899] fill-[#EC4899]" /> by sisters
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-purple-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} Daily Declarations. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-neutral-500">
            <a href="#" className="hover:text-[#8B5CF6] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#8B5CF6] transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
