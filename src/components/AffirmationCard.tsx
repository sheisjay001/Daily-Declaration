import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowUpRight } from 'lucide-react';

interface AffirmationCardProps {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
  isFeatured?: boolean;
}

export const AffirmationCard: React.FC<AffirmationCardProps> = ({
  slug,
  title,
  excerpt,
  category,
  author,
  date,
  readTime,
  image,
  isFeatured = false,
}) => {
  const cardClass = isFeatured
    ? 'bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border border-purple-100'
    : 'bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border border-purple-100';

  return (
    <Link to={`/affirmations/${slug}`} className={`block ${cardClass}`}>
      {image && (
        <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-[#8B5CF6] border border-purple-200">
              {category}
            </span>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 mb-3">
          <span className="text-[#EC4899] font-semibold uppercase">{category}</span>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <span>{date}</span>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <span>{readTime}</span>
        </div>

        {/* Title */}
        <h3 className={`font-display font-bold text-[#111215] leading-tight mb-2 ${
          isFeatured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'
        }`}>
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#EC4899] fill-[#EC4899]/20" />
            <span className="text-xs text-neutral-500">{author}</span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
};
