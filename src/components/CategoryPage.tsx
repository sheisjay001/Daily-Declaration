import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AffirmationCard } from './AffirmationCard';
import { apiUrl } from '../api';

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [affirmations, setAffirmations] = React.useState<any[]>([]);
  const [category, setCategory] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [affirmationsRes, categoryRes] = await Promise.all([
          fetch(apiUrl(`/api/affirmations?category=${slug}&published=true`)),
          fetch(apiUrl(`/api/categories/${slug}`))
        ]);
        
        const affirmationsData = await affirmationsRes.json();
        const categoryData = await categoryRes.json();
        
        setAffirmations(affirmationsData.affirmations);
        setCategory(categoryData);
      } catch (err) {
        console.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-[#8B5CF6] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <div className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#111215] mb-4">
            {category?.name || 'Category'}
          </h1>
          <p className="text-lg text-neutral-600">
            {affirmations.length} affirmation{affirmations.length !== 1 ? 's' : ''} in this category
          </p>
        </div>

        {affirmations.length === 0 ? (
          <div className="text-center py-12 text-neutral-600">
            No affirmations found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {affirmations.map((affirmation) => (
              <AffirmationCard
                key={affirmation.id}
                id={affirmation.id}
                slug={affirmation.slug}
                title={affirmation.title}
                excerpt={affirmation.excerpt}
                category={affirmation.category_name}
                author={affirmation.author_name}
                date={new Date(affirmation.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                readTime="2 min"
                image={affirmation.cover_image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
