import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Filter, Globe, Users, TrendingUp, Heart, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { charitiesApi } from '../../features/charities/charitiesApi';
import { subscriptionApi } from '../../features/subscription/subscriptionApi';
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

import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

function CharityCard({ charity, index }: { charity: Charity; index: number }) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [showDonate, setShowDonate] = useState(false);
  const [amount, setAmount] = useState<number | ''>('');
  const queryClient = useQueryClient();

  const { data: subRes } = useQuery({ 
    queryKey: ['my-subscription'], 
    queryFn: () => subscriptionApi.getMySubscription(),
    enabled: isAuthenticated 
  });
  const sub = subRes?.data;

  const donateMut = useMutation({
    mutationFn: () => charitiesApi.donate(charity.id, Number(amount)),
    onSuccess: () => {
      toast.success(`Successfully donated £${amount} to ${charity.name}! 🎉`);
      setShowDonate(false);
      setAmount('');
      queryClient.invalidateQueries({ queryKey: ['charities'] });
      queryClient.invalidateQueries({ queryKey: ['my-donations'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Donation failed. Please try again.');
    },
  });

  const handleDonateClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to make a donation.');
      navigate('/login');
      return;
    }
    setShowDonate(true);
  };

  const handleDonateSubmit = () => {
    if (!amount || Number(amount) < 1) {
      toast.error('Minimum donation is £1.');
      return;
    }
    donateMut.mutate();
  };

  const pct = Math.min(100, Math.round((charity.total_raised / 50000) * 100));

  return (
    <>
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

        <div className="flex gap-2">
          {!isAuthenticated ? (
            <Link to="/register" className="btn-primary btn-sm flex-1">
              Support <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : null}
          <button 
            onClick={handleDonateClick} 
            disabled={isAuthenticated && (!sub || sub.status !== 'active')}
            className="btn-secondary btn-sm flex-1 bg-brand/10 text-brand hover:bg-brand/20 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
            title={isAuthenticated && (!sub || sub.status !== 'active') ? 'Active subscription required to donate' : ''}
          >
            <Heart className="w-3.5 h-3.5" /> Donate Now
          </button>
        </div>
      </motion.div>

      {/* Donation Modal */}
      {showDonate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-ink mb-2">Donate to {charity.name}</h3>
              <p className="text-sm text-ink-muted mb-6">Make a direct one-time contribution.</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[10, 25, 50, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`py-3 rounded-xl border-2 font-bold transition-all ${
                      amount === val ? 'border-brand bg-brand/10 text-brand' : 'border-border text-ink hover:border-brand/40'
                    }`}
                  >
                    £{val}
                  </button>
                ))}
              </div>
              
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-bold">£</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={e => setAmount(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Custom amount"
                  className="input pl-8 font-bold text-lg"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleDonateSubmit}
                  disabled={!amount || donateMut.isPending}
                  className="btn-primary flex-1"
                >
                  {donateMut.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : `Donate ${amount ? '£' + amount : ''}`}
                </button>
                <button
                  onClick={() => { setShowDonate(false); setAmount(''); }}
                  disabled={donateMut.isPending}
                  className="btn-ghost flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
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
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search charities..."
                className="input"
                style={{ paddingLeft: '2.5rem' }}
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
