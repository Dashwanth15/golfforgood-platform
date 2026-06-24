import { useState } from 'react';
import { Link } from 'react-router-dom';
import golfHeroWebp from '../../assets/golf.webp';
import golfHeroPng from '../../assets/golf.png';

export default function AuthHero() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Link to="/" className="block relative overflow-hidden w-full h-full group bg-[#062c29]">
      {/* Skeleton placeholder — shown instantly while image loads */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#062c29] via-[#0a4a40] to-[#062c29]"
        style={{ opacity: loaded ? 0 : 1, transition: 'opacity 0.4s ease' }}
        aria-hidden="true"
      />

      {/* Optimised hero image — WebP with PNG fallback */}
      <picture>
        <source srcSet={golfHeroWebp} type="image/webp" />
        <img
          src={golfHeroPng}
          alt="Golfer at sunrise — GolfForGood"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover object-left-top"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      </picture>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
    </Link>
  );
}
