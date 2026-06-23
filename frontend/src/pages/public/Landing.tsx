import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy, Heart, ArrowRight, CheckCircle, Star,
  Users, TrendingUp, Award, Play, ChevronRight, Sparkles
} from 'lucide-react';

// ── Animated Counter ──────────────────────────────────────────────
function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = to / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, to);
      setCount(Math.floor(current));
      if (current >= to) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
  );
}

// ── Fade-in on scroll ─────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Draw Number Ball ──────────────────────────────────────────────
function DrawBall({ number, delay }: { number: number; delay: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 12, delay }}
      className="w-14 h-14 rounded-full bg-gradient-to-br from-gold to-gold-hover flex items-center justify-center shadow-gold text-white font-bold text-lg"
    >
      {number}
    </motion.div>
  );
}

export default function Landing() {
  const steps = [
    { num: '01', icon: Trophy, title: 'Subscribe', desc: 'Choose monthly or yearly. Your subscription funds the prize pool AND charitable causes.', color: 'text-brand' },
    { num: '02', icon: Target, title: 'Enter Scores', desc: 'Log your latest 5 golf scores. They become your draw entry numbers automatically.', color: 'text-[#2563EB]' },
    { num: '03', icon: Heart, title: 'Support Charity', desc: 'Select a charity to receive your contribution — minimum 10%, you choose how much.', color: 'text-brand' },
    { num: '04', icon: Award, title: 'Win Rewards', desc: 'Monthly draws with 3-match, 4-match and 5-match jackpots. Real prizes, real impact.', color: 'text-gold' },
  ];

  const stats = [
    { value: 127300, prefix: '£', suffix: '+', label: 'Raised for Charity' },
    { value: 3326, suffix: '+', label: 'Active Members' },
    { value: 5, label: 'Partner Charities' },
    { value: 48, suffix: '%', label: 'Average Contribution Rate' },
  ];

  const testimonials = [
    { name: 'James R.', role: '5-Match Winner', text: 'Won £8,400 last March. But the best part? Knowing £1,000 of my subscription went to Green Earth Foundation.', stars: 5 },
    { name: 'Priya S.', role: 'Yearly Member', text: 'GolfForGood combines two things I love — golf and giving back. The draw system is thrilling.', stars: 5 },
    { name: 'Tom H.', role: 'Monthly Member', text: 'Finally a subscription that feels worthwhile. The charity impact dashboard is incredibly motivating.', stars: 5 },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center bg-hero-gradient overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-gold blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        </div>

        <div className="container-app relative z-10 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-gold" />
              Monthly draws with real jackpots
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Play Golf.{' '}
            <span className="text-gold">Give Back.</span>
            <br />Win Rewards.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto mb-10"
          >
            The only golf subscription that rewards your game AND funds the causes you care about.
            Every score you enter is a chance to win — and a contribution to change.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-lg bg-white text-brand hover:bg-white/90 shadow-xl font-bold">
              Start Playing for Good
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/#how-it-works" className="btn-lg border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
              <Play className="w-4 h-4" />
              How It Works
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-white/60 text-sm"
          >
            {['No long-term commitment', '10% minimum charity contribution', 'Real monthly prizes'].map(badge => (
              <span key={badge} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" /> {badge}
              </span>
            ))}
          </motion.div>

          {/* Floating draw preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-16 inline-flex flex-col items-center"
          >
            <p className="text-white/50 text-xs uppercase tracking-widest mb-4">Last Draw Numbers</p>
            <div className="flex gap-3">
              {[12, 25, 31, 40, 44].map((n, i) => (
                <DrawBall key={n} number={n} delay={0.7 + i * 0.08} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-border">
        <div className="container-app">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={i * 0.1} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-brand mb-1">
                  <Counter to={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-ink-muted">{stat.label}</div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="section bg-white">
        <div className="container-app">
          <FadeIn className="text-center mb-16">
            <span className="badge badge-brand mb-4">Simple Process</span>
            <h2 className="section-title mb-4">How GolfForGood Works</h2>
            <p className="section-subtitle mx-auto">Four simple steps to play golf, support charity, and win life-changing prizes.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div className="card text-center group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 relative">
                  <div className="text-5xl font-black text-border/80 mb-4">{step.num}</div>
                  <div className={`w-12 h-12 rounded-2xl bg-surface flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>
                  <h3 className="font-bold text-lg text-ink mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{step.desc}</p>
                  {i < steps.length - 1 && (
                    <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-border z-10" />
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHARITY IMPACT ───────────────────────────────────────── */}
      <section className="section bg-brand/5">
        <div className="container-app">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="badge badge-brand mb-4">Real Impact</span>
              <h2 className="section-title mb-6">Your Game Funds Real Change</h2>
              <p className="text-ink-muted mb-8 leading-relaxed">
                Every subscription payment is split: a portion goes into the prize pool, and a guaranteed minimum 10% goes directly to your chosen charity. You choose how much more.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Education For All', pct: 65, raised: '£32,100' },
                  { label: 'Green Earth Foundation', pct: 85, raised: '£48,250' },
                  { label: 'Hearts & Health', pct: 45, raised: '£21,750' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-ink">{item.label}</span>
                        <span className="text-brand font-semibold">{item.raised}</span>
                      </div>
                      <div className="h-2 bg-surface rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-brand rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.pct}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          viewport={{ once: true }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/charities" className="btn-primary btn-md mt-8 inline-flex">
                Explore Charities <ArrowRight className="w-4 h-4" />
              </Link>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Heart, value: '£127K+', label: 'Total Raised', color: 'text-brand' },
                  { icon: Users, value: '3,326', label: 'Members Giving', color: 'text-[#2563EB]' },
                  { icon: TrendingUp, value: '48%', label: 'Avg. Contribution', color: 'text-brand' },
                  { icon: Award, value: '5', label: 'Charity Partners', color: 'text-gold' },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="card text-center">
                    <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} />
                    <div className="text-2xl font-bold text-ink mb-1">{value}</div>
                    <div className="text-xs text-ink-muted">{label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── REWARDS SECTION ──────────────────────────────────────── */}
      <section className="section bg-gold-light">
        <div className="container-app">
          <FadeIn className="text-center mb-16">
            <span className="badge badge-gold mb-4">Prize Pool</span>
            <h2 className="section-title mb-4">Monthly Jackpots Worth Playing For</h2>
            <p className="section-subtitle mx-auto">Your scores are your lottery numbers. Match them with the draw — and win big.</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { level: '3 Match', pct: '25%', desc: 'Match 3 of 5 numbers', color: 'border-[#2563EB]', badge: 'bg-blue-100 text-blue-800', example: '£2,500' },
              { level: '4 Match', pct: '35%', desc: 'Match 4 of 5 numbers', color: 'border-brand', badge: 'bg-teal-100 text-teal-800', example: '£3,500' },
              { level: '5 Match', pct: '40%', desc: 'Match all 5 numbers — JACKPOT!', color: 'border-gold shadow-gold', badge: 'bg-amber-100 text-amber-800', example: '£4,000+', featured: true },
            ].map(prize => (
              <FadeIn key={prize.level}>
                <div className={`card border-2 ${prize.color} ${prize.featured ? 'scale-105' : ''} relative`}>
                  {prize.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-gold px-3 py-1">⭐ Jackpot</span>
                  )}
                  <div className={`badge ${prize.badge} mb-4`}>{prize.level}</div>
                  <div className="text-4xl font-black text-gold mb-2">{prize.pct}</div>
                  <div className="text-sm text-ink-muted mb-3">{prize.desc}</div>
                  <div className="text-sm font-medium text-ink">Example: <span className="text-brand font-bold">{prize.example}</span></div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center">
            <p className="text-sm text-ink-muted mb-6">Based on 100 subscribers at £10/month. Jackpot rolls over if no 5-match winner.</p>
            <Link to="/register" className="btn-gold btn-lg">
              <Trophy className="w-5 h-5" /> Start Winning Today
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────── */}
      <section id="pricing" className="section bg-white">
        <div className="container-app">
          <FadeIn className="text-center mb-16">
            <h2 className="section-title mb-4">Simple, Transparent Pricing</h2>
            <p className="section-subtitle mx-auto">No hidden fees. Cancel anytime. Every penny goes towards prizes and charity.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                name: 'Monthly', price: '£9.99', period: '/month',
                features: ['Golf score tracking', 'Monthly draw entry', 'Charity contribution', 'Winner dashboard'],
                cta: 'Get Monthly', href: '/register?plan=monthly', featured: false,
              },
              {
                name: 'Yearly', price: '£99.99', period: '/year',
                badge: 'Save 17%',
                features: ['All monthly features', '12 months access', 'Priority draw entry', 'Yearly impact report', 'Early winner alerts'],
                cta: 'Get Yearly', href: '/register?plan=yearly', featured: true,
              },
            ].map(plan => (
              <FadeIn key={plan.name}>
                <div className={`card relative ${plan.featured ? 'border-2 border-brand shadow-brand' : ''}`}>
                  {plan.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge badge-success px-3 py-1">{plan.badge}</span>
                  )}
                  <h3 className="text-lg font-bold text-ink mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-black text-ink">{plan.price}</span>
                    <span className="text-ink-muted">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-ink-muted">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.href} className={`${plan.featured ? 'btn-primary' : 'btn-secondary'} btn-md w-full`}>
                    {plan.cta}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="section bg-surface">
        <div className="container-app">
          <FadeIn className="text-center mb-16">
            <h2 className="section-title mb-4">Loved by Golfers, Praised by Causes</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.1}>
                <div className="card hover:shadow-elevated transition-all duration-300">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-ink-muted text-sm leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-brand">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.name}</p>
                      <p className="text-xs text-ink-muted">{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="section bg-hero-gradient text-white">
        <div className="container-app text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Play for Good?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of golfers who play, give, and win every month. Your first draw is just one subscription away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-xl bg-white text-brand hover:bg-white/95 font-bold shadow-xl">
                Start for £9.99/month <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/charities" className="btn-xl border-2 border-white/40 text-white hover:bg-white/10">
                Explore Charities
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}

// Missing import fix
function Target({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
