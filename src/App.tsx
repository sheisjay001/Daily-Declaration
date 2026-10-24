import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AffirmationCard } from './components/AffirmationCard';
import { AffirmationDetail } from './components/AffirmationDetail';
import { CategoryPage } from './components/CategoryPage';
import { SearchModal } from './components/SearchModal';
import { SubscribePage } from './components/SubscribePage';
import { CmsPage } from './components/CmsPage';

// Sample affirmation data
const AFFIRMATIONS = [
  {
    id: '1',
    slug: 'i-am-worthy-of-love-and-happiness',
    title: 'I Am Worthy of Love and Happiness',
    excerpt: 'Today I declare that I am worthy of all the love and happiness the universe has to offer. I open my heart to receive blessings.',
    category: 'Self-Love',
    author: 'Sarah',
    date: 'Oct 24, 2026',
    readTime: '2 min',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
  },
  {
    id: '2',
    slug: 'confidence-flows-through-me',
    title: 'Confidence Flows Through Me',
    excerpt: 'I step into my power with confidence. I trust in my abilities and know that I am capable of achieving great things.',
    category: 'Confidence',
    author: 'Emma',
    date: 'Oct 23, 2026',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
  },
  {
    id: '3',
    slug: 'gratitude-fills-my-heart',
    title: 'Gratitude Fills My Heart',
    excerpt: 'I am grateful for every moment, every challenge, and every blessing. Gratitude opens the door to more abundance.',
    category: 'Gratitude',
    author: 'Jessica',
    date: 'Oct 22, 2026',
    readTime: '2 min',
  },
];

function AppContent() {
  const location = useLocation();
  const isCmsRoute = location.pathname.startsWith('/cms');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollToAffirmations = () => {
    document.getElementById('affirmations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isCmsRoute ? 'bg-[#f1f2ed] text-[#18211e]' : 'bg-[#F8F9FA] text-[#111215]'} flex flex-col font-sans`}>
      {!isCmsRoute && <Navbar onOpenSearch={() => setIsSearchOpen(true)} />}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HeroSection onExploreClick={scrollToAffirmations} />
                
                {/* Affirmations Grid */}
                <section id="affirmations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="text-center mb-12">
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#111215] mb-4">
                      Today's Affirmations
                    </h2>
                    <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
                      Start your day with these powerful declarations
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {AFFIRMATIONS.map((affirmation) => (
                      <AffirmationCard key={affirmation.id} {...affirmation} />
                    ))}
                  </div>
                </section>
              </>
            }
          />
          <Route path="/affirmations/:slug" element={<AffirmationDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/cms/*" element={<CmsPage />} />
        </Routes>
      </main>

      {!isCmsRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
