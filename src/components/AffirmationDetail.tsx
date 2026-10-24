import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft, Share2, Calendar, Clock } from 'lucide-react';
import { apiUrl } from '../api';

interface AffirmationDetailProps {
  // Will be fetched from API
}

export const AffirmationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [affirmation, setAffirmation] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchAffirmation = async () => {
      try {
        const response = await fetch(apiUrl(`/api/affirmations/${slug}`));
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setAffirmation(data);
      } catch (err) {
        setError('Failed to load affirmation');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchAffirmation();
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: affirmation?.title,
          text: affirmation?.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  if (error || !affirmation) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-red-600">{error || 'Affirmation not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#8B5CF6] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to affirmations
        </Link>

        {/* Cover Image */}
        {affirmation.cover_image && (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
            <img
              src={affirmation.cover_image}
              alt={affirmation.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
          <span className="px-3 py-1 rounded-full bg-purple-100 text-[#8B5CF6] font-medium">
            {affirmation.category_name}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(affirmation.created_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {affirmation.author_name}
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#111215] leading-tight mb-6">
          {affirmation.title}
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#111215] bg-white border border-purple-200 hover:border-purple-300 rounded-full transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-lg text-neutral-700 leading-relaxed whitespace-pre-line">
            {affirmation.content}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-purple-100">
          <div className="flex items-center gap-2 text-neutral-600">
            <Heart className="w-5 h-5 text-[#EC4899] fill-[#EC4899]/20" />
            <span className="text-sm">
              Written by {affirmation.author_name} · {affirmation.author_role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
