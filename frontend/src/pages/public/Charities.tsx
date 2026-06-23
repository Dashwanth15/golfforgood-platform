import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, Globe, Users, TrendingUp, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { charitiesApi } from '../../features/charities/charitiesApi';
import { formatCurrency } from '../../utils/formatters';
import type { Charity } from '../../types';

const CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'environment', label: '🌿 Environment' },
  { value: 'education', label: '📚 Education' },
  { value: 'health', label: '❤️ Health' },
  { value: 'community', label: '🏘️ Community' },
  { value: 'sports', label: '⚽ Sports' },
  { value: 'other', label: '✨ Other' },
];

const CAT_COLORS: Record<string, string> = {
  environment: 'badge-success',
  education:   'badge-blue',
  health:      'badge-danger',
  community:   'badge-brand',
  sports:      'badge-gold',
  other:       'badge-warning',
};

function CharityCard({ charity, index }: { charity: Charity; index: number }) {
  const pct = Math.min(100, Math.round((charity.total_raised / 50000) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      {/* Category + Featured */}
      <div className="flex items-center justify-between mb-4">
        <span className={`badge ${CAT_COLORS[charity.category]} capitalize`}>{charity.category}</span>
        {charity.is_featured && <span className="badge badge-gold">⭐ Featured</span>}
      </div>

      {/* Charity name + bio */}
      <h3 className="font-bold text-ink text-lg mb-2">{charity.name}</h3>
      <p className="text-sm text-ink-muted leading-relaxed mb-4 flex-1 line-clamp-3">
        {charity.short_bio || charity.description}
      </p>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-ink-muted">Raised so far</span>
          <span className="font-bold text-brand">{formatCurrency(charity.total_raised)}</span>
        </div>
        <div className="h-2 bg-surface rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.06 + 0.3 }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs text-ink-muted pt-4 border-t border-border mb-4">
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" /> {charity.donor_count.toLocaleString()} donors
        </span>
        {charity.website_url && (
          <a href={charity.website_url} target="_blank" rel="noreferrer"
            className="flex items-center gap-1 text-brand hover:underline">
            <Globe className="w-3.5 h-3.5" /> Website
          </a>
        )}
      </div>

      <Link to="/register" className="btn-primary btn-sm w-full">
        Support This Charity <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}

export default function Charities() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: res, isLoading } = useQuery({
    queryKey: ['charities', search, category],
    queryFn: () => charitiesApi.getAll({ search: search || undefined, category: category || undefined }),
  });
  const charities = res?.data ?? [];

  const totalRaised = charities.reduce((s, c) => s + Number(c.total_raised), 0);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="bg-hero-gradient text-white py-20">
        <div className="container-app text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Heart className="w-12 h-12 text-white mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partner Charities</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Every GolfForGood subscription contributes directly to these incredible causes. Choose yours and make every round count.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { value: formatCurrency(totalRaised), label: 'Total Raised' },
                { value: `${charities.length}`, label: 'Partner Charities' },
                { value: '10%+', label: 'Guaranteed Contribution' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-white/60 text-sm">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="sticky top-16 z-20 bg-white border-b border-border shadow-card">
        <div className="container-app py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search charities..."
                className="input pl-9"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter className="w-4 h-4 text-ink-muted flex-shrink-0" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    category === cat.value
                      ? 'bg-brand text-white'
                      : 'bg-surface text-ink-muted hover:bg-border/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="container-app">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
          ) : charities.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-12 h-12 text-border mx-auto mb-4" />
              <h3 className="font-bold text-ink mb-2">No charities found</h3>
              <p className="text-ink-muted text-sm">Try a different search or filter</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-ink-muted mb-6">{charities.length} charities found</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {charities.map((c, i) => (
                  <CharityCard key={c.id} charity={c} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-surface">
        <div className="container-app text-center">
          <TrendingUp className="w-10 h-10 text-brand mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-ink mb-4">Ready to Make a Difference?</h2>
          <p className="text-ink-muted mb-8">Subscribe to GolfForGood and start supporting the charity of your choice today.</p>
          <Link to="/register" className="btn-primary btn-lg">
            Start for £9.99/month <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
