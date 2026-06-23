import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import golfHero from '../../assets/golf.png';

interface AuthHeroProps {
  title: ReactNode;
  description: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export default function AuthHero({ title, description, icon, children }: AuthHeroProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="hidden md:flex flex-col relative overflow-hidden bg-hero-gradient text-white">
      {/* 
        Background Image Layer 
        Positioned at the bottom, covers the width, maintains aspect ratio
      */}
      <div className="absolute inset-x-0 bottom-0 top-1/4 z-0">
        <img 
          src={golfHero} 
          alt="Golf background" 
          className="w-full h-full object-cover object-bottom opacity-90"
        />
        {/* 
          Gradient overlay to blend the image with the blue-green background
          and ensure text readability.
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#062c29]/90 via-[#0F766E]/40 to-[#0F766E]/0 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-between h-full p-12">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 w-fit group">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-105">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">GolfForGood</span>
        </Link>

        {/* Marketing Copy */}
        <div className="mt-auto mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            {icon && <div className="mb-6">{icon}</div>}
            <h2 className="text-4xl lg:text-5xl font-bold mb-5 drop-shadow-md leading-tight text-white">
              {title}
            </h2>
            <p className="text-white/90 text-lg lg:text-xl mb-8 max-w-md drop-shadow-sm leading-relaxed font-medium">
              {description}
            </p>
            {children && (
              <div className="space-y-4">
                {children}
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="text-white/60 text-sm font-medium drop-shadow-sm">
          © {currentYear} GolfForGood
        </div>
      </div>
    </div>
  );
}
